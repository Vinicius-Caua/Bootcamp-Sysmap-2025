import React, { useRef, useState } from "react";

interface FileUploadButtonProps {
  onFileChange?: (file: File | null) => void; // Callback to handle file change
  previewClassName?: string; // Class name for the preview image
  buttonText?: string; // Text to display on the button
  accept?: string; // Accepted file types
  className?: string; // Class name for the button
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileChange,
  previewClassName = "h-full w-full object-cover rounded-lg",
  buttonText = "Clique Aqui",
  accept = "image/*",
  className = "", // Default to an empty string
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // State to hold the preview URL

  const handleFileClick = () => {
    fileInputRef.current?.click(); // Programmatically click the file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected file
      setPreview(URL.createObjectURL(file));
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Button to send file */}
      <button
        className={`hover:bg-gray-300 border-2 border-dotted cursor-pointer transition-colors duration-200 ${className}`}
        onClick={handleFileClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview do arquivo"
            className={previewClassName}
          />
        ) : (
          buttonText
        )}
      </button>

      {/* Input hidden file */}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploadButton;
