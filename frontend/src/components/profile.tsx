interface ProfileProps {
  image: string;
  level?: number;
}

const Profile = ({ image, level }: ProfileProps) => {
  return (
    <div className="relative max-w-[52px]">
      <div className="w-[52px] h-[52px] p-[2px] rounded-full bg-gradient-to-b from-primary-500 to-primary-600">
        <div className="w-full h-full bg-white rounded-full p-[2px]">
          <img
            src={image}
            alt="Logo"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
      </div>

      {level && (
        <div className="bg-gradient-to-b from-primary-500 to-primary-600 inline-flex items-center justify-center px-2.5 py-1 rounded-sm absolute -bottom-4 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-[12px] font-bold text-white leading-none">
            {level}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
