import { Wand } from "lucide-react";
import { Button } from "./ui/button";

import type { Settings } from "@/App";
import ThemeOptions from "./theme-options";
import ColorDownload from "./color-download";
import { useEffect, useRef } from "react";

type Props = {
  settings: Settings;
  colors: string[];
  onGenerate: (settings: Settings) => void;
  onChangeFormat: (format: string) => void;
};

const Toolbar = ({ settings, colors, onGenerate, onChangeFormat }: Props) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    //Use Space keyboard as an alternative to generate colors
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        btnRef.current?.click();
        e.preventDefault;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <ColorDownload colors={colors} />
      <ThemeOptions
        settings={settings}
        onChange={onGenerate}
        onChangeFormat={onChangeFormat}
      />

      <Button
        size={"lg"}
        className="w-[150px] font-bold"
        ref={btnRef}
        onClick={() => onGenerate(settings)}
      >
        <Wand /> Generate
      </Button>
    </div>
  );
};

export default Toolbar;
