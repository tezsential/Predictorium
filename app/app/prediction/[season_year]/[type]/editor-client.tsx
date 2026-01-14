'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableItem } from './sortable-item';
import { savePrediction, loadPrediction, getUserEmail, getCurrentUserId } from './actions';
import { getLockInfo } from '@/lib/lock';
import { DEFAULT_ORDERED_LISTS } from '@/lib/data/f1';
import { F2_ORDERED_LISTS } from '@/lib/data/f2';
import type { PredictionType } from '@/lib/types';

export function EditorClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const season_year = Number(params.season_year);
  const type = params.type as PredictionType;
  const series = searchParams.get('series') || 'f1';
  const viewUserId = searchParams.get('userId'); // If present, viewing another user's prediction

  const [drivers, setDrivers] = useState<string[]>([]);
  const [constructors, setConstructors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const lockInfo = getLockInfo(season_year);
  const isLocked = lockInfo.locked;
  const isReadOnly = !!viewUserId; // Read-only if viewing another user
  const isDisabled = isLocked || isReadOnly;

  // Load prediction data and user email
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Get current user ID
      const currentUserId = await getCurrentUserId();
      
      // Get user email
      const email = await getUserEmail(viewUserId || null);
      setUserEmail(email);

      // Load prediction if exists
      const prediction = await loadPrediction(season_year, type, viewUserId || null);
      
      if (prediction) {
        // Load from database
        const driverItems = prediction.items
          .filter((item) => item.category === 'DRIVER')
          .sort((a, b) => a.rank - b.rank)
          .map((item) => item.name);
        
        const constructorItems = prediction.items
          .filter((item) => item.category === 'CONSTRUCTOR')
          .sort((a, b) => a.rank - b.rank)
          .map((item) => item.name);

        setDrivers(driverItems);
        setConstructors(constructorItems);
      } else {
        // Load defaults
        const defaults = series === 'f2' ? F2_ORDERED_LISTS : DEFAULT_ORDERED_LISTS;
        setDrivers([...defaults.drivers]);
        setConstructors([...defaults.constructors]);
      }
      
      setLoading(false);
    };

    loadData();
  }, [season_year, type, series, viewUserId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, category: 'drivers' | 'constructors') => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = category === 'drivers' ? drivers : constructors;
    const setList = category === 'drivers' ? setDrivers : setConstructors;

    const oldIndex = list.findIndex((item) => item === active.id);
    const newIndex = list.findIndex((item) => item === over.id);

    setList(arrayMove(list, oldIndex, newIndex));
  };

  const handleSave = async () => {
    if (isDisabled) {
      setMessage(isReadOnly ? 'Cannot edit another user\'s prediction.' : 'Predictions are locked.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result = await savePrediction({
        season_year,
        type,
        drivers,
        constructors,
      });

      if (result.error) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage('Saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    const backPath = series === 'f2' ? '/app/f2-2026' : '/app/f1-2026';
    router.push(backPath);
  };

  const handleTypeSwitch = () => {
    const newType = type === 'PRIMARY' ? 'WILD' : 'PRIMARY';
    const query = series === 'f2' ? '?series=f2' : '';
    const userParam = viewUserId ? `${query ? '&' : '?'}userId=${viewUserId}` : '';
    router.push(`/app/prediction/${season_year}/${newType}${query}${userParam}`);
  };

  const seriesLabel = series.toUpperCase();
  const title = `${type} - ${seriesLabel} Season ${season_year}`;

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleBack}
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-2"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
        </div>
        <button
          onClick={handleTypeSwitch}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
        >
          Switch to {type === 'PRIMARY' ? 'Wild' : 'Primary'}
        </button>
      </div>

      {/* Read-only Banner */}
      {isReadOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">
            👁️ Viewing {userEmail}'s prediction (read-only)
          </p>
        </div>
      )}

      {/* Lock Banner */}
      {isLocked && !isReadOnly && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            🔒 Predictions are locked since {lockInfo.cutoff}. No changes allowed.
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}

      {/* Side-by-side layout */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20%' }}>
        {/* Drivers */}
        <section style={{ width: '30%' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Drivers</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, 'drivers')}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={drivers} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {drivers.map((driver, index) => (
                  <SortableItem key={driver} id={driver} rank={index + 1} disabled={isDisabled} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        {/* Constructors */}
        <section style={{ width: '30%' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Constructors</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleDragEnd(e, 'constructors')}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={constructors} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {constructors.map((constructor, index) => (
                  <SortableItem
                    key={constructor}
                    id={constructor}
                    rank={index + 1}
                    disabled={isDisabled}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      </div>

      {/* Save Button */}
      {!isReadOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isDisabled || saving}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md font-medium"
          >
            {saving ? 'Saving...' : 'Save Prediction'}
          </button>
        </div>
      )}
    </div>
  );
}
