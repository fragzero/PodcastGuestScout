import { Candidate, FilterCandidate } from "@shared/schema";

// Helper function to format follower count (e.g. 1000 -> 1K, 1000000 -> 1M)
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

// Helper function to format topic name (e.g. personal-development -> Personal Development)
export function formatTopicName(topic: string): string {
  return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Helper function to export candidates to CSV
export function exportToCsv(candidates: Candidate[]): void {
  if (candidates.length === 0) return;
  
  const csvHeader = "Name,Social Handle,Platform,Follower Count,Region,Topics,Description,Is Recommended,Is Favorite\n";
  const csvRows = candidates.map(candidate => {
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
}

// Function to get platform badge color
export function getPlatformColor(platform: string): string {
  switch (platform) {
    case "tiktok": return "bg-primary-100 text-primary-800";
    case "instagram": return "bg-accent-500 text-white";
    case "youtube": return "bg-red-100 text-red-800";
    case "podcast": return "bg-purple-100 text-purple-800";
    default: return "bg-neutral-100 text-neutral-800";
  }
}

// Function to get platform icon
export function getPlatformIcon(platform: string): string {
  switch (platform) {
    case "tiktok": return "ri-tiktok-line";
    case "instagram": return "ri-instagram-line";
    case "youtube": return "ri-youtube-line";
    case "podcast": return "ri-spotify-line";
    default: return "ri-global-line";
  }
}
