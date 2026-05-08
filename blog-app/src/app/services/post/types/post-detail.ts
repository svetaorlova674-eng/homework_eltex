import { Comment } from './comment';

export interface PostDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  comments: Comment[];
}