import type { OrderedLists } from '../types';

// Placeholder 22-driver roster and 11 constructors; replace when real-season data is available.
export const DEFAULT_DRIVERS = [
  'Alexander Albon - Williams',
  'Fernando Alonso - Aston Martin',
  'Kimi Antonelli - Mercedes',
  'Oliver Bearman - Haas',
  'Gabriel Bortoleto - Audi',
  'Valtteri Bottas - Cadillac',
  'Franco Colapinto - Alpine',
  'Pierre Gasly - Alpine',
  'Isack Hadjar - Red Bull',
  'Lewis Hamilton - Ferrari',
  'Nico Hulkenberg - Audi',
  'Liam Lawson - Racing Bulls',
  'Charles Leclerc - Ferrari',
  'Arvid Lindblad - Racing Bulls',
  'Lando Norris - McLaren',
  'Esteban Ocon - Haas',
  'Oscar Piastri - McLaren',
  'Sergio Perez - Cadillac',
  'George Russell - Mercedes',
  'Carlos Sainz - Williams',
  'Lance Stroll - Aston Martin',
  'Max Verstappen - Red Bull',
] as const;



export const DEFAULT_CONSTRUCTORS = [
  'Red Bull',
  'Ferrari',
  'Mercedes',
  'McLaren',
  'Aston Martin',
  'Alpine',
  'Racing Bulls',
  'Williams',
  'Audi',
  'Haas',
  'Cadillac',
] as const;

export const DEFAULT_COUNTS = {
  drivers: DEFAULT_DRIVERS.length, // 22
  constructors: DEFAULT_CONSTRUCTORS.length, // 11
};

export const DEFAULT_ORDERED_LISTS: OrderedLists = {
  drivers: [...DEFAULT_DRIVERS],
  constructors: [...DEFAULT_CONSTRUCTORS],
};
