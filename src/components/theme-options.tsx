import type { Settings } from "@/App";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colorHarmonyList, colorStrengthList } from "@/lib/colors";
import { Button } from "./ui/button";
import { Palette } from "lucide-react";
type Props = {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onChangeFormat: (format: string) => void;
};

const ThemeOptions = ({ settings, onChange, onChangeFormat }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Palette />
          <span className="hidden sm:inline capitalize">
            {settings.harmony.replace("-", " ")} / {settings.strength}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[330px] overflow-auto max-h-[calc(100dvh-70px)]"
        align="end"
      >
        <h3 className="font-bold text-sm tracking-tight mb-2">CODE FORMAT</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {["hex", "rgb", "hsl"].map((code) => (
            <Button
              className="text-xs uppercase"
              variant={settings.code === code ? "default" : "secondary"}
              key={code}
              onClick={() => onChangeFormat(code)}
            >
              {code}
            </Button>
          ))}
        </div>

        <h3 className="font-bold text-sm tracking-tight mb-2">HARMONY</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {colorHarmonyList.map((harmony) => (
            <Button
              className="text-xs capitalize"
              variant={settings.harmony === harmony ? "default" : "secondary"}
              key={harmony}
              onClick={() => onChange({ ...settings, harmony })}
            >
              {harmony.replace("-", " ")}
            </Button>
          ))}
        </div>
        <h3 className="font-bold text-sm tracking-tight mb-2">STRENGTH</h3>
        <div className="grid grid-cols-2 gap-2">
          {colorStrengthList.map((strength) => (
            <Button
              className="text-xs capitalize"
              variant={settings.strength === strength ? "default" : "secondary"}
              key={strength}
              onClick={() => onChange({ ...settings, strength })}
            >
              {strength.replace("-", " ")}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeOptions;
