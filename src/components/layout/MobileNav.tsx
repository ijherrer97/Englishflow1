import { navItems, type PageId } from './navItems';

interface MobileNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const mobileItems = navItems.filter((item) => ['dashboard', 'routine', 'skills', 'vocabulary', 'settings'].includes(item.id));

export function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`grid place-items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold transition ${
                active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200' : 'text-slate-500'
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
