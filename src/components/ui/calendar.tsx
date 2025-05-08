import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "./utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-lg bg-white/90 dark:bg-card/90 backdrop-blur-md border border-border shadow-lg",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-base font-semibold text-foreground",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white/80 dark:bg-card/80 backdrop-blur-sm p-0 rounded-md border border-border hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary transition-all duration-200",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex w-full justify-between gap-1",
        head_cell: "text-muted-foreground rounded-md w-10 h-10 flex items-center justify-center font-medium text-sm",
        row: "flex w-full justify-between gap-1 mt-1",
        cell: `
          h-10 w-10 text-center text-sm p-0 relative 
          [&:has([aria-selected].day-range-end)]:rounded-r-md 
          [&:has([aria-selected].day-outside)]:bg-primary/10 dark:[&:has([aria-selected].day-outside)]:bg-primary/20 
          [&:has([aria-selected])]:bg-primary/10 dark:[&:has([aria-selected])]:bg-primary/20 
          first:[&:has([aria-selected])]:rounded-l-md 
          last:[&:has([aria-selected])]:rounded-r-md 
          focus-within:relative focus-within:z-20
        `,
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium text-foreground aria-selected:opacity-100 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200",
        ),
        day_range_end: "day-range-end",
        day_selected: `
          bg-primary text-primary-foreground 
          hover:bg-primary hover:text-primary-foreground 
          focus:bg-primary focus:text-primary-foreground 
          shadow-sm
        `,
        day_today: "bg-accent/20 dark:bg-accent/30 text-accent font-semibold",
        day_outside: `
          day-outside text-muted-foreground opacity-50 
          aria-selected:bg-primary/10 dark:aria-selected:bg-primary/20 
          aria-selected:text-muted-foreground aria-selected:opacity-30
        `,
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: `
          aria-selected:bg-primary/10 dark:aria-selected:bg-primary/20 
          aria-selected:text-foreground
        `,
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-primary" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-primary" />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
