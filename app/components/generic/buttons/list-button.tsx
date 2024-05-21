import { Icons } from "@/components/icons/icons";

export const ListButton = ({ onClick, className = "" }: any) => (
  <div
    onClick={onClick}
    className={`cursor-pointer w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-800 text-black ${className}`}
  >
    <Icons.ListIcon className="w-5 h-5 pl-1 text-white-400" />
  </div>
);
