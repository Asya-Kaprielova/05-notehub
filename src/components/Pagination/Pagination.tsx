import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  // Виправлення для типів імпорту react-paginate в суворих збірках Vite/TS
  const Component = (ReactPaginate as unknown as { default: typeof ReactPaginate }).default || ReactPaginate;

  return (
    <Component
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }: { selected: number }) => onPageChange(selected + 1)}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      breakClassName={css.pageItem}
    />
  );
}