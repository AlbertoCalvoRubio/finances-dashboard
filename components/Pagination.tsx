"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

interface PaginationProps {
  currentPage: number;
  transactionsPerPage: number;
  totalTransactions: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  transactionsPerPage,
  totalTransactions,
}) => {
  const searchParams = useSearchParams();
  const buildQueryParams = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());

    return `?${newParams.toString()}`;
  };

  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="mt-4 flex items-center justify-center space-x-4">
      <Link
        scroll={false}
        href={isFirstPage ? "#" : buildQueryParams(currentPage - 1)}
        aria-disabled={isFirstPage}
        className={`rounded px-4 py-2 ${
          isFirstPage
            ? "pointer-events-none cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-blue-500 text-white hover:bg-blue-700"
        }`}
      >
        Previous
      </Link>
      <span className="mx-2">
        Page {currentPage} / {totalPages}
      </span>
      <span className="mx-2">Total: {totalTransactions}</span>
      <Link
        scroll={false}
        href={isLastPage ? "#" : buildQueryParams(currentPage + 1)}
        aria-disabled={isLastPage}
        className={`rounded px-4 py-2 ${
          isLastPage
            ? "pointer-events-none cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-blue-500 text-white hover:bg-blue-700"
        }`}
      >
        Next
      </Link>
    </div>
  );
};

export default Pagination;
