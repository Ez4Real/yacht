import { Outlet, createFileRoute } from "@tanstack/react-router"
// import Footer from "@/components/Footer"
import "../index.css"
import { Header } from "@/components/main/Header"
import { Footer } from "@/components/main/Footer"


export const Route = createFileRoute("/_main_layout")({
  component: MainLayout,
})

function MainLayout() {

  return (
    <>
      <div className="pl-[30px] pr-[60px]">
        <Header />
        <main className="pb-[162px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}