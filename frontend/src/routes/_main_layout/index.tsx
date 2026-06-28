import { useTheme } from "@/components/theme-provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main_layout/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const logoSrc = isDark
    ? "/assets/icons/logo-dark.svg"
    : "/assets/icons/logo-light.svg";

  return (
    <div className="relative">
      {/* LOGO ONLY DESKTOP BREAKPOINT */}
      <img
        src={logoSrc}
        alt="BMA Yachts"
        className="
          hidden
          tablet:block
          absolute
          left-0
          top-[-74px]

          w-[390px]
          tablet:w-[160px]
          laptop:w-[400px]
          desktop:w-[500px]
          wide:w-[618px]

          tablet:m-[8.22px_10px]
          laptop:m-[12.02px_10px]
          desktop:m-[13.6px_10px]
        "
      />

      {/* LOGO ONLY MOBILE BREAKPOINT*/}
      <img
        src={logoSrc}
        alt="BMA Yachts"
        className="
          tablet:hidden
          w-[390px]
          max-w-full
          mb-[20px]
          mt-[11px]
        "/>

      <div className="
        flex 
        flex-col 
        tablet:flex-row 
        tablet:justify-end
      ">

        <div className="tablet:w-[66%] laptop:w-[49.1%]">


          <p className="
            text-main-style 
            max-w-[359px] 
            tablet:max-w-[415px]
            laptop:max-w-[518px] 
            desktop:max-w-[610px]
            wide:max-w-[730px]
           ">
            Our mission is to curate superyacht experiences that align with modern
            values — intentional living, human connection, aesthetic clarity, and
            respect for nature — transforming chartering from a transaction into a
            long-term lifestyle.
          </p>

          <p className="
            mt-[40px] 
            laptop:mt-[50px] 
            text-main-style 
            max-w-[359px] 
            tablet:max-w-[415px] 
            laptop:max-w-[518px] 
            desktop:max-w-[610px]
            wide:max-w-[730px]
          ">
            BMA Yachts redefines superyacht charter as a modern lifestyle rather
            than a symbol of excess.
          </p>

          <p className="
          mt-[40px] 
            laptop:mt-[50px] 
            font-cursive 
            text-quote 
            max-w-[359px] 
            tablet:max-w-[415px] 
            laptop:max-w-[450px] 
            desktop:max-w-[390px]
            wide:max-w-[426px]
          ">
            Don&apos;t waste your time for
            things that other people like
          </p>

          <img
            src="/assets/images/homePage.svg"
            alt="Monaco yacht view"

            className="
              object-cover
              mt-[40px]
              laptop:mt-[50px]
              desktop:mt-[54px]
              wide:mt-[55px] 
              
              w-[369px]
              tablet:w-[447px]
              laptop:w-[569px]
              desktop:w-[648px]
              wide:w-[730px]

              max-h-[117px]
              tablet:max-h-[129px]
              desktop:max-h-[150px]
              wide:max-h-[233px] 
              "/>
        </div>

      </div>
    </div>
  )
}
