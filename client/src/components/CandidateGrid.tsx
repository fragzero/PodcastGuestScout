import { Candidate } from "@shared/schema";
import CandidateCard from "./CandidateCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "./ui/empty-state";

interface CandidateGridProps {
  candidates: Candidate[];
  isLoading: boolean;
}

export default function CandidateGrid({ candidates, isLoading }: CandidateGridProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDialog = () => {
    setSelectedCandidate(null);
  };

  // Format follower count with comma separators
  const formatFollowerCount = (count: number) => {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="animate-pulse">
              <div className="w-full h-48 bg-neutral-200"></div>
              <div className="p-4">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-neutral-200 rounded w-20"></div>
                  <div className="h-6 bg-neutral-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-8 bg-neutral-200 rounded w-24"></div>
                  <div className="h-8 bg-neutral-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <EmptyState 
        message="No candidates found" 
        actionLabel="Add New Candidate"
        actionLink="/add"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onView={handleViewCandidate} 
          />
        ))}
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog open={selectedCandidate !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">{selectedCandidate.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-neutral-600">{selectedCandidate.socialHandle}</span>
                    <span className="text-neutral-400">•</span>
                    <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                      {selectedCandidate.platform.charAt(0).toUpperCase() + selectedCandidate.platform.slice(1)}
                    </Badge>
                    <span className="text-neutral-400">•</span>
                    <span className="text-secondary-600 font-medium">{formatFollowerCount(selectedCandidate.followerCount)} followers</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <div className="w-full aspect-square bg-neutral-200 rounded-md flex items-center justify-center">
                    {selectedCandidate.imageUrl ? (
                      <img 
                        src={selectedCandidate.imageUrl} 
                        alt={selectedCandidate.name} 
                        className="w-full h-full object-cover object-center rounded-md" 
                      />
                    ) : (
                      <i className="ri-user-3-line text-6xl text-neutral-400"></i>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Region</h4>
                      <p className="text-neutral-800">{selectedCandidate.region.toUpperCase()}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Added</h4>
                      <p className="text-neutral-800">
                        {formatDistanceToNow(new Date(selectedCandidate.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">Social Platforms</h4>
                      <div className="flex gap-2 mt-1">
                        <a href="#" className="text-neutral-600 hover:text-primary-600">
                          <i className={`ri-${selectedCandidate.platform === 'instagram' ? 'instagram' : selectedCandidate.platform === 'tiktok' ? 'tiktok' : selectedCandidate.platform === 'youtube' ? 'youtube' : 'spotify'}-line text-xl`}></i>
                        </a>
                        {selectedCandidate.additionalPlatforms && selectedCandidate.additionalPlatforms.map((platform, idx) => (
                          <a key={idx} href="#" className="text-neutral-600 hover:text-primary-600">
                            <i className={`ri-${platform === 'instagram' ? 'instagram' : platform === 'tiktok' ? 'tiktok' : platform === 'youtube' ? 'youtube' : 'spotify'}-line text-xl`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div>
                    <h3 className="text-md font-medium text-neutral-800">About</h3>
                    <p className="mt-2 text-neutral-600 whitespace-pre-line">
                      {selectedCandidate.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-md font-medium text-neutral-800">Topics</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCandidate.topics.map((topic, idx) => (
                        <Badge key={idx} className="bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-secondary-100">
                          {topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedCandidate.isRecommended && (
                    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-start">
                        <i className="ri-thumb-up-line text-green-600 mt-0.5 mr-2"></i>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Recommended Candidate</h4>
                          <p className="text-sm text-green-700">
                            This candidate has been recommended based on their content quality and audience engagement.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between gap-2">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <i className="ri-pencil-line mr-1.5"></i>
                    Edit
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <i className="ri-delete-bin-line mr-1.5"></i>
                    Delete
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className={selectedCandidate.isFavorite ? "text-primary-700 bg-primary-50" : ""}>
                    <i className={`${selectedCandidate.isFavorite ? "ri-star-fill" : "ri-star-line"} mr-1.5`}></i>
                    {selectedCandidate.isFavorite ? "Favorited" : "Favorite"}
                  </Button>
                  <Button>
                    <i className="ri-mail-line mr-1.5"></i>
                    Contact
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
