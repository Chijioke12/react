import { useState, useEffect } from 'react';
import { Smartphone, Home, Settings, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="h-screen w-full bg-[#E4E3E0] text-[#141414] font-sans overflow-hidden flex flex-col">
      {/* Status Bar Mockup */}
      <div className="h-6 bg-[#141414] text-white flex items-center justify-between px-2 text-[10px] uppercase tracking-wider">
        <span>KaiOS</span>
        <span>15:02</span>
      </div>

      {/* Header */}
      <div className="bg-[#F27D26] p-3 shadow-md">
        <h1 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <Smartphone size={16} />
          {view === 'menu' ? 'Main Menu' : MENU_ITEMS[selectedIndex].label}
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {view === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-1"
            >
              {MENU_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#141414] text-white scale-[1.02] shadow-lg'
                        : 'bg-white/50 text-[#141414]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isSelected ? 'text-[#F27D26]' : 'text-[#141414]'} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {isSelected && <ChevronRight size={16} className="text-[#F27D26]" />}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-xl shadow-sm h-full"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-[#F27D26]/10 rounded-full flex items-center justify-center mx-auto">
                  {(() => {
                    const Icon = MENU_ITEMS[selectedIndex].icon;
                    return <Icon size={24} className="text-[#F27D26]" />;
                  })()}
                </div>
                <h2 className="text-lg font-bold">{MENU_ITEMS[selectedIndex].label}</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This is the {MENU_ITEMS[selectedIndex].label.toLowerCase()} view of your KaiOS application. 
                  Optimized for legacy browsers and feature phone hardware.
                </p>
                <div className="pt-4">
                  <div className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">System Info</div>
                  <div className="text-xs font-mono mt-1">Vite 5 + Legacy Plugin</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Softkey Bar */}
      <div className="h-10 bg-[#141414] text-white flex items-center justify-around text-[10px] font-bold uppercase tracking-tighter border-t border-white/10">
        <div className="w-1/3 text-center opacity-70">
          {view === 'menu' ? '' : 'Back'}
        </div>
        <div className="w-1/3 text-center text-[#F27D26]">
          {view === 'menu' ? 'Select' : ''}
        </div>
        <div className="w-1/3 text-center opacity-70">
          Options
        </div>
      </div>
    </div>
  );
}
