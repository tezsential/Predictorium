import { getLockInfo } from '@/lib/lock';
import PredictionCards from './prediction-cards';
import LatestUsersSection from './latest-users-section';

const SEASON_YEAR = 2026;
const PREDICTION_KEY = 'f2-2026';

export default async function F2DashboardPage() {
  const lockInfo = getLockInfo(SEASON_YEAR);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">F2 Season {SEASON_YEAR} Predictions</h2>
      </div>

      {/* My Predictions */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Predictions</h3>
        <PredictionCards seasonYear={SEASON_YEAR} />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Lock:</strong> March 1, {SEASON_YEAR} at 00:00 (Europe/Prague).{' '}
            {lockInfo.locked ? 'Locked' : 'Editable now.'}
          </p>
        </div>
      </section>

      {/* Latest Users */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Users</h3>
        <LatestUsersSection predictionKey={PREDICTION_KEY} seasonYear={SEASON_YEAR} />
      </section>

      {/* Leagues Placeholder */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leagues</h3>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </section>
    </div>
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
