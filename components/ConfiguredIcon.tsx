import React from 'react';
import {
  Coffee,
  Croissant,
  Folder,
  GraduationCap,
  History,
  Hotel,
  ListChecks,
  MapPinCheck,
  Pyramid,
  ShieldCheck,
  Soup,
  Store,
  Utensils,
  UtensilsCrossed,
  type LucideIcon
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  coffee: Coffee,
  croissant: Croissant,
  folder: Folder,
  'graduation-cap': GraduationCap,
  history: History,
  hotel: Hotel,
  'list-checks': ListChecks,
  'map-pin-check': MapPinCheck,
  pyramid: Pyramid,
  'shield-check': ShieldCheck,
  soup: Soup,
  store: Store,
  utensils: Utensils,
  'utensils-crossed': UtensilsCrossed
};

export const supportedIconNames = Object.freeze(Object.keys(icons));

export const normalizeIconName = (value?: string | null) => {
  const raw = (value || '').trim();
  if (!raw) return null;
  return raw
    .replace(/^Lucide/i, '')
    .replace(/Icon$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

export const resolveIconName = (value?: string | null) => {
  const normalized = normalizeIconName(value);
  return normalized && icons[normalized] ? normalized : null;
};

const safeImageUrl = (value: string) =>
  value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://');

const ConfiguredIcon: React.FC<{
  value?: string | null;
  className?: string;
  alt?: string;
}> = ({ value, className = 'w-6 h-6', alt = '' }) => {
  const trimmed = (value || '').trim();
  if (trimmed && safeImageUrl(trimmed)) {
    return <img src={trimmed} alt={alt} className={`${className} object-contain`} />;
  }

  const name = resolveIconName(trimmed) || 'folder';
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
};

export default ConfiguredIcon;
