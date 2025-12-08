import { useEffect, useState } from "react";
import { Input } from "@components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover.tsx";
import { Button } from "@components/ui/button.tsx";
import { Calendar } from "@components/ui/calendar.tsx";
import { CalendarIcon } from "lucide-react"

type DateInputProps = {
  value: Date;
  onChange: (date: Date | undefined) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>;

export function DateInput({ value, onChange, ...props } : DateInputProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [month, setMonth] = useState<Date | undefined>(value ?? new Date());

  useEffect(() => {
    setDate(value);
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const formatDate = (date?: Date): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (value: string): Date | undefined => {
    if (!value) return undefined;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return undefined;

    const [, y, m, d] = match;
    const year = Number(y);
    const monthIndex = Number(m) - 1;
    const day = Number(d);

    return new Date(year, monthIndex, day);
  };

  return (
    <div className="relative w-full">
      <Input
        type="date"
        value={formatDate(value)}
        onChange={(e) => {
          const newDate = parseDate(e.target.value);
          onChange(newDate);
        }}
        {...props}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5 invisible" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            startMonth={new Date(1980, 0)}
            endMonth={new Date(2100, 11)}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              if (selectedDate) {
                setMonth(selectedDate);
              }
              onChange(selectedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
