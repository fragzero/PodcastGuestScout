import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FilterBar from "@/components/FilterBar";
import CandidateGrid from "@/components/CandidateGrid";
import Pagination from "@/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Candidate, FilterCandidate } from "@shared/schema";
import AddCandidateDialog from "@/components/AddCandidateDialog";
import { FileDown, Plus } from "lucide-react";

interface CandidatesProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Candidates({ sidebarOpen, toggleSidebar }: CandidatesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filters, setFilters] = useState<FilterCandidate>({
    platform: "",
    followerRange: "",
    region: "",
    topic: "",
    search: "",
    sort: "followers-desc",
  });

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['/api/candidates', 
      filters.platform, 
      filters.followerRange, 
      filters.region, 
      filters.topic, 
      filters.search, 
      filters.sort,
      currentPage,
      itemsPerPage
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.followerRange) params.append('followerRange', filters.followerRange);
      if (filters.region) params.append('region', filters.region);
      if (filters.topic) params.append('topic', filters.topic);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      return await response.json();
    },
  });

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: FilterCandidate) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportCsv = () => {
    const exportData = candidatesData?.data || [];
    if (exportData.length === 0) return;
    
    const csvHeader = "Name,Social Handle,Platform,Follower Count,Region,Topics,Description,Is Recommended,Is Favorite\n";
    const csvRows = exportData.map((candidate: Candidate) => {
      const row = [
        candidate.name,
        candidate.socialHandle,
        candidate.platform,
        candidate.followerCount,
        candidate.region,
        candidate.topics.join(';'),
        `"${candidate.description.replace(/"/g, '""')}"`,
        candidate.isRecommended,
        candidate.isFavorite
      ];
      return row.join(',');
    });
    
    const csvContent = `${csvHeader}${csvRows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'podcast-candidates.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          onSearch={handleSearch}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="border-b border-neutral-200 pb-5 mb-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-neutral-800 font-sans sm:text-3xl sm:truncate">
                    Podcast Guest Candidates
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-500">
                    Manage and discover potential guests for your personal development podcast
                  </p>
                </div>
                
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                  <Button variant="outline" onClick={handleExportCsv}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Filter Bar */}
            <FilterBar 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
            
            {/* Candidate Grid */}
            <CandidateGrid 
              candidates={candidatesData?.data || []} 
              isLoading={isLoading} 
            />
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={candidatesData?.meta?.totalPages || 0}
              totalItems={candidatesData?.meta?.total || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
      
      <AddCandidateDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
    </div>
  );
}
