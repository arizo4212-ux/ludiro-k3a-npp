import React from 'react';
import { 
  LayoutDashboard, 
  Ship, 
  Navigation, 
  Box, 
  Users, 
  Map
} from 'lucide-react';

export type ActiveTab = 'overview' | 'vessels' | 'voyages' | 'cargo' | 'crew' | 'routes';

interface AppTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  counts: {
    vessels: number;
    voyages: number;
    cargo: number;
    crew: number;
  };
}

export function AppTabs({ activeTab, onChangeTab, counts }: AppTabsProps) {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'overview',
      label: 'Ringkasan Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'vessels',
      label: 'Armada Kapal',
      icon: <Ship className="w-4 h-4" />,
      count: counts.vessels,
    },
    {
      id: 'voyages',
      label: 'Jadwal & Rute',
      icon: <Navigation className="w-4 h-4" />,
      count: counts.voyages,
    },
    {
      id: 'cargo',
      label: 'Manifest Kargo (B/L)',
      icon: <Box className="w-4 h-4" />,
      count: counts.cargo,
    },
    {
      id: 'crew',
      label: 'Awak Kapal (Kru)',
      icon: <Users className="w-4 h-4" />,
      count: counts.crew,
    },
    {
      id: 'routes',
      label: 'Peta Pelabuhan & ALKI',
      icon: <Map className="w-4 h-4" />,
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
