import React from 'react';
import { 
  Crosshair, 
  Minus, 
  Type, 
  Smile, 
  Ruler, 
  Search, 
  Magnet, 
  Pencil, 
  Lock, 
  Eye, 
  Trash2,
  Settings,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';

const DemoTools = () => {
  const tools = [
    { icon: Crosshair, active: true },
    { icon: Minus, label: 'Trend Line' },
    { icon: MoreHorizontal, label: 'Fibonacci' },
    { icon: Pencil, label: 'Brush' },
    { icon: Type, label: 'Text' },
    { icon: Smile, label: 'Icons' },
    { icon: Ruler, label: 'Measure' },
    { icon: Search, label: 'Zoom' },
    { icon: Magnet, label: 'Magnet' },
    { icon: Lock, label: 'Lock' },
    { icon: Eye, label: 'Hide' },
    { icon: Trash2, label: 'Remove' },
  ];

  return (
    <div className="flex flex-col w-9 bg-bg-base border-r border-border-dim py-2 gap-1 items-center z-20 overflow-hidden hidden lg:flex">
      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-elevated transition-colors mb-1 text-text-muted hover:text-text-primary">
        <MoreHorizontal size={16} />
      </button>
      
      {tools.map((tool, index) => (
        <div key={index} className="relative group">
          <button 
            className={`w-7 h-7 flex items-center justify-center rounded transition-all ${
              tool.active 
                ? 'bg-accent/20 text-accent shadow-sm' 
                : 'text-text-muted/60 hover:bg-bg-elevated hover:text-text-secondary'
            }`}
          >
            <tool.icon size={16} />
            {index < 3 && (
                <ChevronRight size={8} className="absolute right-0 bottom-0.5 opacity-40" />
            )}
          </button>
          
          {tool.label && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-bg-surface border border-border-dim rounded text-[10px] text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
              {tool.label}
            </div>
          )}
        </div>
      ))}

      <div className="mt-auto pt-2 border-t border-border-dim/50 flex flex-col gap-1 items-center">
         <button className="w-7 h-7 flex items-center justify-center rounded text-text-muted/60 hover:bg-bg-elevated hover:text-text-secondary transition-all">
            <Settings size={16} />
         </button>
      </div>
    </div>
  );
};

export default DemoTools;
