import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Trash2, PlusSquare, LayoutGrid } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface TheaterLayoutEditorProps {
  value: (0 | 1)[][];
  onChange: (value: (0 | 1)[][]) => void;
}

export const TheaterLayoutEditor: React.FC<TheaterLayoutEditorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<(0 | 1)[][]>(value);
  const [rows, setRows] = useState(value?.length || 8);
  const [cols, setCols] = useState(value?.[0]?.length || 10);

  useEffect(() => {
    if (isOpen) {
      const initializedValue =
        !value || value.length === 0 ? Array(8).fill(Array(10).fill(1)) : value;

      setLocalValue(initializedValue);
      setRows(initializedValue.length);
      setCols(initializedValue[0]?.length || 0);
    }
  }, [isOpen, value]);

  const handleResize = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);

    const newLayout: (0 | 1)[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: (0 | 1)[] = [];
      for (let c = 0; c < newCols; c++) {
        if (localValue && r < localValue.length && c < localValue[r].length) {
          row.push(localValue[r][c]);
        } else {
          row.push(1);
        }
      }
      newLayout.push(row);
    }
    setLocalValue(newLayout);
  };

  const toggleSeat = (rIndex: number, cIndex: number) => {
    const newLayout = localValue.map((row, r) =>
      row.map((seat, c) => {
        if (r === rIndex && c === cIndex) {
          return seat === 1 ? 0 : 1;
        }
        return seat;
      }),
    );
    setLocalValue(newLayout);
  };

  const fillAll = () => {
    const newLayout = localValue.map((row) => row.map(() => 1 as const));
    setLocalValue(newLayout);
  };

  const clearAll = () => {
    const newLayout = localValue.map((row) => row.map(() => 0 as const));
    setLocalValue(newLayout);
  };

  const handleSave = () => {
    onChange(localValue);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between border rounded-md p-3 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Current Layout Size</p>
            <p className="text-muted-foreground">
              {value?.length || 0} rows × {value?.[0]?.length || 0} columns
            </p>
          </div>
        </div>
        <DialogTrigger asChild>
          <Button type="button" variant="secondary" size="sm">
            Edit Layout
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-[95vw] sm:max-w-[95vw] h-[95vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Theater Layout Editor</DialogTitle>
          <DialogDescription>
            Design the seating layout. + for seat, empty for corridor.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-between px-1">
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min={1}
                  max={30}
                  value={rows}
                  onChange={(e) =>
                    handleResize(Number(e.target.value) || 1, cols)
                  }
                  className="w-24"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cols">Columns</Label>
                <Input
                  id="cols"
                  type="number"
                  min={1}
                  max={40}
                  value={cols}
                  onChange={(e) =>
                    handleResize(rows, Number(e.target.value) || 1)
                  }
                  className="w-24"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillAll}
                className="flex items-center gap-1.5"
              >
                <PlusSquare className="w-4 h-4" />
                Fill All
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 border rounded-lg p-4 bg-background flex flex-col">
            <div className="text-center w-full py-2 mb-4 bg-muted text-muted-foreground text-sm font-semibold rounded shadow-inner uppercase tracking-widest border shrink-0">
              Screen
            </div>

            <ScrollArea className="flex-1 w-full rounded-md border">
              <div className="flex justify-center min-w-max p-4">
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {localValue?.map((row, rIndex) =>
                    row.map((seat, cIndex) => (
                      <button
                        key={`${rIndex}-${cIndex}`}
                        type="button"
                        onClick={() => toggleSeat(rIndex, cIndex)}
                        className={cn(
                          "w-8 h-8 rounded-t-lg rounded-b-sm border transition-all duration-200 flex items-center justify-center text-[10px]",
                          seat === 1
                            ? "bg-primary border-primary text-primary-foreground shadow-sm hover:opacity-80"
                            : "bg-muted border-dashed border-border hover:bg-muted/80 text-transparent hover:text-muted-foreground",
                        )}
                        title={`Row ${rIndex + 1}, Col ${cIndex + 1} (${seat === 1 ? "Seat" : "Corridor"})`}
                      >
                        {seat === 1 ? "S" : "+"}
                      </button>
                    )),
                  )}
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground justify-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <span>Seat (1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted border border-dashed rounded-sm"></div>
                <span>Corridor/Empty (0)</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
