import React from "react";
import { Skeleton } from "antd";
import { TableRow, TableCell } from "@/components/ui/table";

interface SkeletonTableRowsProps {
  columnCount: number;
  rowCount?: number;
  thumbnailIndexes?: number[];
}

export const SkeletonTableRows: React.FC<SkeletonTableRowsProps> = ({
  columnCount,
  rowCount = 10,
  thumbnailIndexes = [],
}) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              {thumbnailIndexes.includes(colIndex) ? (
                <Skeleton.Avatar active size="large" shape="square" />
              ) : (
                <Skeleton active title={false} paragraph={{ rows: 1, width: "80%" }} />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
