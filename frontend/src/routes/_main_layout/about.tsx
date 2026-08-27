import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main_layout/about")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div
      className="
        flex 
        flex-col 
        tablet:flex-row 
        justify-between
        mt-[24px]
        tablet:mt-[0px]
      "
    >
      <div>
        <img
          src="/assets/images/about-main.svg"
          alt="About BMA Yachts"
          className="
            object-cover
            w-[408px]
            tablet:w-[210px]
            laptop:w-[424px]
            desktop:w-[530px]
            wide:w-[737px]
          "
        />

        <p className="mt-[40px] font-cursive text-quote mobile:hidden laptop:block w-[460px]">
          The future belongs to those who build with intention
        </p>
      </div>

      <div className="w-full tablet:w-[66%] laptop:w-[49.1%]">
        <p className="text-[36px] mb-[55px] mobile:mt-[25px] tablet:mt-[0] w-[100%] wide:w-[617px]">
          About
        </p>

        <p className="text-main-style mt-[40px] tablet:mt-[0] w-[100%] wide:w-[617px]">
          Since 2013, BMA Yachts has been delivering bespoke yacht experiences,
          brokerage expertise, and strategic yacht management services to
          clients worldwide. Based in Fort Lauderdale and operating globally, our approach is
          rooted in individuality, trust, and a deep understanding of the
          yachting lifestyle.
        </p>

        <p className="mt-[40px] wide:mt-[55px] text-main-style w-[100%] wide:w-[617px]">
          Whether assisting with a yacht purchase, managing a charter program,
          or designing a custom cruising itinerary, our team is committed to
          delivering guidance and support at every stage of the journey.
        </p>

        <div className="mt-[40px] wide:mt-[55px]">
          <img
            src="/assets/images/about-brian.svg"
            alt="Brian Muston"
            className="object-cover w-[408px]"
          />

          <p
            className="
            text-role 
            mt-[20px]
            text-[18px]
            tablet:text-[22px]
            leading-[25px]
            "
          >
            Brian Muston
          </p>

          <p className="mt-[55px] text-main-style w-[100%] wide:w-[617px]">
            For us, yachting is not simply about a vessel or destination. It is
            about freedom, connection, exploration, and the unforgettable
            moments created along the way. From the first conversation to the
            final day on board, we strive to provide an experience that is
            effortless, personalized, and memorable.
          </p>
        </div>

        <p className="text-[36px] mb-[55px] mt-[100px]">Services</p>

        <div className="w-[100%] wide:w-[617px]">
          <p className="mb-[25px] text-main-style">
            01 / Yacht Charters Worldwide
          </p>

          <p className="mb-[55px] text-main-style">
            Access to an exclusive portfolio of luxury yachts in the world's
            most sought-after destinations, supported by personalized planning
            and concierge-level service.
          </p>

          <p className="mb-[25px] text-main-style">
            02 / Yacht Sales & Acquisitions
          </p>

          <p className="mb-[55px] text-main-style">
            Professional representation for buyers and sellers, supported by
            market expertise, strategic negotiation, and access to both listed
            and off-market opportunities.
          </p>

          <p className="mb-[25px] text-main-style">03 / Charter Management</p>

          <p className="mb-[55px] text-main-style">
            Comprehensive charter management solutions designed to maximize
            yacht performance, optimize charter revenue, and ensure exceptional
            guest experiences.
          </p>

          <p className="mb-[25px] text-main-style">04 / Concierge Services</p>

          <p className="mb-[55px] text-main-style">
            Dedicated support before, during, and after your charter, including
            travel arrangements, reservations, special requests, and onboard
            experiences.
          </p>

          <p className="mb-[25px] text-main-style">
            05 / Owner Representation & Advisory
          </p>

          <p className="mb-[55px] text-main-style">
            Independent guidance and long-term support for yacht owners, helping
            protect their interests and maximize the value of their investment.
          </p>
        </div>
      </div>
    </div>
  )
}
