// import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/main/Header"
import { ThemeSwitcher } from "@/components/main/ThemeSwitcher"

const NotFound = () => {
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
            "
          >
            <Header />
    
            {/* <main className="flex-1 pb-[50px] tablet:pb-[50px] desktop:pb-[60px]"> */}
              <div
                className="flex items-center justify-center flex-col mt-[120px]"
                data-testid="not-found"
              >
                <span className="
                
                text-[200px]
                tablet:text-[300px]
                laptop:text-[300px]
                desktop:text-[300px]
                wide:text-[300px]

                font-bold 
                leading-none
                mb-7 
                font-druk">
                  404
                </span>
                <span className="
                text-2xl
                font-bold
                mb-[28px]
                text-main-style
                ">something is wrong</span>

                {/* <p className="text-lg text-muted-foreground mb-4 text-center z-10">
                  The page you are looking for was not found.
                </p> */}
                <Button className="
                text-main-style
                bg-transparent
                hover:bg-transparent
                transition-none
                ">back</Button>
              </div>
            {/* </main> */}
    
            <ThemeSwitcher
              className="
              fixed
    
              right-[20px]
              laptop:right-[40px]
              wide:right-[60px]
    
              bottom-[20px]
              laptop:bottom-[20px]
              desktop:bottom-[30px]
              wide:bottom-[50px]
    
              z-[40]
            "
            />
          </div>
        </ThemeProvider>
  )
}

export default NotFound
