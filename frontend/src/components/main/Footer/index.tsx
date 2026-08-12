import { useTheme } from "@/components/theme-provider"

type FooterProps = {
  instagram: string
  email: string
}

export const Footer = ({ instagram, email }: FooterProps) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <footer className="flex justify-end">
      <div className="w-[100%] tablet:w-[66%] laptop:w-[49.1%] gap-[20px] tablet:gap-[10px] desktop:gap-[30px]">
        <a
          className="flex items-center mb-[20px] tablet:mb-[10px] laptop:mb-[10px] desktop:mb-[30px]"
          href={`https://www.instagram.com/${instagram}`}
          target="_blank"
        >
          <p className="text-main-nav">instagram</p>
          <img
            className="w-[38px]"
            src={
              isDark
                ? "/assets/icons/arrow-dark.svg"
                : "/assets/icons/arrow.svg"
            }
            alt="inst"
          />
        </a>

        <a className="text-main-nav" href={`mailto:${email}`} target="_blank">
          {email}
        </a>
      </div>
    </footer>
  )
}
