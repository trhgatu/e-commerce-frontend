import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    pageIndex: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    pageIndex,
    pageCount,
    onPageChange,
}) => {
    const pages = generatePageNumbers(pageIndex, pageCount);
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => {
                            if (pageIndex > 0) onPageChange(pageIndex - 1);
                        }}
                        className={cn({
                            "pointer-events-none opacity-50 cursor-not-allowed": pageIndex === 0,
                        })}
                    />
                </PaginationItem>

                {pages.map((page, i) => (
                    <PaginationItem key={i}>
                        {page === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={pageIndex === page - 1}
                                onClick={() => onPageChange(page - 1)}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => {
                            if (pageIndex < pageCount - 1) onPageChange(pageIndex + 1);
                        }}
                        className={cn({
                            "pointer-events-none opacity-50 cursor-not-allowed": pageIndex >= pageCount - 1,
                        })}
                    />

                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

function generatePageNumbers(current: number, total: number): (number | "...")[] {
    const visibleCount = 5;
    const pages: (number | "...")[] = [];

    if (total <= visibleCount) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        const start = Math.max(1, current + 1 - 2);
        const end = Math.min(total, current + 1 + 2);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < total) {
            if (end < total - 1) pages.push("...");
            pages.push(total);
        }
    }

    return pages;
}
