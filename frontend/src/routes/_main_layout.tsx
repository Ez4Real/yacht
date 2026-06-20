import { Outlet, createFileRoute } from "@tanstack/react-router"
// import Footer from "@/components/Footer"
import { ThemeProvider } from "../components/theme-provider"
import "../index.css"
import { Header } from "@/components/main/Header"
import { Footer } from "@/components/main/Footer"


export const Route = createFileRoute("/_main_layout")({
  component: MainLayout,
})

function MainLayout() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="main-ui-theme">
      <div className="pl-[30px] pr-[60px]">
        <Header />
        <main className="pb-[160px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}