import { Ban, Calendar, Image, Lock, Unlock, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DefaultMap from "../MapsComponents/defaultMap";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import getParticipantsOfActivity from "@/api/routes/Atividades/getActivitiesIdParticipantsRoute";
import Profile from "../profile";
import { ScrollArea } from "../ui/scroll-area";
import getActivitiesAll from "@/api/routes/Atividades/getActivitiesAllRoute";
import postSubscribeForActivity from "@/api/routes/Atividades/postActivitiesIdSubscribeRoute";
import { useUserData } from "@/contexts/userDataApi";
import deleteUnsubscribeActivity from "@/api/routes/Atividades/deleteActivitiesIdUnsubscribeRoute";
import { toast } from "sonner";
import CheckInToActivity from "./checkInToActivity";

interface Activity {
  id: string;
  name: string;
  title: string;
  description: string;
  scheduledDate: string;
  participantCount: number;
  private: boolean;
  image: string;
  completedAt: string;
  deletedAt?: string;
  creatorId: string;
  typeId: string;
  address: string | object;
  creator?: {
    name: string;
    avatar: string;
  };
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscriptionStatus: string;
  confirmedAt: string;
}

interface ParticipantViewProps {
  activity: Activity;
}

function ParticipantView({ activity }: ParticipantViewProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [activityLocation, setActivityLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [creatorInfo, setCreatorInfo] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const userData = useUserData();
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<
    string | null
  >(null);
  const [waitForApiResponse, setWaitForApiResponseg] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  function formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Check if activity is in progress (started already)
  const isActivityInProgress = (scheduledDate: string): boolean => {
    const now = new Date();
    const activityDate = new Date(scheduledDate);
    return activityDate <= now;
  };

  // Check if activity is starting soon (within 30 minutes)
  const isActivityStartingSoon = (scheduledDate: string): boolean => {
    const now = new Date();
    const activityDate = new Date(scheduledDate);
    const diffInMs = activityDate.getTime() - now.getTime();
    const diffInMinutes = diffInMs / 60000;
    return diffInMinutes <= 30 && diffInMinutes > 0;
  };

  // Check if user should see check-in screen
  // This is true only if:
  // 1. User is approved
  // 2. Activity is starting within 30 minutes
  // 3. Activity has not already started
  const shouldShowCheckIn =
    userSubscriptionStatus === "APPROVED" &&
    isActivityStartingSoon(activity.scheduledDate) &&
    !isActivityInProgress(activity.scheduledDate);

  // Effect to check if we should show check-in modal instead
  useEffect(() => {
    // If activity is completed, hide check-in modal
    if (activity.completedAt) {
      setShowCheckInModal(false);
      return;
    }

    // If user is approved and activity is starting soon, show check-in modal
    // Otherwise, hide it
    if (shouldShowCheckIn) {
      setShowCheckInModal(true);
    } else {
      setShowCheckInModal(false);
    }
  }, [shouldShowCheckIn, activity.completedAt]);

  useEffect(() => {
    getActivitiesAll({}).then((activities) => {
      const fullActivity = activities.find(
        (act: Activity) => act.id === activity.id
      );

      if (fullActivity && fullActivity.creator) {
        setCreatorInfo({
          name: fullActivity.creator.name,
          avatar: fullActivity.creator.avatar,
        });
      }
    });
  }, [activity]);

  // Effect to set the activity location based on the address
  useEffect(() => {
    if (activity && activity.address) {
      try {
        // Convert the address string to an object if it's a string
        const addressData =
          typeof activity.address === "string"
            ? JSON.parse(activity.address)
            : activity.address;

        // Check if the addressData is an object with latitude and longitude
        setActivityLocation(addressData);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
  }, [activity]);

  // This effect is used to check if the user is already subscribed to the activity
  // and to set the subscription status accordingly.
  useEffect(() => {
    if (activity && activity.id && userData.userData?.id) {
      getParticipantsOfActivity(activity.id)
        .then((result) => {
          // Find the current user in the participants list
          // and set the subscription status based on their status
          const currentUser = result.find(
            (p: { userId: string }) => p.userId === userData.userData?.id
          );

          if (currentUser) {
            setUserSubscriptionStatus(currentUser.subscriptionStatus);

            // Check if all conditions are met to display check-in modal:
            // 1. User is approved for this activity
            const isApproved = currentUser.subscriptionStatus === "APPROVED";

            // 2. Activity is starting within 30 minutes
            const isSoon = isActivityStartingSoon(activity.scheduledDate);

            // 3. Activity has not already started
            const notStarted = !isActivityInProgress(activity.scheduledDate);

            // If all conditions are ok, show check-in modal directly
            if (isApproved && isSoon && notStarted) {
              setShowCheckInModal(true);
            }
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [activity, userData.userData?.id]);

  // Effect to set the image preview and private status
  useEffect(() => {
    if (activity) {
      setIsPrivate(activity.private);
      setImagePreview(activity.image);
    }
  }, [activity]);

  // Search for the creator in the participants list
  useEffect(() => {
    if (activity && activity.id) {
      getParticipantsOfActivity(activity.id)
        .then((result) => {
          setParticipants(result);
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [activity]);

  const handleParticipate = () => {
    setWaitForApiResponseg(true); // Set loading state to true

    postSubscribeForActivity(activity.id)
      .then(() => {
        toast.success("Inscrição realizada com sucesso!");
        getParticipantsOfActivity(activity.id).then((updatedParticipants) => {
          setParticipants(updatedParticipants);
        });
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setWaitForApiResponseg(false); // Reset loading state
      });
  };

  const handleUnsubscripe = () => {
    setWaitForApiResponseg(true); // Set loading state to true
    deleteUnsubscribeActivity(activity.id)
      .then(() => {
        toast.success("Inscrição cancelada com sucesso!");

        // Fetch updated participants after unsubscribing
        // and update the participants state
        getParticipantsOfActivity(activity.id).then((updatedParticipants) => {
          setParticipants(updatedParticipants);
        });
      })
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => {
        setWaitForApiResponseg(false); // Reset loading state
      });
  };

  // Return check-in modal only if conditions are met AND activity is not concluded
  if (showCheckInModal) {
    return <CheckInToActivity activity={activity} />;
  }

  return (
    <>
      <DialogContent className="lg:max-w-212 lg:max-h-192.5 h-188 max-w-90 flex flex-col overflow-y-scroll lg:overflow-y-hidden">
        <VisuallyHidden>
          <DialogTitle>Detalhes da atividade</DialogTitle>
        </VisuallyHidden>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-56 border border-gray-200 rounded-lg flex items-center justify-center">
                <Image className="text-gray-200 h-20" />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview da imagem"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg "
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col h-full justify-between">
              <h1 className="truncate">{activity.title}</h1>
              <div className="flex flex-col gap-2 w-full h-36 break-words ">
                <div className="break-words overflow-y-auto max-h-36">
                  <span> {activity.description} </span>
                </div>
              </div>

              <div className="space-y-3 text-sm pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="text-emerald-500" />
                  {activity.scheduledDate
                    ? formatDateTime(activity.scheduledDate)
                    : "Data não disponível"}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-emerald-500" />
                  {activity.participantCount} Participantes
                </div>
                <div className="flex items-center gap-2">
                  {isPrivate ? (
                    <>
                      <Lock className="text-emerald-500" />
                      <span>Mediante aprovação</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="text-emerald-500" />
                      <span>Aberto ao público</span>
                    </>
                  )}
                </div>
              </div>

              {/* Buttons for different status */}
              <div className="pt-4">
                {/* Check if activity is Deleted first */}
                {activity.deletedAt ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12"
                    variant="danger"
                    disabled
                  >
                    <span className="font-bold text-white">
                      Atividade excluída
                    </span>
                  </Button>
                ) : // Check if activity is completed
                activity.completedAt ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12"
                    variant="outline"
                    disabled
                  >
                    <span className="font-bold text-black">
                      Atividade encerrada
                    </span>
                  </Button>
                ) : isActivityInProgress(activity.scheduledDate) ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 cursor-default font-bold"
                    variant="outline"
                  >
                    Atividade em andamento
                  </Button>
                ) : userSubscriptionStatus === "WAITING" ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 cursor-default font-bold"
                    variant="primary"
                  >
                    Aguardando aprovação
                  </Button>
                ) : userSubscriptionStatus === "REJECTED" ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 cursor-not-allowed font-bold"
                    variant="danger"
                  >
                    <Ban className="h-6 w-6 mr-2" /> Inscrição negada
                  </Button>
                ) : userSubscriptionStatus === "APPROVED" ? (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 font-bold"
                    variant="dangerOutline"
                    onClick={handleUnsubscripe}
                    disabled={waitForApiResponse}
                  >
                    Desinscrever
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 font-bold"
                    variant="primary"
                    onClick={handleParticipate}
                    disabled={waitForApiResponse}
                  >
                    Participar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full h-full">
            <div className="flex flex-col gap-1.5 w-full h-62">
              <span className="font-bebas text-black text-[28px]">
                Ponto de encontro
              </span>
              <div>
                {activityLocation && <DefaultMap location={activityLocation} />}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <span className="font-bebas text-black text-[28px]">
                Participantes
              </span>

              <ScrollArea className="w-full h-88">
                <div className="flex flex-col w-full h-88 gap-2">
                  {creatorInfo && (
                    <div className="flex items-center gap-2">
                      <Profile image={creatorInfo.avatar} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">
                          {creatorInfo.name}
                        </span>
                        <span className="text-[12px]">Organizador</span>
                      </div>
                    </div>
                  )}

                  {participants.length > 0 ? (
                    participants
                      .filter(
                        (participant) => participant.id !== activity.creatorId
                      )
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-2 pb-2"
                        >
                          <Profile image={participant.avatar} />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {participant.name}
                            </span>
                            {participant.subscriptionStatus === "APPROVED" ? (
                              <span className="text-xs text-green-500">
                                Aprovado
                              </span>
                            ) : participant.subscriptionStatus === "WAITING" ? (
                              <span className="text-xs text-yellow-500">
                                Pendente
                              </span>
                            ) : participant.subscriptionStatus ===
                              "REJECTED" ? (
                              <span className="text-xs text-red-500">
                                Rejeitado
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="w-full text-center py-4 text-gray-500">
                      Esta atividade ainda não possui outros participantes
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default ParticipantView;
