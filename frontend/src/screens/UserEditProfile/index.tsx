import putUserInformations from "@/api/routes/User/putUserUpdateRoute";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfilePhoto from "@/components/UserProfileComponents/profilePhoto";
import { ChevronLeft, Eye, EyeOff, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import deleteUserDeactivate from "@/api/routes/User/deleteUserDeactivateRoute";
import putUserAvatar from "@/api/routes/User/putUserAvatarRoute";
import setUserPreference from "@/api/routes/User/postUserPreferenceDefineRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import updateUserInformation, {
  UpdatedSchema,
} from "@/zodSchemas/updateInformationsSchema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import getActivitiesTypes from "@/api/routes/Atividades/getActivitiesTypesRoute";
import ActivityTypeCard from "@/components/ActivitiesComponents/activityTypeCard";
import getUserPreferences from "@/api/routes/User/getUserPreferencesRoute";
import { toast } from "sonner";

interface Preference {
  typeId: string;
}
interface Activity {
  id: string;
  name: string;
  image: string;
}

function UserEditProfile() {
  const navigate = useNavigate();
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]); // State to manage selected activity types
  const [activities, setActivities] = useState<Activity[]>([]); // State to manage activities
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the selected file
  const [preview, setPreview] = useState<string | null>(null); // State to manage the image preview

  // Get user data from localStorage
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData") as string)
    : null;

  // Effect to get user preferences from the backend
  useEffect(() => {
    getUserPreferences()
      .then((preferences) => {
        const preferenceIds = preferences.map(
          (pref: Preference) => pref.typeId
        );
        setSelectedTypeIds(preferenceIds); // Define as preferências no estado
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  // Effect to select the activity types based on user preferences setted
  useEffect(() => {
    if (userData?.preferences) {
      setSelectedTypeIds(userData.preferences);
    }
  }, [userData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatedSchema>({
    resolver: zodResolver(updateUserInformation),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
    },
  });

  const onSubmit = (updatedInformations: UpdatedSchema) => {
    const dataToSend = { ...updatedInformations };

    // Remove password from dataToSend if it's empty or undefined
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    // Update user information
    putUserInformations(dataToSend)
      .then(() => {
        toast.success("Informações atualizadas com sucesso!");
        // Merge the updated data with existing data in localStorage
        const updatedUserData = {
          ...userData, // User data from localStorage
          ...dataToSend, // Updated data from the form
        };

        // Update localStorage with the new user data
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      })
      .catch((error) => {
        // Handle backend error for user information update
        toast.error(error.message);
      });

    // If a file is selected, update the avatar
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      putUserAvatar(formData)
        .then((response) => {
          // Assume the backend returns the new avatar URL in the response
          const newAvatarUrl = response?.data?.avatarUrl;

          // Update the userData in localStorage with the new avatar URL
          const updatedUserData = {
            ...userData,
            avatar: newAvatarUrl,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        })
        .catch((error) => {
          // Handle backend error
          toast.error(error.message);
        });
    }
    setUserPreference(selectedTypeIds)
      .then(() => {
        toast.success("Preferências salvas com sucesso!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCancel = () => {
    // Reset form values to the original user data
    reset({
      name: userData?.name || "",
      email: userData?.email || "",
      password: "",
    });

    // Clear the selected file and preview
    setSelectedFile(null);
    setPreview(null);

    // Set a temporary message
    toast.info("Alterações descartadas");
  };

  const handleDeactivateAccount = () => {
    deleteUserDeactivate()
      .then((response) => {
        toast.success(response.message);
        localStorage.removeItem("userData"); // Remove user data from localStorage
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSelect = (typeId: string) => {
    setSelectedTypeIds((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // Effect to fetch activities types
  useEffect(() => {
    getActivitiesTypes()
      .then((data) => {
        setActivities(data); // Set the activities data
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false after fetching data
      });
  }, []);

  return (
    <section className="flex h-full justify-center p-14">
      <div className="flex flex-col w-80 h-202 justify-start gap-10 pb-6">
        <button
          className="flex gap-2 cursor-pointer text-4 font-bold"
          onClick={() => navigate("/profile")}
        >
          <ChevronLeft />
          Voltar para o perfil
        </button>

        {/* Profile Photo */}
        <ProfilePhoto
          isUpdateUser={true}
          onFileSelect={(file) => setSelectedFile(file)}
          preview={preview || ""}
          setPreview={setPreview}
          avatarUrl={userData.avatar} // Pass avatarUrl from userData
        />

        {/* Form */}
        <form className="space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="text" className="font-sans">
                Nome completo
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Ex.: João Silva"
                {...register("name")}
              />
              {/* Show zod error */}
              {errors.name && (
                <p className="text-danger text-sm">{errors.name?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cpf" className="font-sans">
                CPF
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="123.456.789-01"
                value={userData?.cpf}
                className="bg-gray-100 pointer-events-none"
                disabled
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans">
                E-mail
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Ex.: joao@email.com"
                {...register("email")}
              />
              {/* Show zod error */}
              {errors.email && (
                <p className="text-danger text-sm">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-sans">
                Senha
                <span className="text-danger font-bold">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // shows the password if showPassword state is true
                  placeholder="Ex.: joao123"
                  {...register("password")}
                />
                {/* Show zod error */}
                {errors.password && (
                  <p className="text-danger text-sm">
                    {errors.password?.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // switches the state
                  className="absolute top-4 right-5 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="font-sans">
                Preferências
                <span className="text-danger font-bold">*</span>
              </Label>
              <Carousel className="overflow-hidden">
                <CarouselContent className="flex -ml-0">
                  {isLoading ? (
                    <p>Carregando...</p>
                  ) : (
                    activities.map((activity) => (
                      <CarouselItem
                        key={activity.id}
                        className="md:basis-1/2 lg:basis-1/3 "
                      >
                        <ActivityTypeCard
                          title={activity.name}
                          image={activity.image}
                          selected={selectedTypeIds.includes(activity.id)}
                          onClick={() => handleSelect(activity.id)} // Handle selection
                        />
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          <div className="flex w-80 gap-1.5">
            <Button type="submit" className="w-[157px] h-12 py-3">
              Editar
            </Button>

            <Button
              type="button"
              variant="light"
              className="w-[157px] h-12 py-3"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
          <div className="flex justify-center items-center gap-2 ">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"onlyText"}
                  className="text-center font-bold text-[#E7000B] text-[16px]"
                >
                  <Trash2 size={24} className="text-danger" />
                  Desativar minha conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja desativar sua conta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ao desativar sua conta, todos os seus dados e histórico de
                    atividades serão permanentemente removidos. <span className="font-bold">
                      Esta ação é irreversível e não poderá ser desfeita.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateAccount}>
                    Desativar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UserEditProfile;
