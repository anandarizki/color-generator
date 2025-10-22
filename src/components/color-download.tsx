import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hexToHsl, hexToRgb, isDark } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Code, Download } from "lucide-react";

type Props = {
  colors: string[];
};

const rgbStr = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return `${r},${g},${b}`;
};

const hslStr = (hex: string) => {
  const [h, s, l] = hexToHsl(hex);
  return `${h},${s},${l}`;
};

const generateOutputText = (colors: string[]): string => {
  return `
ColGen - A Simple Color Palette Generator \n
Generated at ${new Date().toLocaleString()}\n\n
${colors
  .map(
    (c, index) => `
--- COLOR ${index + 1} ---
HEX : ${c}
RGB : ${rgbStr(c)}
HSL: ${hslStr(c)}
`
  )
  .join("\n")}
    `;
};

const ColorDownload = ({ colors }: Props) => {
  const handleDownload = () => {
    const content = generateOutputText(colors);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="secondary">
          <Code />
          <span className="hidden sm:inline">Color Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-dvh overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Current Palette</DialogTitle>
          <DialogDescription className="grid rounded grid-cols-3 text-center font-bold text-sm bg-gray-200 py-2">
            <span>HEX</span>
            <span>RGB</span>
            <span>HSL</span>
          </DialogDescription>
          <div className="rounded overflow-hidden">
            {colors.map((c) => (
              <div
                key={c}
                className={cn(
                  "grid grid-cols-3 uppercase text-center py-4 font-medium font-mono text-xs",
                  isDark(c) ? "text-white" : "text-black"
                )}
                style={{ backgroundColor: c }}
              >
                <div>{c}</div>
                <div>{rgbStr(c)}</div>
                <div>{hslStr(c)}</div>
              </div>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleDownload}>
            <Download /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDownload;
