import { useUserData } from "@/contexts/userDataApi";
import ExerciseCard from "../ActivitiesComponents/exerciseCard";

interface Exercise {
  typeId: string;
  address: string | { latitude: number; longitude: number; };
  id: string;
  image: string;
  title: string;
  dateTime: string;
  participants: number;
  isPrivate: boolean;
  creatorId: string; 
  description: string;
  completedAt: string;  
}

interface ActivitySectionDataListPage {
  exercises: Exercise[];
}

function ActivitySectionListPage({ exercises }: ActivitySectionDataListPage) {
  const { userData } = useUserData();
  const userId = userData?.id || null;

  // Define the limit for the number of activities to display
  const activityLimit = 16;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exercises.slice(0, activityLimit).map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            activity={{
              id: exercise.id,
              title: exercise.title,
              name: exercise.title,
              description: exercise.description || "",
              scheduledDate: exercise.dateTime,
              participantCount: exercise.participants,
              private: exercise.isPrivate,
              image: exercise.image,
              creatorId: exercise.creatorId,
              typeId: exercise.typeId, 
              address: exercise.address, 
              completedAt: exercise.completedAt, // Add a default value for completedAt
            }}
            userId={userId}
            image={exercise.image}
            title={exercise.title}
            dateTime={exercise.dateTime}
            participants={exercise.participants}
            isPrivate={exercise.isPrivate}
            variant="small"
          />
        ))}
      </div>
    </div>
  );
}

export default ActivitySectionListPage;
