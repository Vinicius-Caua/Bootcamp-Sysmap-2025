import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import defaultActivity from "@/assets/default-activity.png"; // Default image path
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useEffect, useState } from "react";
import ActivityTypeCard from "../ActivitiesComponents/activityTypeCard";
import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import postActivitiesNewRoute from "@/api/routes/Atividades/postActivitiesNewRoute";
import { Image } from "lucide-react";
import MapDraggablePin from "../MapsComponents/mapDraggablePin";
import { toast } from "sonner";
interface CreateNewActivityProps {
  onClose: () => void;
}

interface Activity {
  id: string;
  name: string;
  image: string;
}

function CreateNewActivity({ onClose }: CreateNewActivityProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]); // State to manage activities
  const [selectedTypeId, setSelectedTypeId] = useState<string[]>([]); // State to manage selected activity types
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold the preview URL
  const [isPrivate, setIsPrivate] = useState(false); // State to manage if the activity is private or public

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

  // Effect to get the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const loc = { lat: latitude, lng: longitude };
          setCreatorLocation(loc);
          setActivityLocation({ latitude, longitude });
        },
        () => {
          toast.error(
            "Erro ao obter localização. Por favor, permita o acesso à localização."
          );
        }
      );
    } else {
      toast.warning("Geolocalização não é suportada pelo navegador.");
    }
  }, []);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!activityLocation) {
      toast.warning("Por favor, defina o ponto de encontro no mapa.");
      return;
    }

    const formData = new FormData();

    // Get values from the form
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    )?.value;
    const scheduledDate = (document.getElementById("date") as HTMLInputElement)
      ?.value;
    const fileInput = (document.getElementById("image") as HTMLInputElement)
      ?.files?.[0];

    // Validate the scheduled date
    const selectedDate = new Date(scheduledDate);
    const now = new Date();

    if (selectedDate <= now) {
      toast.error("A data da atividade não pode ser anterior à data atual");
      return;
    }

    // Varify if all required fields are filled
    if (
      !title ||
      !description ||
      !scheduledDate ||
      !selectedTypeId[0] ||
      !fileInput
    ) {
      toast.warning("Complete todos os campos obrigatórios.");
      return;
    }

    // Append data to FormData
    formData.append("title", title);
    formData.append("description", description);
    formData.append("typeId", selectedTypeId[0]);
    formData.append("address", JSON.stringify(activityLocation));
    formData.append("scheduledDate", new Date(scheduledDate).toISOString());
    formData.append("private", isPrivate ? "true" : "false");
    formData.append("image", fileInput);

    // Send the form data to the API
    postActivitiesNewRoute(formData)
      .then(() => {
        toast.success("Atividade criada com sucesso");
        setTimeout(() => {
          onClose();
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

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

  return (
    <>
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
            className=""
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
                  activities.map((activity) => (
                    <CarouselItem
                      key={activity.id}
                      className="md:basis-1/2 lg:basis-1/3 "
                    >
                      <ActivityTypeCard
                        title={activity.name}
                        image={activity.image || defaultActivity}
                        selected={selectedTypeId.includes(activity.id)}
                        onClick={() => handleSelect(activity.id)} // Handle selection
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
                  setActivityLocation({ latitude: loc.lat, longitude: loc.lng })
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
        <div className="flex justify-end mt-4 ">
          <Button type="submit" className="w-56 h-12" onClick={handleSubmit}>
            Criar
          </Button>
        </div>
      </div>
    </>
  );
}
export default CreateNewActivity;
