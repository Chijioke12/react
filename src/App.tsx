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
    <div className="kai-app-container">
      {/* Header */}
      <div className="kai-header">
        <Smartphone size={14} style={{ marginRight: '8px' }} />
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
                  <div className="kai-list-item-left">
                    <Icon size={16} />
                    <span className="kai-list-item-label">{item.label}</span>
                  </div>
                  {isSelected && <ChevronRight size={16} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="kai-view-container">
            <div className="kai-view-content">
              <h2 className="kai-view-title">{MENU_ITEMS[selectedIndex].label}</h2>
              <p className="kai-view-text">
                This is the {MENU_ITEMS[selectedIndex].label.toLowerCase()} view.
                Optimized for KaiOS 2.5.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Softkey Bar */}
      <div className="kai-softkey-bar">
        <div className="kai-softkey-left">
          {view === 'menu' ? '' : 'Back'}
        </div>
        <div className="kai-softkey-center">
          {view === 'menu' ? 'Select' : ''}
        </div>
        <div className="kai-softkey-right">
          Options
        </div>
      </div>
    </div>
  );
}
