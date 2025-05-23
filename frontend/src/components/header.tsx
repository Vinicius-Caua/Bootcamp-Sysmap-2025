import Profile from "./profile";
import logoFeet from "../assets/complete-logo.svg";
import userLogo from "../assets/profile-photo.svg";
import { Button } from "./ui/button";
import { CirclePlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useUserData } from "@/contexts/userDataApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import NewActivityDialog from "./DialogComponents/createNewActivity";
import { useState } from "react";
import { toast } from "sonner";

function Header() {
  const navigate = useNavigate();
  const { userData, isLoading } = useUserData(); // Use the custom hook to fetch user data
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control modal visibility

  if (isLoading) {
    return <div>Carregando...</div>; // Exibe um estado de carregamento
  }
  const profileImage = userData?.avatar || userLogo; // Use the avatar from user data or a default image
  const level = userData?.level || 0; // Use the level from user data or 0 as fallback

  const handlerLogOut = () => {
    // Timeout to logOut
    const toastId = toast.loading("Encerrando sessão...");
    setTimeout(() => {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userData");
      navigate("/login");
      toast.dismiss(toastId);
    }, 3000);
  };

  return (
    <>
      <header className="flex w-full justify-between">
        {/* Button to go home */}
        <button
          onClick={() => navigate("/home")}
          className="p-0 border-none bg-transparent cursor-pointer"
        >
          <img src={logoFeet} alt="Logo Fit Meet" />
        </button>

        <div className="flex gap-5 items-center ">
          {/* LogOut button */}
          <div>
            <Button
              variant="danger"
              className="h-11 w-11"
              onClick={handlerLogOut}
            >
              <LogOut />
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" className="my-2">
                <CirclePlus width={20} />
                Criar atividade
              </Button>
            </DialogTrigger>

            <DialogContent className="lg:max-w-196 lg:max-h-192.5 max-w-90 max-h-150 flex flex-col overflow-y-scroll lg:overflow-y-hidden">
              <DialogHeader>
                <DialogTitle>
                  <span className="font-bebas leading-8 text-title text-[32px]">
                    Nova Atividade
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NewActivityDialog onClose={() => setIsDialogOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
          <button
            onClick={() => navigate("/profile")}
            className="cursor-pointer border-none bg-transparent"
          >
            <Profile image={profileImage} level={level} />
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
