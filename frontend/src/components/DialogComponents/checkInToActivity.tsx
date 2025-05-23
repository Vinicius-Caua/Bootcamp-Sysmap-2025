import { Calendar, Check, Image, Lock, Unlock, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DefaultMap from "../MapsComponents/defaultMap";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import getParticipantsOfActivity from "@/api/routes/Atividades/getActivitiesIdParticipantsRoute";
import Profile from "../profile";
import { ScrollArea } from "../ui/scroll-area";
import getActivitiesAll from "@/api/routes/Atividades/getActivitiesAllRoute";
import { toast } from "sonner";
import { Input } from "../ui/input";
import putCheckinActivity from "@/api/routes/Atividades/putActivitiesIdCheckInRoute";

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

interface CheckInToActivityProps {
  activity: Activity;
}

function CheckInToActivity({ activity }: CheckInToActivityProps) {
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
  const [checkInCode, setCheckInCode] = useState("");
  const [checkInApproved, setCheckInApproved] = useState(false);
  const [waitForApiResponse, setWaitForApiResponse] = useState(false);

  function formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

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

  const handleCheckIn = () => {
    setWaitForApiResponse(true);

    putCheckinActivity(activity.id, checkInCode)
      .then(() => {
        setCheckInApproved(true);
        toast.success("Check-in realizado com sucesso!");
      })
      .catch((error) => {
        const errorMsg = error.message || "Erro ao realizar check-in";
        toast.error(errorMsg);
      })
      .finally(() => {
        setWaitForApiResponse(false);
      });
  };

  return (
    <>
      <DialogContent className="lg:max-w-212 lg:max-h-192.5 h-188 max-w-90 flex flex-col overflow-y-scroll lg:overflow-y-hidden">
        <VisuallyHidden>
          <DialogTitle>Check-in na atividade</DialogTitle>
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

              {/* Check-in form */}
              <div className="pt-4 flex flex-col gap-3">
                <span className="font-bebas text-black text-[28px]">
                  Faça seu Check-in
                </span>
                <div className="flex gap-1.5">
                  <Input
                    type="text"
                    placeholder="Digite o código de check-in"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value)}
                    className="w-full h-12 text-base"
                    disabled={checkInApproved}
                  />

                  {/* CheckInApproved or Not yet */}
                  {checkInApproved ? (
                    <Button
                      type="button"
                      className="lg:w-36 lg:h-12 w-full h-12 font-bold rounded-lg"
                      variant="primary"
                      disabled
                    >
                      <Check className="text-white" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="lg:w-36 lg:h-12 w-full h-12 font-bold rounded-lg"
                      variant="primary"
                      onClick={handleCheckIn}
                      disabled={waitForApiResponse || !checkInCode}
                    >
                      Confirmar
                    </Button>
                  )}
                </div>
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

export default CheckInToActivity;
