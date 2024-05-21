import {
  Tooltip as _Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode, forwardRef } from "react";

const Tooltip = forwardRef(function Tooltip(
    {
      children,
      content = "",
      side = "right",
    }: {
      children: ReactNode;
      content: ReactNode;
      side?: "left" | "right" | "bottom" | "top";
    },
    ref
) {
  return (
      <TooltipProvider>
        <_Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side={side}>{content}</TooltipContent>
        </_Tooltip>
      </TooltipProvider>
  );
});

export default Tooltip;
