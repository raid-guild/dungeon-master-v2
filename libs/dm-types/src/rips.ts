export type ripSortKeys =
  | 'oldestComment'
  | 'recentComment'
  | 'name'
  | 'createDate';
// | 'startDate'
// | 'endDate'
// | 'recentlyUpdated';

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
