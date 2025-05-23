import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ActivityTypeCard from "../ActivitiesComponents/activityTypeCard";
import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import { Button } from "../ui/button";
import setUserPreference from "@/api/routes/User/postUserPreferenceDefineRoute";
import { toast } from "sonner";

function SetPreferencesDialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg",
          "w-[528px] max-h-[90vh] overflow-y-auto p-12",
          className
        )}
        {...props}
      >
        <DialogPrimitive.Title className="font-bebas text-title text-center text-3xl mb-12">
          Selecione as suas atividades preferidas
        </DialogPrimitive.Title>
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"></DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SetPreferencesDialogContent({ onClose }: { onClose: () => void }) {
  const [activities, setActivities] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]); // State to manage selected activity types
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getActivitiesTypes()
      .then((data: { id: string; name: string; image: string }[]) => {
        setActivities(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSelect = (typeId: string) => {
    setSelectedTypeIds(
      (prev) =>
        prev.includes(typeId)
          ? prev.filter((id) => id !== typeId) // Remove if already selected
          : [...prev, typeId] // Add if not selected
    );
  };

  const handleConfirm = () => {
    if (selectedTypeIds.length === 0) {
      toast.warning("Selecione pelo menos uma atividade.");
      return;
    }

    setUserPreference(selectedTypeIds)
      .then(() => {
        toast.success("Preferências salvas com sucesso!");
        setTimeout(() => {
          onClose(); // Close the dialog after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <DialogContent>
      <div>
        <div className="grid grid-cols-4 gap-6 mb-6">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleSelect(activity.id)} // Handle selection
                className="cursor-pointer"
              >
                <ActivityTypeCard
                  title={activity.name}
                  image={activity.image}
                  selected={selectedTypeIds.includes(activity.id)} // Check if selected
                />
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center gap-4 mt-12">
          <Button className="w-1/2" onClick={handleConfirm}>
            Confirmar
          </Button>
          <Button variant="secondary" className="w-1/2" onClick={onClose}>
            Pular
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export { SetPreferencesDialog, SetPreferencesDialogContent };
