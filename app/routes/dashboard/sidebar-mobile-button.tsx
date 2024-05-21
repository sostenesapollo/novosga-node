import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { Icons } from "@/components/icons/icons";
import { routesMapping, routesMappingBottom } from "./routes-mapping";
import { twMerge } from "tailwind-merge";
import { Link, useMatches } from "@remix-run/react";
import ThemeSelector from "@/components/theme/theme-selector";
import useLocalStorage from "@/components/use-local-storage/use-local-storage";

export function SidebarMobileButton({ className }: any) {
  const matches = useMatches();
  const { id: currentRoute } = matches[matches.length - 1];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={twMerge("", className)}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            to="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Icons.dashboardIcon className="h-8 w-8 transition-all group-hover:scale-90" />
          </Link>
          {[...routesMapping, ...routesMappingBottom].map((route) => (
            <Link
              key={`header-map:${route.to}`}
              to={route.to}
              className={twMerge(
                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                currentRoute === route.path && "text-foreground"
              )}
            >
              <route.icon />
              {route.name}
            </Link>
          ))}
          <ThemeSelector mode="link" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
