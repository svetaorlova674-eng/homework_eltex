export interface ArticleApi {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  rating: number;
  imgSrc?: string;
}

export interface ArticlesApiResponse {
  items: ArticleApi[];
  total: number;
  page: number;
  limit: number;
}