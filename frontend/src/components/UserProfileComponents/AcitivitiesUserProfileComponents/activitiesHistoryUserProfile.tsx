import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import ActivitiesUserProfileLayout from "./activitiesUserProfileLayout";
import getActivitiesUserParticipantPaginated from "@/api/routes/Atividades/getActivitiesUserParticipantRoute";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  participants: number;
  isPrivate: boolean;
  image: string;
  creatorId: string;
  address: string;
  completedAt: string;
  typeId: string;
}

function ActivitiesHistoryUserProfile() {
  const [activities, setActivities] = useState<Activity[]>([]); // State to manage activities
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [page, setPage] = useState(1); // State to manage current page
  const [hasMore, setHasMore] = useState(true); // State to manage if there are more activities to load
  const pageSize = 8; // Number of activities per page

  function fetchActivities(currentPage: number) {
    setIsLoading(true);

    getActivitiesUserParticipantPaginated({
      page: currentPage,
      pageSize,
    })
      .then((response) => {
        const mappedActivities = response.activities.map(
          (activity: {
            completedAt: string;
            id: string;
            title: string;
            description: string;
            scheduledDate: string;
            participantCount: number;
            private: boolean;
            image: string;
            creator: { id: string; name: string };
            address: string;
          }) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            dateTime: activity.scheduledDate,
            participants: activity.participantCount,
            isPrivate: activity.private,
            image: activity.image,
            creatorId: activity.creator?.id, 
            address: activity.address,
            completedAt: activity.completedAt,
          })
        );

        // Update the activities state
        setActivities((prev) =>
          currentPage === 1 ? mappedActivities : [...prev, ...mappedActivities]
        );

        // Fetch more activities if available
        setHasMore(response.activities.length === pageSize);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Effect to fetch activities when the component mounts
  useEffect(() => {
    fetchActivities(1); // Fetch the first page of activities
  }, []);

  // Function to handle loading more activities when the button is clicked
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl">Histórico de atividades</h1>
      {isLoading && page === 1 ? (
        <p>Carregando atividades...</p>
      ) : activities.length === 0 ? (
        <p className="text-center text-gray-500">
          Você ainda não participou de nenhuma atividade.
        </p>
      ) : (
        <>
          <ActivitiesUserProfileLayout exercises={activities} />
          {hasMore && activities.length >= pageSize && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLoadMore}
                variant={"primary"}
                className="w-26 h-10"
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Ver mais"}
                {!isLoading && <ChevronDown size={16} />}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ActivitiesHistoryUserProfile;
