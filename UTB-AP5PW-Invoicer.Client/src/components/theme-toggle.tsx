import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({
  size,
  ...props
}: { size: "sm" | "lg" } & React.ComponentProps<"div">) {
  const { setTheme } = useTheme()

  function toggleIcon() {
    if (size === "sm") {
      return (
        <Button variant="outline" size="icon-sm">
          <Sun className="h-[0.8rem] w-[0.8rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[0.8rem] w-[0.8rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Vzhled</span>
        </Button>
      )
    } else {
      return (
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Vzhled</span>
        </Button>
      )
    }
  }

  return (
    <div {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {toggleIcon()}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Světlý
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Tmavý
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Výchozí (systémový)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
