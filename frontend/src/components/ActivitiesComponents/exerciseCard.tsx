import { CalendarDays, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import CreatorView from "../DialogComponents/creatorView";
import getActivitiesAll from "@/api/routes/Atividades/getActivitiesAllRoute";
import ParticipantView from "../DialogComponents/participantView";
import EditActivity from "../DialogComponents/editActivity";
import ConcludeActivity from "../DialogComponents/concludeActivity";

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
  address: string | { latitude: number; longitude: number };
  completedAt: string;
}

interface ExerciseCardProps {
  image: string;
  title: string;
  dateTime: string;
  participants: number;
  isPrivate: boolean;
  variant?: "default" | "small";
  onClick?: () => void;
  activity: Activity;
  userId: string | null;
}

function ExerciseCard({
  image,
  title,
  dateTime,
  participants,
  isPrivate,
  variant = "default",
  onClick,
  activity,
  userId,
}: ExerciseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConcludeModalOpen, setIsConcludeModalOpen] = useState(false); // Adicione este estado
  const [completeActivity, setCompleteActivity] = useState<Activity | null>(
    null
  );
  const [activityInitialState, setActivityInitialState] = useState({
    concluded: false,
  });

  // Function to format the date and time
  // It takes a dateTime string as input and returns a formatted string
  function formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Function to check if the activity is starting soon
  const isActivityStartingSoon = (scheduledDate: string): boolean => {
    const now = new Date();
    const activityDate = new Date(scheduledDate);
    const diffInMs = activityDate.getTime() - now.getTime();
    const diffInMinutes = diffInMs / 60000;
    return diffInMinutes <= 30 && diffInMinutes > 0;
  };

  // Function to check if the activity is in progress
  const isActivityInProgress = (scheduledDate: string): boolean => {
    const now = new Date();
    const activityDate = new Date(scheduledDate);
    return activityDate <= now;
  };

  const handleEdit = () => {
    setIsModalOpen(false);

    // Reset all modal states first
    const isInProgress = isActivityInProgress(activity.scheduledDate);
    // Verify if the activity is starting soon
    const isStartingSoon = isActivityStartingSoon(activity.scheduledDate);

    // If the activity is in progress or starting soon, open the conclude modal
    if (isInProgress || isStartingSoon) {
      setIsConcludeModalOpen(true); // Open the conclude modal
    } else {
      setIsEditModalOpen(true); // Open the edit modal
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (!activity) return;

    // Reset all modal states first
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsConcludeModalOpen(false);

    // Verify if the activity is already completed
    if (activity.completedAt) {
      setCompleteActivity(activity);
      setActivityInitialState({ concluded: true });
      setIsConcludeModalOpen(true);
      return;
    }

    // For not concluded activities - fetch the complete activity data
    getActivitiesAll({}).then((activities: Activity[]) => {
      const fullActivity = activities.find(
        (act: Activity) => act.id === activity.id
      );

      if (fullActivity) {
        setCompleteActivity(fullActivity);

        // Verify if the activity is already completed
        if (fullActivity.completedAt) {
          setActivityInitialState({ concluded: true });
          setIsConcludeModalOpen(true);
          return;
        }

        // Check if the user is the creator of the activity
        if (userId && activity.creatorId === userId) {
          // Check if the activity is starting soon or in progress
          if (
            isActivityStartingSoon(activity.scheduledDate) ||
            isActivityInProgress(activity.scheduledDate)
          ) {
            // Show the conclude modal
            setIsConcludeModalOpen(true);
          } else {
            // Show creator modal
            setIsModalOpen(true);
          }
        } else {
          // Show participant modal
          setIsModalOpen(true);
        }
      }
    });
  };

  const displayActivity = completeActivity || activity;

  return (
    <>
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        className={cn(
          "text-[12px] cursor-pointer",
          variant === "small"
            ? "flex items-center gap-4 max-w-full"
            : "flex flex-col max-w-[296px]"
        )}
      >
        <div
          className={cn(
            "relative mb-4 rounded-lg bg-[#FBBC05] flex-shrink-0",
            variant === "small" ? "w-[88px] h-[88px] mb-0" : "w-full h-40"
          )}
        >
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full rounded-lg"
          />

          {isPrivate && (
            <div
              className={cn(
                "bg-gradient-to-b from-primary-500 to-primary-600 flex items-center justify-center rounded-full absolute top-[6px] left-[6px]",
                variant === "small" ? "w-[22px] h-[22px]" : "w-[29px] h-[29px]"
              )}
            >
              <Lock
                width={variant === "small" ? 12 : 16}
                className="text-white"
              />
            </div>
          )}
        </div>

        <div className={variant === "small" ? "flex-1" : ""}>
          <span className="text-[16px] font-bold block truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-46 w-46">
            {title}
          </span>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="text-primary-600" width={16} />
              <span>
                {dateTime ? formatDateTime(dateTime) : "Data não disponível"}
              </span>
            </div>

            <span>|</span>

            <div className="flex items-center gap-1.5">
              <Users className="text-primary-600" width={16} />
              <span>{participants}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {userId && activity.creatorId === userId ? (
          <CreatorView activity={displayActivity} onEdit={handleEdit} />
        ) : (
          <ParticipantView activity={displayActivity} />
        )}
      </Dialog>

      {/* Dialog edit */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <EditActivity
          activity={displayActivity}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Dialog>

      {/* Dialog conclude */}
      <Dialog open={isConcludeModalOpen} onOpenChange={setIsConcludeModalOpen}>
        <ConcludeActivity
          activity={displayActivity}
          onEdit={() => {
            setIsConcludeModalOpen(false);
            setIsEditModalOpen(true);
          }}
          initialState={activityInitialState}
        />
      </Dialog>
    </>
  );
}

export default ExerciseCard;
