import { cn } from "@/lib/utils";
import ExerciseCard from "../ActivitiesComponents/exerciseCard";
import { useNavigate } from "react-router";

interface Exercise {
  id: string;
  image: string;
  title: string;
  dateTime: string;
  participants: number;
  isPrivate: boolean;
  description: string; 
  creatorId: string; 
  address: string | { latitude: number; longitude: number };
  completedAt: string;
}

interface ActivitySectionDataHome {
  title: string;
  exercises: Exercise[];
  typeId: string; // Add typeId to identify the activity type
  isLastAndOdd?: boolean; // Indicate if the section is the last and odd to show 12 activities
}

function ActivitySectionHome({
  title,
  exercises,
  typeId,
  isLastAndOdd,
  userId,
}: ActivitySectionDataHome & { userId: string }) {
  const navigate = useNavigate(); // Hook to navigate between routes

  // Define the limit for the number of activities to display
  const activityLimit = isLastAndOdd ? 12 : 6;
  const displayedExercises = exercises.slice(0, activityLimit); // Slice the array to get the first 6 or 12 activities

  const handleViewMore = () => {
    navigate(`/types-list/${typeId}/${title}`); // Navigate to the page with the typeId and title
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {exercises.length > 0 && <h1 className="text-[28px]">{title}</h1>}
        {exercises.length > activityLimit && (
          <span
            className="font-bold cursor-pointer"
            onClick={handleViewMore} // Call the navigation function on click
          >
            Ver mais
          </span>
        )}
      </div>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3",
          isLastAndOdd && "lg:grid-cols-4" // Use 4 columns if it's the last and odd section
        )}
      >
        {displayedExercises.map((exercise) => (
          <ExerciseCard
            key={`${title}-${exercise.id}`}
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
              address: exercise.address,
              completedAt: exercise.completedAt,
              typeId: typeId,
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

export default ActivitySectionHome;
