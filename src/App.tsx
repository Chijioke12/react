import { useState, useEffect } from 'react';
import { Smartphone, Home, Settings, Info, ChevronRight } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState('menu');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'menu') {
        if (e.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
        } else if (e.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
        } else if (e.key === 'Enter') {
          setView(MENU_ITEMS[selectedIndex].id);
        }
      } else {
        if (e.key === 'SoftLeft' || e.key === 'Backspace') {
          setView('menu');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, view]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="kai-header">
        <Smartphone size={14} className="mr-2" />
        <span>{view === 'menu' ? 'Main Menu' : MENU_ITEMS[selectedIndex].label}</span>
      </div>

      {/* Content Area */}
      <div className="kai-content">
        {view === 'menu' ? (
          <div>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`kai-list-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  {isSelected && <ChevronRight size={16} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow-sm h-full">
            <div className="text-center space-y-4">
              <h2 className="text-lg font-bold">{MENU_ITEMS[selectedIndex].label}</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                This is the {MENU_ITEMS[selectedIndex].label.toLowerCase()} view.
                Optimized for KaiOS 2.5.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Softkey Bar */}
      <div className="kai-softkey-bar">
        <div className="text-left opacity-80">
          {view === 'menu' ? '' : 'Back'}
        </div>
        <div className="text-center text-[#F27D26]">
          {view === 'menu' ? 'Select' : ''}
        </div>
        <div className="text-right opacity-80">
          Options
        </div>
      </div>
    </div>
  );
}
