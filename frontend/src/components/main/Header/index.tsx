import { useLocation } from "@tanstack/react-router"
import { MenuDialog } from "@/components/main/MenuDialog"
import { Button } from "@/components/ui/button"
import { EnquireDialog } from "../EnquireDialog"
import { useState } from "react"

export const Header = () => {
  const location = useLocation()
  const isHomePage = location.pathname === "/"
  // const [menuOpen, setMenuOpen] = useState(false)
  // const [enquireOpen, setEnquireOpen] = useState(false)

  const [activeSheet, setActiveSheet] = useState<"menu" | "enquire" | null>(null);

  return (
    <header>
      <nav>
        <div
          className="
            flex 
            justify-between 
            items-center 
            
            pt-[13px]
            tablet:pt-[20px]
            desktop:pt-[30px]

            pb-[13px]
            tablet:pb-[30px]
            laptop:pb-[40px]
            desktop:pb-[30px]
          "
        >
          <div
            className="
              mobile:hidden
              tablet:block
            "
          >
            {!isHomePage && (
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                className="p-0 gap-0"
              >
                <span className="text-main-nav">back</span>
              </Button>
            )}
          </div>

          <div className="flex justify-between w-[100%] tablet:w-[66%] laptop:w-[49.1%]">
            <MenuDialog
              open={activeSheet === "menu"}
              onOpenChange={(open) =>
                setActiveSheet(open ? "menu" : null)
              }
              onShowEnquire={() => setActiveSheet("enquire")}
            />
            <EnquireDialog
              open={activeSheet === "enquire"}
              onOpenChange={(open) =>
                setActiveSheet(open ? "enquire" : null)
              }
              onShowMenu={() => setActiveSheet("menu")}
            />
          </div>
        </div>
      </nav>
    </header>
  )
}
