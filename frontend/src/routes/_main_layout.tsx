import { createFileRoute, Outlet } from "@tanstack/react-router"
// import Footer from "@/components/Footer"
import { ThemeProvider } from "../components/theme-provider"
import "../index.css"
import { Footer } from "@/components/main/Footer"
import { Header } from "@/components/main/Header"
import { ThemeSwitcher } from "@/components/main/ThemeSwitcher"

export const Route = createFileRoute("/_main_layout")({
  component: MainLayout,
})

function MainLayout() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="main-ui-theme">
      <div
        className="
          min-h-screen
          flex 
          flex-col
          
          pl-[10px]
          tablet:pl-[20px] 
          wide:pl-[20px]

          pr-[10px]
          tablet:pr-[20px]
          laptop:pr-[30px]
          wide:pr-[50px]
          
          pb-[40px]
          tablet:pb-[20px]
          desktop:pb-[30px]
          wide:pb-[50px]
        ">

        <Header />

        <main className="flex-1 pb-[50px] tablet:pb-[50px] desktop:pb-[60px]">
          <Outlet />
        </main>


        <Footer />
        <ThemeSwitcher className="
          fixed

          right-[20px]
          laptop:right-[40px]
          wide:right-[60px]

          bottom-[20px]
          laptop:bottom-[20px]
          desktop:bottom-[30px]
          wide:bottom-[50px]

          z-[40]
        "/>

      </div>
    </ThemeProvider>
  )
}
