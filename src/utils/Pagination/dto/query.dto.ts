import { ApiQueryOptions } from '@nestjs/swagger';

export type IPaginationQuery = {
  search: string;
  limit: number;
  page: number;
  sort: string;
  show_paranoid: boolean;
  trash: boolean;
};

// Query

export const SearchQuery: ApiQueryOptions = {
  name: 'search',
  type: 'string',
  required: false,
};

export const LimitQuery: ApiQueryOptions = {
  name: 'limit',
  type: 'number',
  required: false,
};

export const PageQuery: ApiQueryOptions = {
  name: 'page',
  type: 'number',
  required: false,
};

export const SortQuery: ApiQueryOptions = {
  name: 'sort',
  type: 'string',
  required: false,
};

export const ShowParanoidQuery: ApiQueryOptions = {
  name: 'show_paranoid',
  type: 'boolean',
  required: false,
};

export const TrashQuery: ApiQueryOptions = {
  name: 'trash',
  type: 'boolean',
  required: false,
};
