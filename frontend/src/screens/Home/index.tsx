import { useEffect, useState } from "react";
import ActivitiesBottonHome from "@/components/HomeComponents/activitiesBottonHome";
import ActivitiesGrid from "@/components/ActivitiesComponents/activitiesGrid";
import ActivitiesTypes from "@/components/ActivitiesComponents/activitiesTypes";
import getUserPreferences from "@/api/routes/User/getUserPreferencesRoute";
import {
  SetPreferencesDialog,
  SetPreferencesDialogContent,
} from "@/components/DialogComponents/setPreferencesDialog";
import { toast } from "sonner";

function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    const hasDialogBeenShown = sessionStorage.getItem("dialogShown");
    getUserPreferences()
      .then((data) => {
        // If the user has preferences, set hasPreferences to true and close the dialog
        if (data.length > 0) {
          setHasPreferences(true);
          setIsDialogOpen(false);
        } else if (!hasDialogBeenShown) {
          // If the user doesn't have preferences, check if the dialog has already been shown
          setIsDialogOpen(true);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    if (!hasPreferences) {
      // If the user doesn't have preferences, set a flag in sessionStorage
      sessionStorage.setItem("dialogShown", "true");
    }
  };
  return (
    <>
      <SetPreferencesDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SetPreferencesDialogContent onClose={handleCloseDialog} />
      </SetPreferencesDialog>

      <ActivitiesGrid title={"Recomendado para você"} />
      <ActivitiesTypes title={"Tipos de atividade"} />
      <ActivitiesBottonHome />
    </>
  );
}

export default Home;
