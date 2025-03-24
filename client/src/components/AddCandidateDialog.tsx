import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
import { X } from "lucide-react";

interface AddCandidateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCandidateDialog({ isOpen, onClose }: AddCandidateDialogProps) {
  const queryClient = useQueryClient();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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
      form.reset();
      setSelectedTopics([]);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary-100">
              <i className="ri-user-add-line text-primary-600 text-xl"></i>
            </div>
            <div>
              <DialogTitle className="text-lg">Add New Candidate</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new podcast guest candidate.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Platform</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value as string || ""}
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
                      defaultValue={field.value as string || ""}
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
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Candidate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
