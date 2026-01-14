'use client';

import { useRouter } from 'next/navigation';

export default function PredictionsHubPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Predictions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select a championship to view and manage your predictions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PredictionTile
          title="F1 Season 2026"
          description="Formula 1 World Championship predictions"
          icon="🏎️"
          onClick={() => router.push('/app/f1-2026')}
        />
        
        <PredictionTile
          title="F2 Season 2026"
          description="Formula 2 Championship predictions"
          icon="🏁"
          onClick={() => router.push('/app/f2-2026')}
        />

        {/* Future predictions can be added here */}
      </div>
    </div>
  );
}

interface PredictionTileProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

function PredictionTile({ title, description, icon, onClick }: PredictionTileProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-300"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
