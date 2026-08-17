import { Link, useRouterState } from "@tanstack/react-router"
import { InfoPagesService, OpenAPI } from "@/client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeSwitcher } from "../ThemeSwitcher"
import { useQuery } from "@tanstack/react-query"

function getInfoPageMenuItemsQueryOptions() {
  return {
    queryFn: () => InfoPagesService.readInfoPageMenuItems({ skip: 0, limit: 100 }),
    queryKey: ["info-pages"],
  }
}

const menuItems = [
  { label: "home", to: "/" },
  { label: "team", to: "/crew-members" },
  // { label: "sales", to: "#" },
  // { label: "charters", to: "/charters" },
  { label: "about us", to: "/about" },
  { label: "destinations", to: "/destinations" },
  // { label: "concierge", to: "/concierge" },
  // { label: "charter management", to: "/charter-management" },
  // { label: "owner representation", to: "/owner-representation" },
  // { label: "spinnaker magazine", to: "/spinnaker-magazine", icon: "/assets/icons/icon-menu-right.svg" }
]

type MenuDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShowEnquire: () => void
}

export const MenuDialog = ({
  open,
  onOpenChange,
  onShowEnquire,
}: MenuDialogProps) => {
  const { data: infoPageMenuItems } = useQuery({
    ...getInfoPageMenuItemsQueryOptions(),
    enabled: open,
  })
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const router = useRouterState()
  const currentPath = router.location.pathname

  const instagram = OpenAPI.INSTAGRAM
  const email = OpenAPI.EMAIL

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center transition-none">
          <p className="text-main-nav">menu</p>

          <img
            src={
              isDark ? "/assets/icons/plus-dark.svg" : "/assets/icons/plus.svg"
            }
            alt="Open menu"
            className="w-[38px]"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          !fixed 
          !inset-0 
          !z-50 
          !max-w-none 
          !w-screen 
          !h-screen 
          border-0 
          bg-transparent 
          text-foreground 
          p-0
        "
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="flex h-screen justify-end">
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="flex-1 h-full cursor-default"
            />
          </SheetClose>

          <div
            className="
              w-[calc(100%)]
              tablet:w-[calc(66%+35px)] 
              laptop:w-[calc(50%+40px)]
              desktop:w-[calc(50%+45px)]

              h-full
              bg-background 
              flex 
              flex-col 

              pt-[13px] 
              tablet:pt-[20px]
              desktop:pt-[30px]

              pr-[11px]
              tablet:pr-[20px]
              laptop:pr-[40px]
              desktop:pr-[30px]
              wide:pr-[50px]

              pb-[40px]
              tablet:pb-[20px]
              desktop:pb-[40px]
              wide:pb-[50px]

              pl-[10px]
              tablet:pl-[42px]
              desktop:pl-[50px]
            "
          >
            <div className="flex justify-between pb-[13px] mobile:pb-[0]">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="
                    flex items-center 
                    p-0 
                    gap-0 
                    transition-none
                  "
                >
                  <p className="text-main-nav">menu</p>
                  <img
                    src={
                      isDark
                        ? "/assets/icons/minus-dark.svg"
                        : "/assets/icons/minus.svg"
                    }
                    alt="Close menu"
                    className="w-[38px]"
                  />
                </Button>
              </SheetClose>

              <Button
                onClick={onShowEnquire}
                variant="ghost"
                className="
                  flex 
                  items-center 
                  p-0 
                  gap-0 
                  transition-none
                  mr-[-11px]
                  tablet:mr-[0]
                "
              >
                <p className="text-main-nav">enquire</p>
                <img
                  src={
                    isDark
                      ? "/assets/icons/plus-dark.svg"
                      : "/assets/icons/plus.svg"
                  }
                  alt="iconPlus"
                  className="w-[38px]"
                />
              </Button>
            </div>
            <nav
              className="
                mt-[30px]
                tablet:mt-[40px]
                laptop:mt-[30px]

                gap-[20px] 
                tablet:gap-[5px]
                desktop:gap-[10px]
                flex 
                flex-col 
                items-start
              "
            >
              {menuItems.map((item) => {
                const isActive = currentPath === item.to
                return (
                  <SheetClose asChild key={item.label}>
                    <Link
                      to={item.to}
                      hash="root"
                      className={`text-menu flex items-center ${
                        isActive ? "text-foreground" : "text-role"
                      }`}
                    >
                      <span>{item.label}</span>

                      {/* {item.icon && <img src={item.icon} alt="arrow-icon" />} */}
                    </Link>
                  </SheetClose>
                )
              })}

              {infoPageMenuItems?.data?.map((item) => {
                  const isActive = currentPath === `/info/${item.id}`

                  return(
                    <SheetClose asChild key={item.id}>
                      <Link
                        to="/info/$id"
                        params={{ id: String(item.id) }}
                        hash="root"
                        className={`text-menu flex items-center ${
                          isActive ? "text-foreground" : "text-role"
                        }`}
                      >
                        <span className="lowercase">{item.title}</span>

                        {/* {item.icon && <img src={item.icon} alt="arrow-icon" />} */}
                      </Link>
                    </SheetClose>
                  )
              })}
            </nav>

            <div className="mt-auto flex justify-between items-end w-[100%]">
              <div className="flex items-end justify-end">
                <div className="flex flex-col items-start gap-[20px] tablet:gap-[10px] desktop:gap-[30px]">
                  <a
                    className="flex justify-center items-center"
                    href={`https://www.instagram.com/${instagram}`}
                    target="_blank"
                  >
                    <p className="text-main-nav">instagram</p>
                    <img
                      className="w-[38px] tablet:w-[44px] laptop:w-[38px] desktop:w-[44px]"
                      src={
                        isDark
                          ? "/assets/icons/arrow-dark.svg"
                          : "/assets/icons/arrow.svg"
                      }
                      alt="instagramIcon"
                    />
                  </a>

                  <a
                    className="text-main-nav"
                    href={`mailto:${email}`}
                    target="_blank"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
