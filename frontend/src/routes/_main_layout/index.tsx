import { createFileRoute, Link } from "@tanstack/react-router"
import { useTheme } from "@/components/theme-provider"

export const Route = createFileRoute("/_main_layout/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  return (
    <div className="flex justify-between">
      <Link to="/">
        <img
          src={
            isDark
              ? "/assets/icons/logo-dark.svg"
              : "/assets/icons/logo-light.svg"
          }
          alt="BMA Yachts"
        />
      </Link>

      <div className="w-[50%]">
        <p className="text-main-style">
          Our mission is to curate superyacht experiences that align <br />
          with modern values — intentional living, human connection,
          <br />
          aesthetic clarity, and respect for nature — transforming <br />
          chartering from a transaction into a long-term lifestyle.
        </p>

        <p className="mt-[70px] text-main-style">
          BMA Yachts redefines superyacht charter as a modern <br />
          lifestyle rather than a symbol of excess.
        </p>

        <p className="mt-[70px] text-main-style font-cursive text-quote">
          Don't waste your time for <br />
          things that other people like
        </p>

        <img
          src="/assets/images/homePage.svg"
          alt="Monaco yacht view"
          className="w-[730px] mt-[82px]"
        />
      </div>
    </div>
  )
}
