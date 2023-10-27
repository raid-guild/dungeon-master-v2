export type ripSortKeys =
  | 'status'
  | 'oldestComment'
  | 'recentComment'
  | 'name'
  | 'createdDate';

export interface IRip {
  number: number;
  title: string;
  url: string;

  // TIMELINE - ISO STRINGS
  createdAt: string;

  author: { login: string };
  comments: {
    totalCount: number;
    nodes: [bodyText: string, createdAt: string, author: { login: string }];
  };
  ripCategory: string;
}
