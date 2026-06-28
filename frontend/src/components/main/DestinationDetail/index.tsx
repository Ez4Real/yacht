type DestinationDetailProps = {
    destination: {
        id: number;
        title: string;
        country: string;
        region?: string;
        image: string;
        imageBig?: string;
        imageDetail?: string;
        description?: string;
        highlightedDescription?: string;
        descriptionEnd?: string;
        cardDescription?: string;
        descriptionSecond?: string;
        quote?: string;
        detailImageText?: string;
    };
};

export function DestinationDetail({ destination }: DestinationDetailProps) {
    return (
        <div className="flex justify-between">
            <div className="w-1/2">
                <img
                    src={destination.imageBig ?? destination.image}
                    alt={destination.title}
                    className="object-cover"
                />

                {destination.quote && (
                    <p className="font-cursive text-quote mt-[80px]">
                        {destination.quote}
                    </p>
                )}
            </div>

      <div className="w-1/2">
        <p className="text-title-style">
          {destination.title} /{" "}
          <span>
            {destination.country}
            {destination.region ? ` / ${destination.region}` : ""}
          </span>
        </p>

        <p className="mt-[30px] max-w-[617px] text-main-style">
          {destination.description}{" "}
          <span className="text-role text-main-style">
            {destination.highlightedDescription}
          </span>{" "}
          {destination.descriptionEnd}
        </p>

        <p className="mt-[30px] max-w-[617px] text-main-style">
          {destination.cardDescription}
        </p>

        {destination.descriptionSecond && (
          <p className="mt-[80px] max-w-[617px] text-main-style">
            {destination.descriptionSecond}
          </p>
        )}

                {destination.imageDetail && (
                    <>
                        <img
                            src={destination.imageDetail}
                            alt={destination.title}
                            className="mt-[80px] max-w-[617px] object-cover"
                        />

            {destination.detailImageText && (
              <p className="mt-[80px] max-w-[617px] text-main-style">
                {destination.detailImageText}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
