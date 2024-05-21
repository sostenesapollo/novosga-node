import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useHydrated } from "remix-utils/use-hydrated";
import React from "react";
import {
  getTheme,
  setTheme as setSystemTheme,
} from "@/components/theme/theme-switcher";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import Tooltip from "../tooltip/tooltip";
import { twMerge } from "tailwind-merge";

export default function ThemeSelector({ className = "", mode = "circle" }) {
  const hydrated = useHydrated();
  const [, rerender] = React.useState({});
  const setTheme = React.useCallback((theme: string) => {
    setSystemTheme(theme);
    rerender({});
  }, []);
  const theme = getTheme();

  return mode === "circle" ? (
    <Tooltip content="Mudar tema">
      <Button
        className={twMerge("w-5 h-5 rounded-full ", className)}
        size="icon"
        variant="ghost"
        onClick={() =>
          !hydrated
            ? null
            : theme === "dark"
            ? setTheme("light")
            : setTheme("dark")
        }
      >
        <span className="sr-only">Theme selector</span>
        {!hydrated ? null : theme === "dark" ? (
          <MoonIcon className="text-muted-foreground" />
        ) : theme === "light" ? (
          <SunIcon className="text-muted-foreground" />
        ) : (
          <LaptopIcon className="text-muted-foreground" />
        )}
      </Button>
    </Tooltip>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Link
          to="#"
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Button className="w-5 h-5 rounded-full " size="icon" variant="ghost">
            <span className="sr-only">Theme selector</span>
            {!hydrated ? null : theme === "dark" ? (
              <MoonIcon />
            ) : theme === "light" ? (
              <SunIcon />
            ) : (
              <LaptopIcon />
            )}
          </Button>
          Esquema de cor
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Esquema de cor</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("light")}
            aria-selected={theme === "light"}
          >
            Claro
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("dark")}
            aria-selected={theme === "dark"}
          >
            Escuro
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full"
            onClick={() => setTheme("system")}
            aria-selected={theme === "system"}
          >
            Cor do sistema
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
