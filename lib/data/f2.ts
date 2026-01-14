import type { OrderedLists } from '../types';

// F2 2026 Season - Driver and Team roster
export const F2_DRIVERS = [
  'Rafael Câmara - Invicta Racing',
  'Joshua Dürksen - Invicta Racing',
  'Ritomo Miyata - Hitech TGR',
  'Colton Herta - Hitech TGR',
  'Nikola Tsolov - Campos Racing',
  'Noel León - Campos Racing',
  'Dino Beganovic - DAMS Lucas Oil',
  'Roman Bilinski - DAMS Lucas Oil',
  'Gabriele Mini - MP Motorsport',
  'Oliver Goethel - MP Motorsport',
  'Sebastián Montoya - Prema Racing',
  'Mari Boya - Prema Racing',
  'Martinius Stenshornes - Rodin Motorsport',
  'Alex Dunne - Rodin Motorsport',
  'Kush Maini - ART Grand Prix',
  'Tasanapol Intranthphuvasak - ART Grand Prix',
  'Emerson Fittipaldi Jr. - AIX Racing',
  'Cian Shields - AIX Racing',
  'Nicolás Varrone - Van Amersfoort Racing',
  'TBA - Van Amersfoort Racing',
  'Laurens van Hoepen - Trident',
  'John Bennett - Trident',
] as const;

export const F2_TEAMS = [
  'Invicta Racing',
  'Hitech TGR',
  'Campos Racing',
  'DAMS Lucas Oil',
  'MP Motorsport',
  'Prema Racing',
  'Rodin Motorsport',
  'ART Grand Prix',
  'AIX Racing',
  'Van Amersfoort Racing',
  'Trident',
] as const;

export const F2_COUNTS = {
  drivers: F2_DRIVERS.length, // 22
  teams: F2_TEAMS.length, // 11
};

export const F2_ORDERED_LISTS: OrderedLists = {
  drivers: [...F2_DRIVERS],
  constructors: [...F2_TEAMS],
};
