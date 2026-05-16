import { Comment } from './comment';

export interface PostDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  comments: Comment[];
}