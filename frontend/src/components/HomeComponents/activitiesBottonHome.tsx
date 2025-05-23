import { JSX, useEffect, useState } from "react";
import ActivitySectionHome from "@/components/HomeComponents/activitySectionHome";
import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import getActivitiesAll from "@/api/routes/Atividades/getActivitiesAllRoute";
import { useUserData } from "@/contexts/userDataApi";
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
}

interface ActivitySectionDataHome {
  title: string;
  typeId: string; // Added typeId property
  exercises: Activity[];
}

function ActivitiesBottonHome() {
  const [activitySections, setActivitySections] = useState<
    ActivitySectionDataHome[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useUserData();
  const userId = userData?.id || null;

  useEffect(() => {
    setIsLoading(true);

    getActivitiesTypes()
      .then((types) => {
        const sectionsPromises = types.map(
          (type: { id: string; name: string }) =>
            getActivitiesAll({
              typeId: type.id,
              orderBy: "createdAt",
              order: "desc",
              page: 1,
              pageSize: 6,
            }).then((activities) => ({
              title: type.name,
              typeId: type.id,
              exercises: activities.map(
                (activity: {
                  id: string;
                  title: string;
                  description: string;
                  scheduledDate: string;
                  participantCount: number;
                  private: boolean;
                  image: string;
                  address: string;
                  creator: { id: string; name: string };
                }) => ({
                  id: activity.id,
                  title: activity.title,
                  description: activity.description,
                  dateTime: activity.scheduledDate,
                  participants: activity.participantCount,
                  isPrivate: activity.private,
                  image: activity.image,
                  creatorId: activity.creator?.id,
                  address: activity.address
                })
              ),
            }))
        );

        Promise.all(sectionsPromises).then((sections) => {
          setActivitySections(
            sections.filter((section) => section.exercises.length > 0)
          ); // Filter out empty sections
          setIsLoading(false);
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  }, []);

  const filteredSections = activitySections.filter(
    (section) => section.exercises.length > 0
  );
  const isEven = filteredSections.length % 2 === 0;

  const groupedSections = filteredSections.reduce<JSX.Element[][]>(
    (acc, section, index) => {
      const rowIndex = Math.floor(index / 2);
      if (!acc[rowIndex]) acc[rowIndex] = [];

      const isLast = index === filteredSections.length - 1;
      const isLastAndOdd = !isEven && isLast;

      const sectionComponent = (
        <ActivitySectionHome
          key={section.title}
          title={section.title}
          exercises={section.exercises}
          typeId={section.typeId}
          isLastAndOdd={isLastAndOdd}
          userId={userId || ""} 
        />
      );

      acc[rowIndex].push(sectionComponent);
      return acc;
    },
    []
  );

  return (
    <section className="flex flex-col gap-10">
      {isLoading ? (
        <p>Carregando atividades...</p>
      ) : (
        groupedSections.map((row, idx) => {
          const columns =
            row.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2";

          return (
            <div key={idx} className={`grid ${columns} gap-7`}>
              {row}
            </div>
          );
        })
      )}
    </section>
  );
}

export default ActivitiesBottonHome;
