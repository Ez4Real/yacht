type MemberDetailProps = {
  member: {
    slug: string;
    name: string;
    role: string;
    image?: string | null;
    description?: string;
    descriptionSecond?: string;
    quote?: string;
  };
};

export function MemberDetail({ member }: MemberDetailProps) {
  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        {member.image && (
          <img
            src={member.image}
            alt={member.name}
            className="object-cover"
          />
        )}
      </div>

      <div className="w-1/2">
        <div className="flex items-baseline">
          <span className="text-h2 mr-[10px]">{member.name}{" "}</span>
          <span className="text-role text-[22px]">/ {member.role}</span>
        </div>

        <p className="mt-[30px] text-main-style">
          {member.description}
        </p>

        {member.descriptionSecond && (
          <p className="mt-[80px] text-main-style">
            {member.descriptionSecond}
          </p>
        )}

        {member.quote && (
          <p className="mt-[80px] font-cursive text-quote">
            {member.quote}
          </p>
        )}
      </div>
    </div>
  );
}