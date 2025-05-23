import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import putActivityById from "@/api/routes/Atividades/putActivitiesIdUpdateRoute";
import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import MapDraggablePin from "../MapsComponents/mapDraggablePin";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import ActivityTypeCard from "../ActivitiesComponents/activityTypeCard";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import getActivitiesAll from "@/api/routes/Atividades/getActivitiesAllRoute";
import deleteExcludeActivity from "@/api/routes/Atividades/deleteActivitiesIdDeleteRoute";
import { toast } from "sonner";

interface Activity {
  id: string;
  name: string;
  title: string;
  description: string;
  scheduledDate: string;
  participantCount: number;
  private: boolean;
  image: string;
  creatorId?: string;
  typeId?: string;
  address?: string | object;
  type?: string; // Add this property to match the usage in the code
}

interface EditActivityProps {
  activity: Activity;
  onClose: () => void;
}

function EditActivity({ activity, onClose }: EditActivityProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]); // State to manage activities
  const [selectedTypeId, setSelectedTypeId] = useState<string[]>(
    activity.typeId ? [activity.typeId] : []
  ); // State to manage selected activity types
  const [isPrivate, setIsPrivate] = useState(false); // State to manage if the activity is private or not
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold the preview URL
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [date, setDate] = useState(() => {
    const d = new Date(activity.scheduledDate);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  // State to store the location of the activity
  // This will be set when the user drags the pin on the map
  const [activityLocation, setActivityLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // State to store the location of the creator
  // This will be set when the user's location is fetched
  const [creatorLocation, setCreatorLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Effect to preserve the current activity data when the component mounts
  useEffect(() => {
    if (activity && activity.id) {
      getActivitiesAll({})
        .then((allActivities) => {
          const fullActivity = allActivities.find(
            (act: Activity) => act.id === activity.id
          );

          if (fullActivity) {
            // Fill the form fields with the full activity data
            setTitle(fullActivity.title);
            setDescription(fullActivity.description);
            setDate(
              new Date(fullActivity.scheduledDate).toISOString().slice(0, 16)
            );
            setIsPrivate(fullActivity.private);
            setImagePreview(fullActivity.image);

            // Set the activity location if available
            if (fullActivity.address) {
              try {
                const addressData =
                  typeof fullActivity.address === "string"
                    ? JSON.parse(fullActivity.address)
                    : fullActivity.address;

                setActivityLocation(addressData);
                if (addressData.latitude && addressData.longitude) {
                  setCreatorLocation({
                    lat: addressData.latitude,
                    lng: addressData.longitude,
                  });
                }
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(`Erro ao processar endereço: ${error.message}`);
                } else {
                  toast.error("Erro ao processar endereço: Erro desconhecido");
                }
              }
            }
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [activity]);

  // Effect to fetch activities types
  useEffect(() => {
    getActivitiesTypes()
      .then((data) => {
        setActivities(data); // Set the activities data
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetching data
      });
  }, []);

  // Effect to match activity type with typeId
  useEffect(() => {
    if (activity && activities.length > 0) {
      // Se já temos um typeId, use-o diretamente
      if (activity.typeId) {
        setSelectedTypeId([activity.typeId]);
      }

      // Fetch activities types if typeId is not available
      if (activity.type) {
        const matchedType = activities.find(
          (t: { id: string; name: string; image: string }) =>
            t.name === activity.type
        );
        if (matchedType) {
          setSelectedTypeId([matchedType.id]);
        }
      }

      // Fetch all activities to get the full activity details
      getActivitiesAll({})
        .then((allActivities) => {
          const fullActivity = allActivities.find(
            (act: Activity) => act.id === activity.id
          );

          if (fullActivity) {
            // Se encontrarmos o typeId na atividade completa
            if (fullActivity.typeId) {
              setSelectedTypeId([fullActivity.typeId]);
            }
            // Se encontrarmos o nome do tipo na atividade completa
            else if (fullActivity.type) {
              const typeMatch = activities.find(
                (t: { id: string; name: string; image: string }) =>
                  t.name === fullActivity.type
              );
              if (typeMatch) {
                setSelectedTypeId([typeMatch.id]);
              }
            }
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [activity, activities]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSelect = (typeId: string) => {
    setSelectedTypeId([typeId]); // Set selectedTypeId to the clicked typeId
  };

  // Call the API to delete the activity
  const handleCancel = () => {
    deleteExcludeActivity(activity.id)
      .then(() => {
        toast.success("Atividade cancelada com sucesso");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();

    // Get form field values
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    )?.value;
    const scheduledDate = (document.getElementById("date") as HTMLInputElement)
      ?.value;
    const fileInput = (document.getElementById("image") as HTMLInputElement)
      ?.files?.[0];

    const selectedDate = new Date(scheduledDate);
    const now = new Date();

    if (selectedDate <= now) {
      toast.error("A data da atividade não pode ser anterior à data atual");
      return;
    }

    // Append fields to FormData
    formData.append("title", title);
    formData.append("description", description);
    formData.append("typeId", selectedTypeId[0]); // Send only the first selected ID
    formData.append("address", JSON.stringify(activityLocation)); // Convert to JSON string
    formData.append("scheduledDate", new Date(scheduledDate).toISOString()); // Convert to ISO 8601
    formData.append("private", isPrivate ? "true" : "false"); // Convert boolean to string

    // Only append image if fileInput exists
    if (fileInput) {
      formData.append("image", fileInput); // Add image file
    }

    if (!selectedTypeId[0]) {
      toast.error("O tipo da atividade não pode ser vazio");
      return;
    }
    // Send the form data to the API for update
    putActivityById(activity.id, formData)
      .then(() => {
        toast.success("Atividade editada com sucesso");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <DialogContent className="lg:max-w-196 lg:max-h-192.5 max-w-90 max-h-150 flex flex-col overflow-y-scroll lg:overflow-y-hidden">
        <DialogHeader>
          <DialogTitle>
            <span className="font-bebas leading-8 text-title text-[32px]">
              Editar a atividade
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 max-w-80 h-full">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="image" className="font-semibold">
                Imagem
                <span className="text-danger font-bold"> *</span>
              </Label>
              <div className="relative w-full h-32 cursor-pointer border border-gray-200 rounded-lg flex items-center justify-center">
                <Image className="text-gray-200 h-20" />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview da imagem"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg "
                  />
                )}
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer `}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="title" className="font-semibold">
                Título
                <span className="text-danger font-bold"> *</span>
              </Label>
              <Input
                type="text"
                id="title"
                className="w-full h-full"
                placeholder="Ex.: Aula de Ioga"
                defaultValue={title}
              ></Input>
            </div>

            <div className="flex flex-col gap-1.5 w-full h-full">
              <Label htmlFor="description" className="font-semibold">
                Descrição
                <span className="text-danger font-bold"> *</span>
              </Label>
              <Textarea
                id="description"
                className="w-full h-27.5 resize-none"
                placeholder="Como será a atividade? Quais as regras? O que é necessário para participar?"
                defaultValue={description}
              ></Textarea>
            </div>
            <div className="flex flex-col gap-1.5 w-full h-full">
              <Label htmlFor="description" className="font-semibold">
                Data
                <span className="text-danger font-bold"> *</span>
              </Label>
              <Input
                type="datetime-local"
                id="date"
                defaultValue={date}
              ></Input>
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-80 h-full">
            <div className="flex flex-col gap-1.5 w-full overflow-hidden">
              <Label htmlFor="activity" className="font-semibold">
                Tipo de atividade
                <span className="text-danger font-bold"> *</span>
              </Label>
              <div className="max-w-80 flex">
                <Carousel className="overflow-hidden">
                  <CarouselContent className="flex -ml-0">
                    {isLoading ? (
                      <p>Carregando...</p>
                    ) : (
                      activities.map((activityType) => (
                        <CarouselItem
                          key={activityType.id}
                          className="md:basis-1/2 lg:basis-1/3 "
                        >
                          <ActivityTypeCard
                            title={activityType.name}
                            image={activityType.image}
                            selected={selectedTypeId.includes(activityType.id)}
                            onClick={() => handleSelect(activityType.id)} // Handle selection
                          />
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full h-52">
              <Label htmlFor="localization" className="font-semibold">
                Ponto de encontro
                <span className="text-danger font-bold"> *</span>
              </Label>
              <div>
                {creatorLocation && (
                  <MapDraggablePin
                    initialCenter={creatorLocation}
                    onLocationChange={(loc) =>
                      setActivityLocation({
                        latitude: loc.lat,
                        longitude: loc.lng,
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="approvement" className="font-semibold">
                Requer aprovação para participar?
                <span className="text-danger font-bold"> *</span>
              </Label>
              <div className="flex w-[164px] gap-2">
                <Button
                  variant={isPrivate === true ? "dark" : "light"}
                  className="w-[77px] rounded-md"
                  onClick={() => setIsPrivate(true)} // Define isPrivate como true
                >
                  Sim
                </Button>
                <Button
                  variant={isPrivate === false ? "dark" : "light"}
                  className="w-[77px] rounded-md"
                  onClick={() => setIsPrivate(false)} // Define isPrivate como false
                >
                  Não
                </Button>
              </div>
            </div>

            {/* Button to cancel activity */}
            <div className="flex justify-end mt-8 gap-4">
              <Button
                variant="dangerOutline"
                className="lg:w-56 lg:h-12 w-1/2 h-12"
                onClick={handleCancel}
              >
                Cancelar Atividade
              </Button>
              <Button
                type="submit"
                className="lg:w-56 lg:h-12 w-1/2 h-12"
                onClick={handleSubmit}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default EditActivity;
