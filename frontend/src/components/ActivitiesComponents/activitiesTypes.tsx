import { useNavigate } from "react-router";
import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import ActivityTypeCard from "@/components/ActivitiesComponents/activityTypeCard";
import defaultImage from "@/assets/default-activity.png"; // Default image path
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Activity {
  id: string;
  name: string;
  image?: string;
}

function ActivitiesTypes({ title }: { title: string }) {
  const [activities, setActivities] = useState<Activity[]>([]); // State to store activities types
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const navigate = useNavigate();

  useEffect(() => {
    getActivitiesTypes()
      .then((data) => {
        setActivities(data);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetching data
      });
  }, []);

  const handleTypeClick = (typeId: string, typeName: string) => {
    navigate(`/types-list/${typeId}/${typeName}`); // Navigate to ListagemTipo with typeId and typeName
  };

  return (
    <div className="gap-4">
      <h1 className="text-[28px]">{title}</h1>
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          <p>Carregando tipos de atividades...</p>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleTypeClick(activity.id, activity.name)} // Handle click
              className="p-0 border-none bg-transparent cursor-pointer" // Reset button styles
            >
              <ActivityTypeCard title={activity.name} image={activity.image || defaultImage} />
            </button>
          ))
        ) : (
          <p>Nenhum tipo de atividade encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default ActivitiesTypes;
