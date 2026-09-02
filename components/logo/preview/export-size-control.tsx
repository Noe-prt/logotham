import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExportSizeControlProps = {
  value: number;
  onValueChange: (next: number) => void;
  maxSize?: number | null;
};

export function ExportSizeControl({
  value,
  onValueChange,
  maxSize,
}: ExportSizeControlProps) {
  const handleSelectChange = (next: string | null) => {
    if (!next) return;
    const parsed = parseInt(next, 10);
    if (!Number.isNaN(parsed)) {
      onValueChange(parsed);
    }
  };

  const sizeOptions = [256, 512, 1024, 2048];

  return (
    <div className="w-full flex flex-col items-end gap-1 relative">
      <Select value={value.toString()} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur-sm h-8 text-xs">
          <SelectValue />
        </SelectTrigger>

        <SelectContent disablePortal>
          {sizeOptions.map((size) => (
            <SelectItem
              key={size}
              value={size.toString()}
              disabled={maxSize != null && size > maxSize}
            >
              {size} x {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-[10px] text-muted-foreground">
        Export size: {value}px
      </span>
      {maxSize != null ? (
        <span className="text-[10px] text-muted-foreground">
          Plan cap: {maxSize}px
        </span>
      ) : null}
    </div>
  );
}
