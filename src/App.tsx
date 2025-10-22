import { useEffect, useState } from "react";
import Toolbar from "./components/toolbar";
import { Button } from "./components/ui/button";
import { Lock, LockOpen, Pipette, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { cn, randomItem } from "./lib/utils";
import {
  colorHarmonyList,
  colorStr,
  colorStrengthList,
  getBestColor,
  getColorPalette,
  isDark,
  toHex,
  type ColorHarmony,
  type ColorStrength,
} from "./lib/colors";
import ColorAction from "./components/color-action";

type ColorItem = {
  hex: string;
  locked: boolean;
};

export type Settings = {
  harmony: ColorHarmony;
  strength: ColorStrength;
  code: "hex" | "rgb" | "hsl";
};

const MIN_COLORS_COUNT = 2;
const MAX_COLORS_COUNT = 6;
const DEFAULT_COLORS_COUNT = 4;

const colorItem = (hex = "#CCCCCC", locked = false) => ({
  hex: toHex(hex),
  locked,
});

function App() {
  const [colors, setColors] = useState<ColorItem[]>([]);

  const lockedColors = colors.filter((c) => c.locked).map((c) => c.hex);

  const [settings, setSettings] = useState<Settings>({
    harmony: randomItem(colorHarmonyList),
    strength: randomItem(colorStrengthList),
    code: "hex",
  });

  useEffect(() => {
    generateColors({ length: DEFAULT_COLORS_COUNT });
  }, []);

  const generateColors = (arg: { settings?: Settings; length?: number }) => {
    const newLength = arg.length || colors.length;
    const preferredSettings = arg.settings || settings;

    if (arg.settings) {
      setSettings(arg.settings);
    }

    if (
      colors.length &&
      lockedColors.length === colors.length &&
      newLength === colors.length
    ) {
      toast("All colors are locked", { position: "top-center" });
      return;
    }

    const generatedColors = getColorPalette(
      preferredSettings.harmony,
      preferredSettings.strength,
      newLength,
      lockedColors
    );

    //Colors beside locked colors
    const newColors = generatedColors.filter((c) => !lockedColors.includes(c));

    const newColorsState = colors.length
      ? colors.map((c) => (c.locked ? c : colorItem(newColors.pop())))
      : generatedColors.map((c, index) => colorItem(c, !index));

    if (colors.length && newLength > colors.length) {
      newColorsState.push(colorItem(newColors.pop()));
    }

    setColors(newColorsState);
  };

  const addItem = () => {
    const newLength = colors.length + 1;
    const newColor = getBestColor(
      settings.harmony,
      settings.strength,
      newLength,
      colors.map((c) => c.hex)
    );
    setColors([...colors, colorItem(newColor)]);
    if (newLength >= MAX_COLORS_COUNT) {
      toast(`Has reached the maximum of ${MAX_COLORS_COUNT} colors allowed`);
    }
  };

  const removeItem = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    if (newColors.length <= MIN_COLORS_COUNT) {
      toast(`Has reached the minimum of ${MIN_COLORS_COUNT} colors allowed`);
    }
    setColors(newColors);
  };

  const toggleLock = (index: number, lock: boolean) => {
    const copy = [...colors];
    copy[index].locked = lock;
    setColors(copy);
  };

  const updateItemColor = (index: number, value: string) => {
    const copy = [...colors];
    copy[index] = colorItem(value, true);
    setColors(copy);
  };

  return (
    <div className="flex flex-col h-dvh w-full">
      <header className="h-16 border-b px-4 flex justify-between items-center">
        <h1 className="font-black text-2xl tracking-tighter">ColGen</h1>
        <Toolbar
          colors={colors.map((c) => c.hex)}
          settings={settings}
          onGenerate={(newSettings) =>
            generateColors({ settings: newSettings })
          }
          onChangeFormat={(format) =>
            setSettings({ ...settings, code: format as any })
          }
        />
      </header>
      <main className="flex-1 flex flex-col landscape:flex-row">
        <div className="flex-1 flex flex-col landscape:flex-row">
          {colors.map(({ hex, locked }, index) => {
            const isDarkColor = isDark(hex);
            return (
              <div
                key={"color" + index}
                style={{ backgroundColor: hex }}
                className={cn(
                  "flex-1 flex items-center portrait:justify-between p-4 relative landscape:flex-col landscape:justify-end",
                  isDarkColor ? "text-white" : "text-black"
                )}
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold uppercase">
                  {colorStr(hex, settings.code)}
                </h4>
                <div className="flex gap-2 landscape:flex-col landscape:my-4">
                  <ColorAction tooltip="Input Color">
                    <label htmlFor={`input-${index}`}>
                      <Pipette className="pointer-events-none min-h-5 min-w-5" />
                      <input
                        type="color"
                        id={`input-${index}`}
                        value={hex}
                        onChange={(e) => updateItemColor(index, e.target.value)}
                        className="absolute opacity-0 "
                      />
                    </label>
                  </ColorAction>

                  <ColorAction
                    tooltip={locked ? "Locked" : "Lock Color"}
                    className={cn(
                      locked && "opacity-100",
                      locked && isDarkColor && "bg-white/20",
                      locked && !isDarkColor && "bg-black/10"
                    )}
                    onClick={() => toggleLock(index, !locked)}
                    Icon={locked ? Lock : LockOpen}
                  />
                  {colors.length > MIN_COLORS_COUNT && (
                    <ColorAction
                      tooltip="Remove Color"
                      disabled={locked}
                      onClick={() => removeItem(index)}
                      Icon={X}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {colors.length < MAX_COLORS_COUNT && (
          <Button
            className="portrait:w-full landscape:h-full rounded-none bg-gray-200 text-black hover:text-white"
            onClick={addItem}
          >
            <Plus className="min-w-6 min-h-6" />
          </Button>
        )}
      </main>
      <Toaster
        toastOptions={{
          className: "text-sm text-center",
          duration: 1500,
          position: "bottom-center",
        }}
      />
    </div>
  );
}

export default App;
