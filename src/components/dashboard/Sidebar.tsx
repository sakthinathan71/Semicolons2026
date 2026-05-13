import { LayoutDashboard, TrendingUp, Users, Settings, Bell, Zap, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: "Intelligence Hub" },
  { icon: TrendingUp, label: "Price Watch" },
  { icon: Users, label: "Social Velocity" },
  { icon: Zap, label: "Strategy AI" },
  { icon: Bell, label: "Market Alerts" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 border-r border-white/5 bg-luxury-charcoal flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-widest text-luxury-gold uppercase">
              LuxeLens AI
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse"></div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Enterprise Intel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  onClose?.();
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-left",
                  isActive 
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shadow-lg shadow-luxury-gold/5" 
                    : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold rounded-r-full" />
                )}
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0", isActive ? "text-luxury-gold" : "text-white/20 group-hover:text-white")} />
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
          <button 
            onClick={() => {
              setActiveTab("Settings");
              onClose?.();
            }}
            className={cn(
              "w-full flex items-center space-x-3 transition-all group px-4 py-3 rounded-xl text-left",
              activeTab === "Settings" 
                ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" 
                : "text-white/30 hover:text-white hover:bg-white/5"
            )}
          >
            <Settings className={cn("w-5 h-5 group-hover:rotate-45 transition-transform duration-500 shrink-0", activeTab === "Settings" ? "text-luxury-gold" : "text-white/20")} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
