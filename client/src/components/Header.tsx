import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch: (query: string) => void;
  onAddClick: () => void;
}

export default function Header({ toggleSidebar, onSearch, onAddClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="bg-white border-b border-neutral-200 z-10">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
        
        <div className="flex-1 mx-2 lg:mx-4 xl:mx-0 max-w-3xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-neutral-400"></i>
            </div>
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Search candidates by name, platform, or keywords..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-white p-1.5 rounded-full text-neutral-500 hover:text-neutral-700">
            <i className="ri-notification-3-line text-xl"></i>
          </button>
          <button className="bg-white p-1.5 rounded-full text-neutral-500 hover:text-neutral-700">
            <i className="ri-question-line text-xl"></i>
          </button>
          <div className="hidden md:block">
            <Button 
              onClick={onAddClick}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <i className="ri-add-line mr-1.5"></i>
              Add Candidate
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
