import ExerciseCard from "@/components/ActivitiesComponents/exerciseCard";
import getActivitiesPaginated from "@/api/routes/Atividades/getActivitiesPaginatedRoute";
import defaultImage from "@/assets/default-activity.png";
import { useEffect, useState } from "react";
import { useUserData } from "@/contexts/userDataApi";
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
  typeId: string;
  creatorId: string;
  address: string | { latitude: number; longitude: number };
  completedAt: string;
}

interface MappedActivity {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  participantCount: number;
  private: boolean;
  image: string;
  address: string | { latitude: number; longitude: number };
  creatorId: string;
  typeId: string;
  creator?: {
    id: string;
    name: string;
  };
}

interface ActivitiesGridProps {
  title: string; // Custom title for the grid
  typeId?: string; // Optional type ID to filter activities
}

function ActivitiesGrid({ title, typeId }: ActivitiesGridProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { userData } = useUserData();
  const userId = userData?.id || null;

  useEffect(() => {
    // Fetch activities with optional typeId filter
    getActivitiesPaginated({ page: 1, pageSize: 8, typeId })
      .then((data) => {
        const mappedActivities = data.activities.map(
          (activity: MappedActivity) => ({
            id: activity.id,
            name: activity.creator?.name || "", 
            title: activity.title,
            description: activity.description,
            scheduledDate: activity.scheduledDate,
            participantCount: activity.participantCount,
            private: activity.private,
            image: activity.image,
            creatorId: activity.creator?.id, 
            address: activity.address || "", // Ensure address is included
            typeId: activity.typeId,
          })
        );
        setActivities(mappedActivities); // Set the activities data
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetching data
      });
  }, [typeId]); // Refetch when typeId changes

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-bebas text-title text-[28px]">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full h-full">
        {isLoading ? (
          <p>Carregando atividades...</p>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <ExerciseCard
              key={activity.id}
              activity={activity} 
              userId={userId}     
              image={activity.image || defaultImage}
              title={activity.title}
              dateTime={activity.scheduledDate}
              participants={activity.participantCount}
              isPrivate={activity.private}
            />
          ))
        ) : (
          <p>Nenhuma atividade encontrada.</p>
        )}
      </div>
    </section>
  );
}

export default ActivitiesGrid;
