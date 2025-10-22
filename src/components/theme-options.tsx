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
};

const ThemeOptions = ({ settings, onChange }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"lg"} variant="secondary">
          <Palette />{" "}
          <span className="hidden sm:inline capitalize">
            {settings.harmony.replace("-", " ")} / {settings.strength}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[330px]" align="end">
        <h3 className="font-bold mb-2">Color Harmony</h3>
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
        <h3 className="font-bold mb-2">Color Strength</h3>
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
