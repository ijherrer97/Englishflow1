import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gauge,
  Goal,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routine', label: 'Routine', icon: ClipboardList },
  { id: 'skills', label: 'Skills', icon: Gauge },
  { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
  { id: 'goals', label: 'Goals', icon: Goal },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export type PageId = (typeof navItems)[number]['id'];
