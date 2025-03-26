import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/Sidebar";
import { Candidate, platformEnum, regionEnum, topicEnum } from "@shared/schema";

interface FiltersProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface SavedFilter {
  id: string;
  name: string;
  criteria: {
    platforms: string[];
    regions: string[];
    topics: string[];
    followerRange: string[];
    favorite: boolean;
    recommended: boolean;
  };
  active: boolean;
}

export default function Filters({ sidebarOpen, toggleSidebar }: FiltersProps) {
  const [activeTab, setActiveTab] = useState("saved");
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  
  // Sample saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "High Engagement Creators",
      criteria: {
        platforms: ["tiktok", "instagram"],
        regions: ["us", "ca"],
        topics: ["personal-development", "mindfulness"],
        followerRange: ["50k-100k", "100k+"],
        favorite: false,
        recommended: true
      },
      active: true
    },
    {
      id: "2",
      name: "Wellness Experts",
      criteria: {
        platforms: ["podcast", "youtube"],
        regions: ["us", "uk", "au"],
        topics: ["wellness", "mindfulness", "self-worth"],
        followerRange: ["10k-50k", "50k-100k"],
        favorite: true,
        recommended: false
      },
      active: true
    },
    {
      id: "3",
      name: "Relationship Coaches",
      criteria: {
        platforms: ["instagram", "podcast"],
        regions: ["us"],
        topics: ["relationships", "dating", "emotional-intelligence"],
        followerRange: ["5k-10k", "10k-50k"],
        favorite: false,
        recommended: false
      },
      active: false
    }
  ]);
  
  const [filterForm, setFilterForm] = useState<{
    name: string;
    platforms: string[];
    regions: string[];
    topics: string[];
    followerRange: string[];
    favorite: boolean;
    recommended: boolean;
  }>({
    name: "",
    platforms: [],
    regions: [],
    topics: [],
    followerRange: [],
    favorite: false,
    recommended: false
  });

  const { data: candidates, isLoading } = useQuery<{
    data: Candidate[];
    meta: { total: number };
  }>({
    queryKey: ["/api/candidates"],
  });
  
  // Select a filter for editing
  const selectFilter = (id: string) => {
    const filter = savedFilters.find(f => f.id === id);
    if (filter) {
      setSelectedFilterId(id);
      setFilterForm({
        name: filter.name,
        platforms: filter.criteria.platforms,
        regions: filter.criteria.regions,
        topics: filter.criteria.topics,
        followerRange: filter.criteria.followerRange,
        favorite: filter.criteria.favorite,
        recommended: filter.criteria.recommended
      });
      setActiveTab("create");
    }
  };
  
  // Toggle active state of a filter
  const toggleFilterActive = (id: string) => {
    setSavedFilters(prev => 
      prev.map(filter => 
        filter.id === id ? { ...filter, active: !filter.active } : filter
      )
    );
  };
  
  // Delete a filter
  const deleteFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
    
    toast({
      title: "Filter deleted",
      description: "The filter has been removed.",
    });
  };
  
  // Save/Update filter
  const saveFilter = () => {
    if (!filterForm.name.trim()) {
      toast({
        title: "Filter name required",
        description: "Please provide a name for your filter.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFilterId) {
      // Update existing filter
      setSavedFilters(prev => 
        prev.map(filter => 
          filter.id === selectedFilterId ? {
            ...filter,
            name: filterForm.name,
            criteria: {
              platforms: filterForm.platforms,
              regions: filterForm.regions,
              topics: filterForm.topics,
              followerRange: filterForm.followerRange,
              favorite: filterForm.favorite,
              recommended: filterForm.recommended
            }
          } : filter
        )
      );
      
      toast({
        title: "Filter updated",
        description: "Your filter has been updated successfully.",
      });
    } else {
      // Create new filter
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name: filterForm.name,
        criteria: {
          platforms: filterForm.platforms,
          regions: filterForm.regions,
          topics: filterForm.topics,
          followerRange: filterForm.followerRange,
          favorite: filterForm.favorite,
          recommended: filterForm.recommended
        },
        active: true
      };
      
      setSavedFilters(prev => [...prev, newFilter]);
      
      toast({
        title: "Filter created",
        description: "Your new filter has been created successfully.",
      });
    }
    
    // Reset form and go back to saved filters
    resetForm();
    setActiveTab("saved");
  };
  
  // Reset form
  const resetForm = () => {
    setFilterForm({
      name: "",
      platforms: [],
      regions: [],
      topics: [],
      followerRange: [],
      favorite: false,
      recommended: false
    });
    setSelectedFilterId(null);
  };
  
  // Toggle array values
  const toggleArrayValue = (array: string[], value: string): string[] => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };
  
  // Helper for rendering filter criteria badge
  const renderFilterCriteriaBadge = (count: number, label: string) => {
    if (count === 0) return null;
    return (
      <Badge variant="outline" className="mr-2 mb-2">
        {count} {label}{count !== 1 ? 's' : ''}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 overflow-auto p-8 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Filter Management</h1>
          {activeTab === "saved" ? (
            <Button onClick={() => { resetForm(); setActiveTab("create"); }}>
              Create New Filter
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { setActiveTab("saved"); resetForm(); }}>
              Back to Saved Filters
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="saved">Saved Filters</TabsTrigger>
            <TabsTrigger value="create">Create/Edit Filter</TabsTrigger>
          </TabsList>
          
          {/* Saved Filters Tab */}
          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedFilters.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p className="text-neutral-500">You don't have any saved filters yet.</p>
                    <Button 
                      onClick={() => setActiveTab("create")} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Create Your First Filter
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                savedFilters.map(filter => (
                  <Card key={filter.id} className={`${!filter.active ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{filter.name}</span>
                        <Switch
                          checked={filter.active}
                          onCheckedChange={() => toggleFilterActive(filter.id)}
                        />
                      </CardTitle>
                      <CardDescription>
                        {isLoading ? (
                          <Skeleton className="h-4 w-32" />
                        ) : (
                          `${calculateFilterMatches(filter, candidates?.data || [])} matches`
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap mb-4">
                        {renderFilterCriteriaBadge(filter.criteria.platforms.length, 'Platform')}
                        {renderFilterCriteriaBadge(filter.criteria.regions.length, 'Region')}
                        {renderFilterCriteriaBadge(filter.criteria.topics.length, 'Topic')}
                        {renderFilterCriteriaBadge(filter.criteria.followerRange.length, 'Follower Range')}
                        {filter.criteria.favorite && <Badge variant="secondary" className="mr-2 mb-2">Favorites</Badge>}
                        {filter.criteria.recommended && <Badge variant="secondary" className="mr-2 mb-2">Recommended</Badge>}
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => selectFilter(filter.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteFilter(filter.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Create/Edit Filter Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>{selectedFilterId ? 'Edit Filter' : 'Create New Filter'}</CardTitle>
                <CardDescription>
                  {selectedFilterId 
                    ? 'Update your filter criteria to refine your candidate search.' 
                    : 'Define filter criteria to quickly find relevant podcast guest candidates.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="filter-name">Filter Name</Label>
                    <Input 
                      id="filter-name" 
                      placeholder="e.g., High Engagement Creators" 
                      className="mt-1"
                      value={filterForm.name}
                      onChange={e => setFilterForm({...filterForm, name: e.target.value})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Platforms</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {platformEnum.map(platform => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`platform-${platform}`} 
                            checked={filterForm.platforms.includes(platform)}
                            onCheckedChange={() => {
                              setFilterForm({
                                ...filterForm, 
                                platforms: toggleArrayValue(filterForm.platforms, platform)
                              });
                            }}
                          />
                          <Label htmlFor={`platform-${platform}`}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Regions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {regionEnum.map(region => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`region-${region}`} 
                            checked={filterForm.regions.includes(region)}
                            onCheckedChange={() => {
                              setFilterForm({
                                ...filterForm, 
                                regions: toggleArrayValue(filterForm.regions, region)
                              });
                            }}
                          />
                          <Label htmlFor={`region-${region}`}>
                            {region.toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Follower Ranges</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {["0-5k", "5k-10k", "10k-50k", "50k-100k", "100k+"].map(range => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`range-${range}`} 
                            checked={filterForm.followerRange.includes(range)}
                            onCheckedChange={() => {
                              setFilterForm({
                                ...filterForm, 
                                followerRange: toggleArrayValue(filterForm.followerRange, range)
                              });
                            }}
                          />
                          <Label htmlFor={`range-${range}`}>{range}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Topics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {topicEnum.map(topic => (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`topic-${topic}`} 
                            checked={filterForm.topics.includes(topic)}
                            onCheckedChange={() => {
                              setFilterForm({
                                ...filterForm, 
                                topics: toggleArrayValue(filterForm.topics, topic)
                              });
                            }}
                          />
                          <Label htmlFor={`topic-${topic}`}>
                            {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Special Filters</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="favorite" 
                        checked={filterForm.favorite}
                        onCheckedChange={checked => {
                          setFilterForm({...filterForm, favorite: checked === true});
                        }}
                      />
                      <Label htmlFor="favorite">Only Favorites</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recommended" 
                        checked={filterForm.recommended}
                        onCheckedChange={checked => {
                          setFilterForm({...filterForm, recommended: checked === true});
                        }}
                      />
                      <Label htmlFor="recommended">Only Recommended</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6">
                    <Button variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button onClick={saveFilter}>
                      {selectedFilterId ? 'Update Filter' : 'Save Filter'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper function to calculate matching candidates count
function calculateFilterMatches(filter: SavedFilter, candidates: Candidate[]): number {
  if (!candidates.length) return 0;
  
  return candidates.filter(candidate => {
    // Platform check
    if (filter.criteria.platforms.length > 0 && 
        !filter.criteria.platforms.includes(candidate.platform)) {
      return false;
    }
    
    // Region check
    if (filter.criteria.regions.length > 0 && 
        !filter.criteria.regions.includes(candidate.region)) {
      return false;
    }
    
    // Topics check
    if (filter.criteria.topics.length > 0 && 
        candidate.topics && 
        !candidate.topics.some(topic => filter.criteria.topics.includes(topic))) {
      return false;
    }
    
    // Follower range check
    if (filter.criteria.followerRange.length > 0) {
      const followerCount = candidate.followerCount;
      let inRange = false;
      
      filter.criteria.followerRange.forEach(range => {
        if (range === "0-5k" && followerCount <= 5000) inRange = true;
        else if (range === "5k-10k" && followerCount > 5000 && followerCount <= 10000) inRange = true;
        else if (range === "10k-50k" && followerCount > 10000 && followerCount <= 50000) inRange = true;
        else if (range === "50k-100k" && followerCount > 50000 && followerCount <= 100000) inRange = true;
        else if (range === "100k+" && followerCount > 100000) inRange = true;
      });
      
      if (!inRange) return false;
    }
    
    // Favorite check
    if (filter.criteria.favorite && !candidate.isFavorite) {
      return false;
    }
    
    // Recommended check
    if (filter.criteria.recommended && !candidate.isRecommended) {
      return false;
    }
    
    return true;
  }).length;
}