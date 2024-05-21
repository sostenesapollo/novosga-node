import { Icons } from "@/components/icons/icons";

export const EditButton = ({
  onClick,
  type = "button",
  className = "",
  sizeButton = 6,
  sizeIcon = 5,
}: any) => (
  <button
    onClick={onClick}
    className={`w-${sizeButton} h-${sizeButton} rounded-full bg-blue-500 hover:bg-blue-800 text-white ${className}`}
  >
    {/* <Icons.TimesIconO className={`text-white-400 pl-1 pt-1 w-${sizeIcon} h-${sizeIcon}`}/> */}
    <Icons.EditIcon
      className={`text-white-400 pl-1 w-${sizeIcon} h-${sizeIcon}`}
    />
  </button>
);
