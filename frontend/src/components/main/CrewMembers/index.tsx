import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const crewMembers = [
  {
    name: "Nadia",
    role: "Co-founder",
    image: "public/assets/images/photoNadia.svg",
  },
  {
    name: "Stefan",
    role: "Co-founder",
    image: "public/assets/images/photoStefan.svg",
  },
  {
    name: "Johanna",
    role: "Broker",
    image: "public/assets/images/photoStefan.svg",
  },
  {
    name: "Johanna",
    role: "Broker",
    image: "public/assets/images/photoStefan.svg",
  },
  {
    name: "Johanna",
    role: "Broker",
    image: "public/assets/images/photoStefan.svg",
  },
  {
    name: "Johanna",
    role: "Broker",
  },
]

export function CrewMembers() {
  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent className="p-1">
          {crewMembers.map((member, index) => (
            <CarouselItem 
              key={index} 
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2"
            >
              <div className="">
                <Card className="overflow-hidden border-0 shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="object-cover bg-[#FFF3DB] w-[293px] h-[411px]"
                    />
                    <p className="mt-5 text-start text-[#501500] font-[400] text-[24px]">
                      {member.name}, 
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
