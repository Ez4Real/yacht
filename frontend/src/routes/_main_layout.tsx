import { Outlet, createFileRoute } from "@tanstack/react-router"
// import Footer from "@/components/Footer"
import { ThemeProvider } from "../components/theme-provider"
import "../index.css"
import { Header } from "@/components/main/Header"
import { Footer } from "@/components/main/Footer"
import { ThemeSwitcher } from "@/components/main/ThemeSwitcher"


export const Route = createFileRoute("/_main_layout")({
  component: MainLayout,
})

function MainLayout() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="main-ui-theme">
      <div className="min-h-screen pl-[20px] pr-[60px] pb-[50px] flex flex-col">
        <Header />

        <main className="flex-1 pb-[100px]">
          <Outlet />
        </main>

        <Footer  />

        <ThemeSwitcher className="fixed right-[60px] bottom-[50px] z-[40]" />
      </div>
    </ThemeProvider>
  )
}