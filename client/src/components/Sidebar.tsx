import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/candidates", label: "Candidates", icon: "ri-user-search-line" },
    { path: "/add", label: "Add New", icon: "ri-add-line" },
    { path: "/filters", label: "Filters", icon: "ri-filter-3-line" },
    { path: "/reports", label: "Reports", icon: "ri-file-chart-line" },
    { path: "/settings", label: "Settings", icon: "ri-settings-4-line" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  // Mobile sidebar backdrop
  if (isOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
        <SidebarContent isActive={isActive} navItems={navItems} className="fixed left-0 top-0 z-30 md:hidden" />
      </>
    );
  }

  // Desktop sidebar
  return (
    <SidebarContent isActive={isActive} navItems={navItems} className="hidden md:flex" />
  );
}

interface SidebarContentProps {
  isActive: (path: string) => boolean;
  navItems: Array<{ path: string; label: string; icon: string }>;
  className?: string;
}

function SidebarContent({ isActive, navItems, className }: SidebarContentProps) {
  return (
    <aside className={cn("md:flex-col w-64 bg-white border-r border-neutral-200 h-full", className)}>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
            <i className="ri-mic-fill text-white text-xl"></i>
          </div>
          <h1 className="ml-3 text-xl font-semibold text-neutral-800 font-sans sm:text-xl sm:truncate">
            GuestFinder
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-2 space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  <i className={cn(item.icon, "mr-3 text-lg")}></i>
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium text-sm">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-700">John Doe</p>
            <p className="text-xs text-neutral-500">Researcher</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
