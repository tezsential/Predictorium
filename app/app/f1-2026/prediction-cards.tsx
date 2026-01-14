'use client';

import { useRouter } from 'next/navigation';

interface CardProps {
  title: string;
  badge: 'PRIMARY' | 'WILD';
  description: string;
  onClick: () => void;
  tone: 'indigo' | 'purple';
}

function Card({ title, badge, description, onClick, tone }: CardProps) {
  const toneClasses = tone === 'indigo'
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-purple-600 hover:bg-purple-700';

  const badgeClasses = tone === 'indigo'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-purple-100 text-purple-800';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded ${badgeClasses}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${toneClasses}`}
      >
        Open
      </button>
    </div>
  );
}

export default function PredictionCards({ seasonYear }: { seasonYear: number }) {
  const router = useRouter();

  const goTo = (type: 'PRIMARY' | 'WILD') => {
    router.push(`/app/prediction/${seasonYear}/${type}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        title="Primary Prediction"
        badge="PRIMARY"
        description="Your main prediction for the season."
        onClick={() => goTo('PRIMARY')}
        tone="indigo"
      />

      <Card
        title="Wild Prediction"
        badge="WILD"
        description="An optional bold prediction with different rankings."
        onClick={() => goTo('WILD')}
        tone="purple"
      />
    </div>
  );
}
