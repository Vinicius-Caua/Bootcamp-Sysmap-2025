import getUserData from "@/api/routes/User/getUserRoute";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  avatar: string;
  level: number;
  xp: number;
  achievements: { id: string; name: string; criterion: string }[];
}

export function useUserData() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = () => {
    setIsLoading(true);
    getUserData()
      .then((data) => {
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data)); // Atualiza o localStorage
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData(); // Busca os dados do usuário ao montar o componente
  }, []);

  

  return { userData, isLoading, fetchUserData };
}