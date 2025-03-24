import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterCandidate, platformEnum, regionEnum, topicEnum } from "@shared/schema";
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: FilterCandidate) => void;
  currentFilters: FilterCandidate;
}

export default function FilterBar({ onFilterChange, currentFilters }: FilterBarProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handlePlatformChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      platform: value as any,
    });
  };

  const handleFollowerRangeChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      followerRange: value as any,
    });
  };

  const handleRegionChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      region: value as any,
    });
  };

  const handleTopicChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      topic: value as any,
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...currentFilters,
      sort: value as any,
    });
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative inline-block">
            <Select value={currentFilters.platform || ""} onValueChange={handlePlatformChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Platforms</SelectItem>
                {platformEnum.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative inline-block">
            <Select value={currentFilters.followerRange || ""} onValueChange={handleFollowerRangeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Followers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Followers</SelectItem>
                <SelectItem value="0-5k">0-5K</SelectItem>
                <SelectItem value="5k-10k">5K-10K</SelectItem>
                <SelectItem value="10k-50k">10K-50K</SelectItem>
                <SelectItem value="50k-100k">50K-100K</SelectItem>
                <SelectItem value="100k+">100K+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative inline-block">
            <Select value={currentFilters.region || ""} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {regionEnum.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative inline-block">
            <Select value={currentFilters.topic || ""} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Topics</SelectItem>
                {topicEnum.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          <div className="relative inline-block">
            <Select value={currentFilters.sort || "followers-desc"} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Followers (High to Low)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers-desc">Followers (High to Low)</SelectItem>
                <SelectItem value="followers-asc">Followers (Low to High)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="date-added">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex border border-neutral-300 rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${viewMode === 'list' ? 'bg-white text-neutral-500' : 'bg-neutral-100 text-primary-500'}`}
              onClick={() => toggleViewMode('grid')}
            >
              <i className="ri-layout-grid-line"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${viewMode === 'grid' ? 'bg-white text-neutral-500' : 'bg-neutral-100 text-primary-500'}`}
              onClick={() => toggleViewMode('list')}
            >
              <i className="ri-list-check-2"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
