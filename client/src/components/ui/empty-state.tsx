import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  message,
  actionLabel,
  actionLink,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-neutral-200 rounded-lg text-center h-80">
      {icon || (
        <div className="w-16 h-16 mb-4 rounded-full bg-primary-50 flex items-center justify-center text-primary-700">
          <i className="ri-file-search-line text-3xl"></i>
        </div>
      )}
      <h3 className="text-lg font-medium text-neutral-900 mt-4">{message}</h3>
      <p className="text-sm text-neutral-500 mt-2 max-w-md">
        Try adjusting your search or filter to find what you're looking for.
      </p>
      {actionLabel && actionLink && (
        <Button className="mt-4" asChild>
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
