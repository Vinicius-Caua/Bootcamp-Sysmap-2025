import { Camera } from "lucide-react";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { useUserData } from "@/contexts/userDataApi";

interface UserInformations {
  name?: string;
  isUpdateUser?: boolean; // Define if the user is updating their profile
  onFileSelect?: (file: File | null) => void; // Callback to pass the selected file to the parent component
}

function ProfilePhoto({
  name,
  isUpdateUser = false,
  onFileSelect,
  preview,
  setPreview,
}: UserInformations & {
  preview: string;
  setPreview: (value: string) => void;
  avatarUrl: string | null;
}) {

  useUserData();
  // Get user data from localStorage
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData") as string)
    : null;

  // Get avatar URL from localStorage
  const avatarImage = userData.avatar;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click(); // Programmatically click the file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert the file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Update the preview with Base64
        onFileSelect?.(file); // Pass the selected file to the parent component if it exists
      };
      reader.readAsDataURL(file); // Read the file as a data URL (Base64)
    }

    // Clear the input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center relative gap-4">
      {/* Foto do usuário */}
      <div className="relative">
        <img
          src={preview || avatarImage}
          alt="Foto do usuário"
          className="w-48 h-48 rounded-full object-cover"
        />
        {isUpdateUser && (
          <Button
            type="button"
            className="absolute left-34 top-34 bottom-140 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-300"
            onClick={handleFileClick}
          >
            <Camera
              style={{ width: "19.5px", height: "17.25px" }}
              className="text-black"
            />
          </Button>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Nome do usuário */}
      <h1 className="text-4xl">{name}</h1>
    </div>
  );
}

export default ProfilePhoto;
