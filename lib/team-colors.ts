// Team colors for F1 and F2 2026 seasons
export const TEAM_COLORS: Record<string, string> = {
  // F1 2026
  'Red Bull': '#0600EF',
  'Ferrari': '#DC0000',
  'Mercedes': '#00A19B',
  'McLaren': '#FF8700',
  'Aston Martin': '#006F62',
  'Alpine': '#0082FA',
  'Racing Bulls': '#6692FF',
  'Williams': '#005AFF',
  'Audi': '#00A19A',
  'Haas': '#D3D3D3',
  'Cadillac': '#555555',

  // F2 2026
  'Invicta Racing': '#FFD700',
  'Hitech TGR': '#FFFFFF',
  'Campos Racing': '#0600EF',
  'DAMS Lucas Oil': '#87CEEB',
  'MP Motorsport': '#FF8700',
  'Prema Racing': '#DC0000',
  'Rodin Motorsport': '#C0C0C0',
  'ART Grand Prix': '#00B4E6',
  'AIX Racing': '#8B4513',
  'Van Amersfoort Racing': '#333333',
  'Trident': '#0082FA',
};

export function getTeamColor(teamName: string): string {
  return TEAM_COLORS[teamName] || '#E5E7EB';
}

export function extractTeamName(driverEntry: string): string {
  // Format: "Driver Name - Team Name"
  const parts = driverEntry.split(' - ');
  return parts.length > 1 ? parts[1] : driverEntry;
}

export function getTextColor(hexColor: string): string {
  // Convert hex to RGB and calculate luminance to determine if text should be dark or light
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
