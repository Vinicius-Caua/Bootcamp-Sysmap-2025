import {
  Calendar,
  Check,
  Flag,
  Image,
  Lock,
  Unlock,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DefaultMap from "../MapsComponents/defaultMap";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import getParticipantsOfActivity from "@/api/routes/Atividades/getActivitiesIdParticipantsRoute";
import Profile from "../profile";
import profilePhoto from "@/assets/profile-photo.svg";
import { useUserData } from "@/contexts/userDataApi";
import { ScrollArea } from "../ui/scroll-area";
import putApproveParticipant from "@/api/routes/Atividades/putActivitiesIdApproveRoute";
import { Label } from "../ui/label";
import getActivitiesPaginated from "@/api/routes/Atividades/getActivitiesPaginatedRoute";
import putConcludeActivity from "@/api/routes/Atividades/putActivitiesIdConcludeRoute";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  name: string;
  title: string;
  description: string;
  scheduledDate: string;
  participantCount: number;
  private: boolean;
  image: string;
  creatorId: string;
  typeId: string;
  address: string | object;
  completedAt: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscriptionStatus: string;
  confirmedAt: string;
}

interface ConcludeActivityProps {
  activity: Activity;
  initialState?: { concluded: boolean };
  onEdit?: () => void;
}

function ConcludeActivity({
  activity,
  initialState = { concluded: false },
}: ConcludeActivityProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold the preview URL
  const [isPrivate, setIsPrivate] = useState(false); // State to manage if the activity is private or not
  const [activityConcluded, setActivityConcluded] = useState(
    initialState.concluded
  );
  const [activityLocation, setActivityLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]); // State to hold the participants of the activity
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [checkInCode, setCheckInCode] = useState<string | null>(null); // State to hold the check-in code
  const userData = useUserData();

  // Effect to set the initial state of the activity concluded status
  // This effect runs when the component mounts and whenever the initialState.concluded changes
  useEffect(() => {
    setActivityConcluded(initialState.concluded);
  }, [initialState.concluded]);

  function formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Search for the creator in the participants list
  useEffect(() => {
    getActivitiesPaginated({}).then((response) => {
      if (response.activities && response.activities.length > 0) {
        // Find the activity in the paginated response
        const fullActivity = response.activities.find(
          (act: Activity) => act.id === activity.id
        );

        if (fullActivity) {
          if (fullActivity.creator) {
            setCreatorInfo({
              name: fullActivity.creator.name,
              avatar: fullActivity.creator.avatar || "/default-avatar.jpg",
            });
          }

          // Check if the activity has a confirmation code
          if (fullActivity.confirmationCode) {
            setCheckInCode(fullActivity.confirmationCode);
          }
        }
      }
    });
  }, [activity]);

  // Handle to approve or reject a participant
  const handleApproveParticipant = (
    participantId: string,
    approved: boolean
  ) => {
    setProcessingId(participantId);

    putApproveParticipant(activity.id, {
      participantId: participantId,
      approved: approved,
    })
      .then(() => {
        return getParticipantsOfActivity(activity.id);
      })
      .then((updatedParticipants) => {
        setParticipants(updatedParticipants);
      });
  };

  // Handle to conclude the activity
  const handleConcludeActivity = () => {
    putConcludeActivity(activity.id)
      .then(() => {
        toast.success("Atividade concluída com sucesso!", {
          position: "bottom-right",
        });
        setActivityConcluded(true);
      })
      .catch((error) => {
        toast.error("Erro ao concluir atividade", {
          description: error.message,
        });
      });
  };

  useEffect(() => {
    if (activity && activity.address) {
      try {
        // Convert o JSON se o endereço for uma string
        const addressData =
          typeof activity.address === "string"
            ? JSON.parse(activity.address)
            : activity.address;

        // Define the activity location state with the address data
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

  useEffect(() => {
    if (activity) {
      // Fill the form fields with the current activity data
      const titleInput = document.getElementById("title") as HTMLInputElement;
      const descriptionInput = document.getElementById(
        "description"
      ) as HTMLTextAreaElement;
      const dateInput = document.getElementById("date") as HTMLInputElement;

      if (titleInput) titleInput.value = activity.title;
      if (descriptionInput) descriptionInput.value = activity.description;

      // Set the date input value to the local time zone
      if (dateInput && activity.scheduledDate) {
        const date = new Date(activity.scheduledDate);
        const localDatetime = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);
        dateInput.value = localDatetime;
      }

      // Set the isPrivate state based on the activity data
      setIsPrivate(activity.private);
      setImagePreview(activity.image);
    }
  }, [activity]);

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

              <div className="pt-4">
                {activityConcluded ? (
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
                ) : (
                  <Button
                    type="button"
                    className="lg:w-56 lg:h-12 w-1/2 h-12 font-bold"
                    variant="primary"
                    onClick={handleConcludeActivity}
                  >
                    <Flag className="h-6 w-6 mr-1" />
                    Encerrar Atividade
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
              <div className="mt-2">
                {activityLocation && <DefaultMap location={activityLocation} />}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full flex-grow">
              <span className="font-bebas text-black text-[28px]">
                Participantes
              </span>

              <div className="flex flex-col w-full h-88.75">
                <ScrollArea
                  className={cn(
                    "w-full pr-2",
                    checkInCode ? "h-51" : "h-88.75"
                  )}
                >
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2">
                      <Profile image={creatorInfo?.avatar || profilePhoto} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">
                          {userData.userData?.name}
                        </span>
                        <span className="text-[12px]">Organizador</span>
                      </div>
                    </div>

                    {participants.length > 0
                      ? participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between gap-2 pb-2"
                          >
                            <div className="flex items-center gap-2">
                              <Profile image={participant.avatar} />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold">
                                  {participant.name}
                                </span>

                                {participant.subscriptionStatus ===
                                "APPROVED" ? (
                                  <span className="text-xs text-green-500">
                                    Aprovado
                                  </span>
                                ) : participant.subscriptionStatus ===
                                  "WAITING" ? (
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

                            {/* Buttons for approve or denie*/}
                            {isPrivate &&
                              (participant.subscriptionStatus === "WAITING" ||
                                participant.subscriptionStatus ===
                                  "waiting") && (
                                <div className="flex gap-2 pr-6">
                                  <Button
                                    onClick={() =>
                                      handleApproveParticipant(
                                        participant.id,
                                        true
                                      )
                                    }
                                    size="sm"
                                    variant="primary"
                                    disabled={processingId === participant.id}
                                    className="h-8 w-8 p-0 rounded-full"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleApproveParticipant(
                                        participant.id,
                                        false
                                      )
                                    }
                                    size="sm"
                                    variant="danger"
                                    disabled={processingId === participant.id}
                                    className="h-8 w-8 p-0 rounded-full"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                          </div>
                        ))
                      : null}
                  </div>
                </ScrollArea>

                {/* Check-in section */}
                {!activityConcluded && checkInCode && (
                  <div className="flex flex-col justify-center w-full h-30 bg-[#F9F9F9] mt-6 p-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="text-emerald-500 h-5 w-5" />
                        <Label className="text-base font-medium">
                          Código de check-in
                        </Label>
                      </div>
                      <h1>{checkInCode}</h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default ConcludeActivity;
