import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Candidate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CandidateCardProps {
  candidate: Candidate;
  onView: (candidate: Candidate) => void;
}

export default function CandidateCard({ candidate, onView }: CandidateCardProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/candidates/${candidate.id}/toggle-favorite`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      toast({
        title: candidate.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${candidate.name} has been ${candidate.isFavorite ? "removed from" : "added to"} your favorites list.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Platform badge color mapping
  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case "tiktok": return "bg-primary-100 text-primary-800";
      case "instagram": return "bg-accent-500 text-white";
      case "youtube": return "bg-red-100 text-red-800";
      case "podcast": return "bg-purple-100 text-purple-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  // Format follower count
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-neutral-200">
      <div className="relative">
        {/* Randomize placeholder image from Unsplash */}
        <div className="w-full h-48 bg-neutral-200 flex items-center justify-center">
          {candidate.imageUrl ? (
            <img 
              src={candidate.imageUrl} 
              alt={candidate.name} 
              className="w-full h-48 object-cover object-center" 
            />
          ) : (
            <i className="ri-user-3-line text-5xl text-neutral-400"></i>
          )}
        </div>
        
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformBadgeColor(candidate.platform)}`}>
            {candidate.platform.charAt(0).toUpperCase() + candidate.platform.slice(1)}
          </span>
        </div>
        
        {candidate.isRecommended && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Recommended
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 font-sans">{candidate.name}</h3>
            <p className="text-sm text-neutral-500">{candidate.socialHandle}</p>
          </div>
          <div className="flex space-x-1">
            {candidate.platform === 'instagram' && (
              <a href="#" className="text-neutral-400 hover:text-neutral-600">
                <i className="ri-instagram-line text-lg"></i>
              </a>
            )}
            {candidate.platform === 'tiktok' && (
              <a href="#" className="text-neutral-400 hover:text-neutral-600">
                <i className="ri-tiktok-line text-lg"></i>
              </a>
            )}
            {candidate.platform === 'youtube' && (
              <a href="#" className="text-neutral-400 hover:text-neutral-600">
                <i className="ri-youtube-line text-lg"></i>
              </a>
            )}
            {candidate.platform === 'podcast' && (
              <a href="#" className="text-neutral-400 hover:text-neutral-600">
                <i className="ri-spotify-line text-lg"></i>
              </a>
            )}
            
            {/* Show additional platforms if available */}
            {candidate.additionalPlatforms && candidate.additionalPlatforms.map((platform, idx) => (
              <a key={idx} href="#" className="text-neutral-400 hover:text-neutral-600">
                <i className={`ri-${platform === 'instagram' ? 'instagram' : platform === 'tiktok' ? 'tiktok' : platform === 'youtube' ? 'youtube' : 'spotify'}-line text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-2 flex items-center text-sm">
          <i className="ri-user-follow-line text-secondary-500 mr-1"></i>
          <span className="font-medium">{formatFollowerCount(candidate.followerCount)}</span>
          <span className="text-neutral-500 ml-1">followers</span>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-neutral-600 line-clamp-3">{candidate.description}</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {candidate.topics && candidate.topics.map((topic, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-50 text-secondary-700">
              {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            className="inline-flex items-center text-sm px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 bg-white hover:bg-neutral-50"
            onClick={() => onView(candidate)}
          >
            <i className="ri-eye-line mr-1.5"></i>
            View
          </Button>
          <Button 
            variant="outline" 
            className={`inline-flex items-center text-sm px-3 py-1.5 border border-neutral-300 rounded ${
              candidate.isFavorite 
                ? "text-primary-700 bg-primary-50 hover:bg-primary-100" 
                : "text-neutral-700 bg-white hover:bg-neutral-50"
            }`}
            onClick={() => toggleFavorite()}
            disabled={isPending}
          >
            {candidate.isFavorite ? (
              <>
                <i className="ri-star-fill mr-1.5"></i>
                Favorited
              </>
            ) : (
              <>
                <i className="ri-star-line mr-1.5"></i>
                Favorite
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
