import { Link } from "@tanstack/react-router";

type MemberDetailProps = {
  member: {
    id: number;
    name: string;
    role: string;
    image?: string | null;
    description?: string;
    descriptionSecond?: string;
    quote?: string;
  };
  prevMember?: {
    id: number;
  };
  nextMember?: {
    id: number;
  };
  currentIndex: number;
  total: number;
};

export function MemberDetail({
  member,
  prevMember,
  nextMember,
  currentIndex,
  total,
}: MemberDetailProps) {
  return (
    <div className="
        flex 
        flex-col 
        tablet:flex-row 
        justify-between 
        pt-[24px]
        tablet:pt-[0]
      ">

      <div className="flex flex-col items-center gap-[30px]">
        {member.image && (
          <img
            src={member.image}
            alt={member.name}
            className="
              object-cover
              w-[370px]
              tablet:w-[160px]
              laptop:w-[320px]
              desktop:w-[360px]
              wide:w-[470px]
              h-[440px]
              tablet:h-[225px]
              laptop:h-[450px]
              desktop:h-[506px]
              wide:h-[660px]
            "
          />
        )}

        <div className="hidden laptop:flex justify-between text-main-nav w-full">
          {prevMember ? (
            <Link
              to="/members/$id"
              params={{ id: String(prevMember.id) }}
              className="transition-opacity hover:opacity-60"
            >
              <img src="/assets/icons/arrow-left.svg" alt="Previous member" />
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center w-[35px]">
            <span className="text-foreground nav-btn-detail">
              {currentIndex + 1}
            </span>
            <span className="text-role nav-btn-detail">/{total}</span>
          </div>

          {nextMember ? (
            <Link
              to="/members/$id"
              params={{ id: String(nextMember.id) }}
              className="transition-opacity hover:opacity-60"
            >
              <img src="/assets/icons/arrow-right.svg" alt="Next member" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      <div className="w-full tablet:w-[66%] laptop:w-[49.1%]">
        <div className="flex items-end mt-[20px] tablet:mt-0">
          <span className="text-h2 mr-[10px]">{member.name}</span>

          <span className="
            text-role 
            font-light 
            text-[18px]
            desktop:text-[22px]
            leading-[25px]
            tracking-[2%]
          ">
            / {member.role}
          </span>
        </div>

        <div className="
          max-w-[370px] 
          tablet:max-w-[478px]
          laptop:max-w-[570px] 
          desktop:max-w-[650px]
          wide:max-w-[730px]
        ">
          <p className="text-main-style mt-[30px] tablet:mt-[20px] laptop:mt-[30px]">
            {member.description}
          </p>

          {member.descriptionSecond && (
            <p className="mt-[40px] laptop:mt-[50px] wide:mt-[55px] text-main-style">
              {member.descriptionSecond}
            </p>
          )}

          {member.quote && (
            <p className="mt-[40px] laptop:mt-[50px] wide:mt-[55px] font-cursive text-quote">
              {member.quote}
            </p>
          )}
        </div>

        <div className="flex laptop:hidden mt-[40px] justify-between items-center">
          {prevMember ? (
            <Link to="/members/$id" params={{ id: String(prevMember.id) }}>
              <img src="/assets/icons/arrow-left.svg" alt="Previous member" />
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center w-[35px]">
            <span className="text-foreground nav-btn-detail">
              {currentIndex + 1}
            </span>
            <span className="text-role nav-btn-detail">/{total}</span>
          </div>

          {nextMember ? (
            <Link
              to="/members/$id"
              params={{ id: String(nextMember.id) }}
              className="transition-opacity hover:opacity-60"
            >
              <img src="/assets/icons/arrow-right.svg" alt="Next member" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}
