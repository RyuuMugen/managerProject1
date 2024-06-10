import { Pagination } from "@elastic/eui";

export interface PaginationOptions {
  pageSizeOptions?: number[];
  initialPageIndex?: number;
  initialPageSize?: number;
  pageIndex: number;
  pageSize: number;
  totalItemCount?: number;
}

export const paginationBase: Pagination = {
  pageSizeOptions: [50, 150, 200],
  pageIndex: 0,
  pageSize: 50,
  totalItemCount: 0,
};
