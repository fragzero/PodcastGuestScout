import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCandidateSchema, platformEnum, regionEnum, topicEnum, InsertCandidate } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Check, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface AddCandidateProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function AddCandidate({ sidebarOpen, toggleSidebar }: AddCandidateProps) {
  const queryClient = useQueryClient();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [, navigate] = useLocation();

  const form = useForm<InsertCandidate>({
    resolver: zodResolver(insertCandidateSchema),
    defaultValues: {
      name: "",
      socialHandle: "",
      platform: undefined,
      additionalPlatforms: [],
      followerCount: 0,
      region: undefined,
      topics: [],
      description: "",
      imageUrl: "",
      isRecommended: false,
      isFavorite: false,
    },
  });

  const { mutate: createCandidate, isPending } = useMutation({
    mutationFn: async (data: InsertCandidate) => {
      return apiRequest('POST', '/api/candidates', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      toast({
        title: "Candidate added",
        description: "The candidate has been added successfully.",
      });
      navigate('/candidates');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCandidate) => {
    createCandidate(data);
  };

  const handleTopicSelect = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
      form.setValue("topics", selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < 3) {
      const newTopics = [...selectedTopics, topic];
      setSelectedTopics(newTopics);
      form.setValue("topics", newTopics);
    }
  };

  const removeTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
    form.setValue("topics", selectedTopics.filter(t => t !== topic));
  };

  const formatTopicName = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          onSearch={() => {}}
          onAddClick={() => {}}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="border-b border-neutral-200 pb-5 mb-5">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                  <Link href="/candidates">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-neutral-800 font-sans sm:text-2xl sm:truncate">
                    Add New Candidate
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-500">
                    Fill in the details below to add a new podcast guest candidate.
                  </p>
                </div>
              </div>
            </div>
            
            <Card className="bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Sarah Johnson" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="socialHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Media Handle</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. @sarahjwellness" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Platform</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {platformEnum.map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="followerCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Follower Count</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="e.g. 45000" 
                                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {regionEnum.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="topics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topics (select up to 3)</FormLabel>
                          <div className="mt-1 flex flex-wrap gap-2 mb-2">
                            {selectedTopics.map((topic) => (
                              <Badge 
                                key={topic} 
                                className="bg-primary-50 text-primary-700 px-3 py-1.5"
                              >
                                {formatTopicName(topic)}
                                <button
                                  type="button"
                                  className="ml-1 hover:text-primary-900"
                                  onClick={() => removeTopic(topic)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {topicEnum.map((topic) => (
                              <Button
                                key={topic}
                                type="button"
                                variant={selectedTopics.includes(topic) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTopicSelect(topic)}
                                className="text-xs px-3 py-1.5"
                              >
                                {formatTopicName(topic)}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3} 
                              placeholder="Brief description of the candidate's suitability..."
                            />
                          </FormControl>
                          <FormDescription>
                            Briefly describe why this person would be suitable for the podcast.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <FormDescription>
                            Provide a URL to the candidate's profile image.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="isRecommended"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Mark as Recommended</FormLabel>
                              <FormDescription>
                                Highlight this candidate as a recommended guest.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isFavorite"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Add to Favorites</FormLabel>
                              <FormDescription>
                                Add this candidate to your favorites list.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-5 pb-5">
                    <Button variant="outline" type="button" asChild>
                      <Link href="/candidates">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <span className="mr-2 animate-spin">◌</span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Add Candidate
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
