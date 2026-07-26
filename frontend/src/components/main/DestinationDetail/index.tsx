type DestinationDetailProps = {
  destination: {
    id: number
    title: string
    country: string
    region?: string
    image: string
    imageBig?: string
    imageDetail?: string
    description?: string
    highlightedDescription?: string
    descriptionEnd?: string
    cardDescription?: string
    descriptionSecond?: string
    quote?: string
    detailImageText?: string
  }
}

export function DestinationDetail({ destination }: DestinationDetailProps) {
    return (
        <div className="
          flex 
          flex-col 
          tablet:flex-row 
          justify-between 
        ">
            <div className="mt-[24px] tablet:mt-[0px]">
                <img
                    src={destination.imageBig ?? destination.image}
                    alt={destination.title}
                    className="
                      object-cover 
                      w-[390px]
                      tablet:w-[160px]
                      laptop:w-[424px]
                      desktop:w-[530px]
                      wide:w-[737px]
                    "/>

                {destination.quote && (
                    <p className="font-cursive text-quote mt-[40px] hidden">
                        {destination.quote}
                    </p>
                )}
             </div>

            <div className="tablet:w-[66%] laptop:w-[49.1%]">

              <p className="text-h2 mt-[40px] tablet:mt-[0px]">
                {destination.title} /{" "}

                <span>
                  {destination.country}
                  {destination.region ? ` / ${destination.region}` : ""}
                </span>

              </p>

              <p className="mt-[40px] text-main-style">
                {destination.description}{" "}
                <span className="text-role text-main-style">
                  {destination.highlightedDescription}
                </span>{" "}
                {destination.descriptionEnd}
              </p>

              <p className="mt-[40px] text-main-style">
                {destination.cardDescription}
              </p>

              {destination.descriptionSecond && (
                <p className="mt-[40px] text-main-style">
                  {destination.descriptionSecond}
                </p>
              )}

                {destination.imageDetail && (
                    <>
                    <img
                        src={destination.imageDetail}
                        alt={destination.title}
                        className="mt-[40px] object-cover "
                    />

                  {destination.detailImageText && (
                    <p className="mt-[40px] text-main-style">
                      {destination.detailImageText}
                    </p>
                  )}
                </>
              )}
          </div>
        </div>
  )
}
