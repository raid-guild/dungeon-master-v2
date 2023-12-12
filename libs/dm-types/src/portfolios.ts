export type IPortfolioUpdate = {
  portfolio_id?: string;
  portfolio: {
    raid_id?: string;
    id?: string;
    name: string;
    repo_link: string;
    result_link: string;
    image_url: string;
    description: string;
    approach: {
      content: string[];
    };
    challenge: {
      content: string[];
    };
    result: {
      content: string[];
    };
    slug: string;
    category: string;
  };
};
