import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActivitySectionListPage from "@/components/HomeComponents/activitySectionListPage";
import getActivitiesPaginated from "@/api/routes/Atividades/getActivitiesPaginatedRoute";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
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
  typeId: string;
  address: string;
  completedAt: string;
}

function ActivitiesBottonListPage() {
  const { typeId } = useParams<{ typeId: string }>(); // Get typeId from route params
  const [activities, setActivities] = useState<Activity[]>([]); // State to manage activities
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [page, setPage] = useState(1); // State to manage current page
  const [hasMore, setHasMore] = useState(true); // State to manage if there are more activities to load
  const pageSize = 16; // Number of activities per page

  function fetchActivities(currentPage: number) {
    setIsLoading(true);

    getActivitiesPaginated({
      typeId,
      orderBy: "createdAt",
      order: "desc",
      page: currentPage,
      pageSize,
    })
      .then((response) => {
        const mappedActivities = response.activities.map(
          (activity: {
            id: string;
            title: string;
            description: string;
            scheduledDate: string;
            participantCount: number;
            private: boolean;
            image: string;
            creator: { id: string; name: string };
            typeId: string;
            address: string;
            completedAt: string;
          }) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            dateTime: activity.scheduledDate,
            participants: activity.participantCount,
            isPrivate: activity.private,
            image: activity.image,
            creatorId: activity.creator?.id, 
            typeId: activity.creator,
            addrees: activity.address,
            completedAt: activity.completedAt,
          })
        );

        setActivities((prev) =>
          currentPage === 1 ? mappedActivities : [...prev, ...mappedActivities]
        );

        // Check if there are more activities to load
        if (response.activities.length < pageSize) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Effect to fetch activities when the component mounts or when typeId changes
  useEffect(() => {
    if (!typeId) return;

    // Reset states when typeId changes
    setActivities([]);
    setPage(1);
    setHasMore(true);

    fetchActivities(1); // Fetch the first page of activities
  }, [typeId]);

  // Function to handle loading more activities when the button is clicked
  const handleLoadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchActivities(nextPage);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      {isLoading && page === 1 ? (
        <p>Carregando atividades...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activities.map((activity) => (
            <ActivitySectionListPage
              key={activity.id} // Use activity ID as key
              exercises={[activity]} // Pass the activity as an array to the component
            />
          ))}
        </div>
      )}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleLoadMore}
            variant={"primary"}
            className="w-26 h-10"
          >
            Ver mais
            <ChevronDown size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}

export default ActivitiesBottonListPage;
