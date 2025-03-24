import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Candidate, FilterCandidate } from "@shared/schema";
import AddCandidateDialog from "@/components/AddCandidateDialog";
import CandidateGrid from "@/components/CandidateGrid";
import { Link } from "wouter";
import { ChevronRight, Star, Users, BarChart2, Repeat } from "lucide-react";

interface DashboardProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Dashboard({ sidebarOpen, toggleSidebar }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['/api/candidates'],
    select: (data: any) => data as { data: Candidate[], meta: { total: number, page: number, limit: number, totalPages: number } },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Calculate stats
  const totalCandidates = candidatesData?.meta?.total || 0;
  const favoriteCandidates = candidatesData?.data?.filter(c => c.isFavorite)?.length || 0;
  const recommendedCandidates = candidatesData?.data?.filter(c => c.isRecommended)?.length || 0;
  
  // Get top platforms
  const platformCounts: Record<string, number> = {};
  candidatesData?.data?.forEach(candidate => {
    platformCounts[candidate.platform] = (platformCounts[candidate.platform] || 0) + 1;
  });
  
  const topPlatforms = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([platform, count]) => ({ platform, count }));

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
                    Dashboard
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-500">
                    Manage and discover potential guests for your personal development podcast
                  </p>
                </div>
                
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                  <Button variant="outline" asChild>
                    <Link href="/candidates">
                      View All Candidates
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                  <Users className="h-4 w-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCandidates}</div>
                  <p className="text-xs text-neutral-500">
                    Potential podcast guests
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                  <Star className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favoriteCandidates}</div>
                  <p className="text-xs text-neutral-500">
                    Saved for follow-up
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recommended</CardTitle>
                  <BarChart2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recommendedCandidates}</div>
                  <p className="text-xs text-neutral-500">
                    High priority candidates
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                  <Repeat className="h-4 w-4 text-primary-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {topPlatforms[0]?.platform || "N/A"}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {topPlatforms[0]?.count || 0} candidates
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Additions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Recent Additions</h3>
              <CandidateGrid 
                candidates={candidatesData?.data?.slice(0, 4) || []} 
                isLoading={isLoading} 
              />
              {candidatesData?.data?.length > 4 && (
                <div className="mt-5 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/candidates">View All Candidates</Link>
                  </Button>
                </div>
              )}
            </div>
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
