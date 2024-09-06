export class CategoryDetailQueryParams {
  limit: number;
  page: number;
  sortBy: 'name' | 'newest' | 'price';
  sortOrder: 'asc' | 'desc';
}
