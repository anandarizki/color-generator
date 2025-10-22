import type { LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  onClick?: () => void;
  Icon?: LucideIcon;
  tooltip: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
};

const ColorAction = ({
  onClick,
  Icon,
  tooltip,
  className = "",
  children,
  disabled,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          asChild={!!children}
          className={cn(
            "opacity-70 hover:opacity-100 disabled:invisible",
            className
          )}
          variant="ghost"
          size="icon-lg"
          disabled={disabled}
        >
          {children || (Icon && <Icon className="min-h-5 min-w-5" />)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ColorAction;
