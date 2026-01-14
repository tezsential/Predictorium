'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getTeamColor, extractTeamName, getTextColor } from '@/lib/team-colors';

interface SortableItemProps {
  id: string;
  rank: number;
  disabled?: boolean;
}

export function SortableItem({ id, rank, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Extract team name (for drivers it's "Name - Team", for constructors it's just the team)
  const teamName = extractTeamName(id);
  const backgroundColor = getTeamColor(teamName);
  const textColor = getTextColor(backgroundColor);
  const rankBgColor = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: backgroundColor,
      }}
      className={`flex items-center gap-2 rounded-lg shadow-sm border p-2 text-sm ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'
      }`}
      {...attributes}
      {...listeners}
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs"
        style={{ backgroundColor: rankBgColor, color: textColor }}
      >
        {rank}
      </div>
      <div className="flex-1 font-medium truncate" style={{ color: textColor }}>
        {id}
      </div>
      {!disabled && (
        <div className="flex-shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: textColor }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
