export interface WsArticleRatingPayload {
  articleId: string;
  rating: number;
  prevRating: number;
}

export interface WsCommentRatingPayload {
  commentId: string;
  articleId: string;
  rating: number;
  prevRating: number;
}

export interface WsCommentCreatedPayload {
  commentId: string;
  articleId: string;
  content: string;
  username: string;
  createdAt: Date;
}

export type WsPayload = WsArticleRatingPayload | WsCommentRatingPayload | WsCommentCreatedPayload;

export interface WsMessage {
  type: 'ARTICLE_RATING_CHANGED' | 'COMMENT_RATING_CHANGED' | 'COMMENT_CREATED';
  payload: WsPayload;
}