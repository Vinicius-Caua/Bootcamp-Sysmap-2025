import { cn } from "@/lib/utils";

interface activityTypeCardProps {
  image: string;
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const activityTypeCard = ({
  image,
  title,
  selected,
  onClick,
}: activityTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 cursor-pointer"
      )}
    >
      <div
        className={cn(
          "rounded-full",
          selected
            ? "bg-gradient-to-b from-primary-500 to-primary-600 p-[2px] w-[90px] h-[90px]"
            : "w-20 h-20 m-[5px]"
        )}
      >
        <div
          className={cn(
            "bg-white rounded-full w-full h-full",
            selected && "p-[3px]"
          )}
        >
          <img
            src={image}
            alt={title}
            className="object-cover rounded-full w-full h-full"
            width={80}
          />
        </div>
      </div>
      <span className="font-semibold leading-5">{title}</span>
    </div>
  );
};
export default activityTypeCard;
