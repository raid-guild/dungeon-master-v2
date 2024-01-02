import { useEffect, useState } from 'react';

const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<T[]>([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(items?.slice(startIndex, endIndex));
  }, [currentPage, items, itemsPerPage]);

  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return { currentItems, currentPage, setPage, totalPages };
};

export default usePagination;
