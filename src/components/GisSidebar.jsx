import {
  FileText,
  Map,
  Upload,
  FileBarChart,
  Settings,
  Search,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "portal", label: "Portal", icon: Globe },
  { id: "form", label: "Form", icon: FileText, action: "form" },
  { id: "map-details", label: "Map Details", icon: Map },
  { id: "file-upload", label: "File Upload", icon: Upload },
  { id: "report", label: "Report", icon: FileBarChart },
];

const bottomItems = [
  { id: "search", label: "Search", icon: Search },
  { id: "settings", label: "Settings", icon: Settings },
];

export function GisSidebar({ collapsed, onToggle, activeItem, onItemClick, onFormClick }) {
  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#0F172A] border-r border-[#1E293B] shadow-sidebar transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-[#1E293B]">
        <Globe className="h-6 w-6 text-[#4C9AFF] shrink-0" strokeWidth={2} />
        {!collapsed && (
          <span className="ml-3 text-[11px] font-semibold text-[#B6C2CF] tracking-widest uppercase">
            PWD AAP
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action === "form") {
                onFormClick?.();
              } else {
                onItemClick(item.id);
              }
            }}
            className={cn(
              "flex items-center w-full rounded-[3px] px-3 py-2.5 text-sm transition-colors",
              activeItem === item.id
                ? "bg-[#1E293B] text-[#4C9AFF]"
                : "text-[#B6C2CF] hover:bg-[#1E293B] hover:text-[#B6C2CF]"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="py-4 px-2 space-y-0.5 border-t border-[#1E293B]">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "flex items-center w-full rounded-[3px] px-3 py-2.5 text-sm transition-colors",
              activeItem === item.id
                ? "bg-[#1E293B] text-[#4C9AFF]"
                : "text-[#B6C2CF] hover:bg-[#1E293B] hover:text-[#B6C2CF]"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-[#1E293B] text-[#B6C2CF] hover:text-[#4C9AFF] transition-colors rounded-[3px]"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" strokeWidth={2} /> : <ChevronLeft className="h-4 w-4" strokeWidth={2} />}
      </button>
    </aside>
  );
}
