import { getLatestUsers } from './actions';

interface LatestUsersSectionProps {
  predictionKey: string;
  seasonYear: number;
}

export default async function LatestUsersSection({
  predictionKey,
  seasonYear,
}: LatestUsersSectionProps) {
  const users = await getLatestUsers(seasonYear);

  if (users.length === 0) {
    return <div className="text-gray-500 text-sm">No predictions yet. Be the first!</div>;
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {users.map((user) => (
        <UserAvatar
          key={user.userId}
          userId={user.userId}
          email={user.email}
          seasonYear={seasonYear}
        />
      ))}
    </div>
  );
}

interface UserAvatarProps {
  userId: string;
  email: string;
  seasonYear: number;
}

function UserAvatar({ userId, email, seasonYear }: UserAvatarProps) {
  const initial = email.charAt(0).toUpperCase();
  const color = stringToColor(userId);

  return (
    <a
      href={`/app/prediction/${seasonYear}/PRIMARY?series=f2&userId=${userId}`}
      className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold text-lg hover:scale-110 transition-transform shadow-md"
      style={{ backgroundColor: color }}
      title={email}
    >
      {initial}
    </a>
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}
