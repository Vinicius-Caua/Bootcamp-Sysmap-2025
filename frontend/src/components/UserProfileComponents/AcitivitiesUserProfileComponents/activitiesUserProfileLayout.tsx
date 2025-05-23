import { useUserData } from "@/contexts/userDataApi";
import ExerciseCard from "../../ActivitiesComponents/exerciseCard";

interface Exercise {
  id: string;
  image: string;
  title: string;
  dateTime: string;
  participants: number;
  isPrivate: boolean;
  description: string;
  typeId: string;
  creatorId: string;
  address: string; 
  completedAt: string;
}

interface ActivitySectionDataUserProfile {
  exercises: Exercise[];
}

function ActivitiesUserProfileLayout({ exercises }: ActivitySectionDataUserProfile) {
  const { userData } = useUserData();
  const userId = userData?.id || null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {exercises.map((exercise) => (
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
              completedAt: exercise.completedAt, 
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

export default ActivitiesUserProfileLayout;