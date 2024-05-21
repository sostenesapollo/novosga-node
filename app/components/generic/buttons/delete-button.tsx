import { Icons } from "@/components/icons/icons";

export const DeleteButton = ({
  onClick,
  type = "button",
  className = "",
  sizeButton = 6,
  sizeIcon = 6,
}: any) => (
  <button
    onClick={onClick}
    className={`w-${sizeButton} h-${sizeButton} rounded-full bg-red-600 hover:bg-red-800 text-white ${className}`}
  >
    <Icons.TimesIconO
      className={`text-white-400 w-${sizeIcon} h-${sizeIcon}`}
    />
  </button>
);
