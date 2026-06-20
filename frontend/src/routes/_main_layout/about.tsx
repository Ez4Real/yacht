import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main_layout/about')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex justify-between">
            <div className="w-1/2">
                <img
                    src="/assets/images/about-main.svg"
                    alt="About BMA Yachts"
                    className="object-cover"
                />

                <p className="mt-[80px] font-cursive text-quote max-w-[607px]">
                    Our mission is to curate superyacht experiences that align with modern values — intentional living,
                    human
                </p>
            </div>

            <div className="w-1/2">
                <p className="max-w-[617px] text-main-style">
                    I began my way in yachting in childhood, practicing sailing, regattas,
                    and traveling on yachts around the world.{" "}
                    <span className="text-role">
                        Over the past 10 years, I have organized more than 100 large-scale yacht trips, sailing regattas,
                        and gastronomic experiences
                    </span>
                    ,{" "}delivering memorable experiences to over 3,000 satisfied clients.
                </p>

                <p className="mt-[80px] max-w-[617px] text-main-style">
                    I am founder of one of the largest yachting communities online,
                    Spinnaker Magazine, and a co-owner of Spinnaker Bureau and BMA Yachts.
                </p>

                <p className="mt-[80px] max-w-[617px] text-main-style">
                    I began my way in yachting in childhood, practicing sailing, regattas,
                    and traveling on yachts around the world.{" "}
                    <span className="text-role">
                        Over the past 10 years, I have organized more than 100 large-scale
                        yacht trips, sailing regattas, and gastronomic experiences,
                    </span>{" "}
                    delivering memorable experiences to over 3,000 satisfied clients.
                </p>

                <div className="mt-[80px]">
                    <img
                        src="/assets/images/about-brian.svg"
                        alt="Brian Muston"
                        className="object-cover"
                    />

                    <p className="mt-[20px] text-role text-[22px] leading-[26px]">
                        Brian Muston 2011
                    </p>
                </div>

                <p className="mt-[80px] max-w-[617px] text-main-style">
                    Our mission is to curate superyacht experiences that align
                    with modern values — intentional living, human connection, aesthetic clarity,
                    and respect fo
                </p>
            </div>
        </div>
    );
}
