import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons/icons";
import { whatsappContactBusinessUsURL } from "@/lib/utils/utils";
import ThemeSelector from "../theme/theme-selector";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 md:py-4">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center space-x-2" to="/">
          <Icons.dashboardIcon className="text-muted-foreground" />
          <span className="text-lg font-bold text-muted-foreground">
            Novo Sga Node
          </span>
        </Link>
      </div>
      <div className="flex ">
        <div className="mr-2 mt-1 sm:mt-0">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-xs sm:text-xs text-muted-foreground"
            >
              Home
            </Button>
          </Link>
          {/* <a href={whatsappContactBusinessUsURL}>
            <Button
              variant="ghost"
              className="text-xs sm:text-xs text-muted-foreground"
            >
              Contato
            </Button>
          </a> */}
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-xs sm:text-xs text-muted-foreground"
            >
              Entrar
            </Button>
          </Link>
        </div>
        {/*  */}
        <ThemeSelector className="sm:mt-2 mt-3 mr-2" />
      </div>
    </header>
  );
}
