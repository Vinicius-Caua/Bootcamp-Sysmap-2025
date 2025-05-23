import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import Achievements from "./achievements";
import ProfilePhoto from "./profilePhoto";
import { useNavigate } from "react-router";

function HeroSection() {
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData") as string)
    : null;

  // Check if userData is null or undefined
  const userName = userData?.name || "Usuário";
  return (
    <section className="p-10 gap-4 bg-[#FAFAFA]">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate("/profile/edit")}
          variant="light"
          className="text-placeholder border-placeholder font-normal"
        >
          <Pencil width={16} />
          Editar perfil
        </Button>
      </div>

      <div className="flex flex-col gap-10 items-center">
        <ProfilePhoto name={userName} />
        <Achievements />
      </div>
    </section>
  );
}

export default HeroSection;
