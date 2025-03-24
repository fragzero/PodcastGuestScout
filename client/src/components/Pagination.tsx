import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Create array of page numbers to display
  const generatePageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust when near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Add first page
      if (startPage > 1) {
        range.push(1);
        if (startPage > 2) {
          range.push('...');
        }
      }
      
      // Add main pages
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          range.push('...');
        }
        range.push(totalPages);
      }
    }
    
    return range;
  };

  const pageNumbers = generatePageRange();

  return (
    <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-700">
            Showing <span className="font-medium">{totalItems > 0 ? startItem : 0}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> candidates
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {pageNumbers.map((page, index) => (
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage 
                      ? "bg-primary-50 text-primary-600 border-primary-100"
                      : "bg-white text-neutral-500 border-neutral-300 hover:bg-neutral-50"
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span 
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500"
                >
                  {page}
                </span>
              )
            ))}
            
            <Button
              variant="outline"
              size="sm"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={handleNextPage}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
