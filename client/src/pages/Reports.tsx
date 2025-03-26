import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Candidate } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { exportToCsv } from "@/utils/candidates";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportsProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Reports({ sidebarOpen, toggleSidebar }: ReportsProps) {
  const [activeTab, setActiveTab] = useState("platforms");

  const { data: candidates, isLoading } = useQuery<{
    data: Candidate[];
    meta: { total: number };
  }>({
    queryKey: ["/api/candidates"],
  });

  // Data processing for charts
  const platformData = () => {
    if (!candidates?.data) return [];
    
    const platforms: Record<string, number> = {};
    
    candidates.data.forEach((candidate) => {
      const platform = candidate.platform;
      platforms[platform] = (platforms[platform] || 0) + 1;
    });
    
    return Object.keys(platforms).map((platform) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      count: platforms[platform],
    }));
  };
  
  const regionData = () => {
    if (!candidates?.data) return [];
    
    const regions: Record<string, number> = {};
    
    candidates.data.forEach((candidate) => {
      const region = candidate.region;
      regions[region] = (regions[region] || 0) + 1;
    });
    
    return Object.keys(regions).map((region) => ({
      name: region.toUpperCase(),
      count: regions[region],
    }));
  };
  
  const followerRangeData = () => {
    if (!candidates?.data) return [];
    
    const ranges: Record<string, number> = {
      "0-5k": 0,
      "5k-10k": 0,
      "10k-50k": 0,
      "50k-100k": 0,
      "100k+": 0,
    };
    
    candidates.data.forEach((candidate) => {
      // Determine the follower range
      let range = "0-5k";
      const followers = candidate.followerCount;
      
      if (followers > 100000) range = "100k+";
      else if (followers > 50000) range = "50k-100k";
      else if (followers > 10000) range = "10k-50k";
      else if (followers > 5000) range = "5k-10k";
      
      ranges[range] += 1;
    });
    
    return Object.keys(ranges).map((range) => ({
      name: range,
      count: ranges[range],
    }));
  };
  
  const topicsData = () => {
    if (!candidates?.data) return [];
    
    const topics: Record<string, number> = {};
    
    candidates.data.forEach((candidate) => {
      if (candidate.topics) {
        candidate.topics.forEach((topic) => {
          topics[topic] = (topics[topic] || 0) + 1;
        });
      }
    });
    
    return Object.keys(topics)
      .map((topic) => ({
        name: topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        count: topics[topic],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 topics
  };

  const handleExportData = () => {
    if (candidates?.data) {
      exportToCsv(candidates.data);
    }
  };

  return (
    <div className={`flex h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
      <div className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <Button onClick={handleExportData} disabled={isLoading || !candidates?.data?.length}>
            Export All Data
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platforms">
            <Card>
              <CardHeader>
                <CardTitle>Candidates by Platform</CardTitle>
                <CardDescription>
                  Distribution of candidates across different social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-80" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={platformData()} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle>Candidates by Region</CardTitle>
                <CardDescription>
                  Geographic distribution of podcast guest candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-80" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={regionData()} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="followers">
            <Card>
              <CardHeader>
                <CardTitle>Candidates by Follower Range</CardTitle>
                <CardDescription>
                  Breakdown of candidates by follower count ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-80" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={followerRangeData()} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Top Topics</CardTitle>
                <CardDescription>
                  Most common topics among podcast guest candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-80" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topicsData()} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Overall statistics for your candidate database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-neutral-500">Total Candidates</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : candidates?.meta?.total || 0}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-neutral-500">Platforms</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : platformData().length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-neutral-500">Regions</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : regionData().length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-neutral-500">Topics</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : Object.keys(topicsData()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}