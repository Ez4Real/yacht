import { useTheme } from "@/components/admin/theme-provider";

export const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex justify-between">
      <div className="w-[50%]">
        <img
          src={
            isDark
              ? "/assets/icons/logo-dark.svg"
              : "/assets/icons/logo-light.svg"
          }
          alt="BMA Yachts"
        />
      </div>

      <div className="w-[50%] mb-[67px]">
        <p className="text-main font-inter">
          Our mission is to curate superyacht experiences that align <br />
          with modern values — intentional living, human connection,
          <br />
          aesthetic clarity, and respect for nature — transforming <br />
          chartering from a transaction into a long-term lifestyle.
        </p>

        <p className="mt-[80px] font-inter text-main">
          BMA Yachts redefines superyacht charter as a modern <br />
          lifestyle rather than a symbol of excess.
        </p>

        <p className="mt-[80px] font-cursive text-quote">
          Not just different - distinct, redefining private <br />
          yacht brokerage.
        </p>

        <img
          src="/assets/images/homePage.svg"
          className="w-[730px] mt-[80px]"
          alt="Monaco yacht view"
        />
      </div>
    </div>
  );
};