import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { PostDetail } from './types/post-detail';
import { IPostService } from './post-service.interface';
import { Comment } from './types/comment';
import {
  GET_ARTICLE,
  GET_COMMENTS,
  VOTE_ARTICLE,
  VOTE_COMMENT,
  CREATE_COMMENT
} from './post-graphql.queries';

interface ArticleGql {
  id: string;
  title: string;
  content: string;
  imgSrc: string | null;
  avgRating: number | null;
}

interface CommentGql {
  id: string;
  username: string;
  content: string;
  avgRating: number | null;
  createdAt: string;
}

interface GetArticleQuery {
  article: ArticleGql;
}

interface GetCommentsQuery {
  commentsByArticle: CommentGql[];
}

interface VoteArticleQuery {
  voteArticle: { id: string; avgRating: number };
}

interface VoteCommentQuery {
  voteComment: { id: string; avgRating: number };
}

interface CreateCommentQuery {
  createComment: CommentGql;
}

@Injectable()
export class PostGraphqlService implements IPostService {
  private apollo = inject(Apollo);

  getPost(id: string): Observable<PostDetail> {
    return forkJoin({
      article: this.apollo.query<GetArticleQuery>({
        query: GET_ARTICLE,
        variables: { id }
      }),
      comments: this.apollo.query<GetCommentsQuery>({
        query: GET_COMMENTS,
        variables: { articleId: id }
      })
    }).pipe(
      map(({ article, comments }) => {
        const a = article.data!.article;
        const c = comments.data!.commentsByArticle;
        return {
          id: String(a.id),
          title: a.title,
          description: a.content,
          image: a.imgSrc ?? 'images/paris.png',
          rating: Math.round(a.avgRating ?? 0),
          comments: c.map(comment => ({
            id: String(comment.id),
            author: comment.username,
            text: comment.content,
            rating: Math.round(comment.avgRating ?? 0),
            date: new Date(comment.createdAt).toLocaleDateString()
          }))
        };
      })
    );
  }

  updatePostRating(postId: string, rating: number): Observable<PostDetail> {
    return this.apollo.mutate<VoteArticleQuery>({
      mutation: VOTE_ARTICLE,
      variables: { id: postId, vote: rating }
    }).pipe(
      map(result => {
        const a = result.data!.voteArticle;
        return { id: String(a.id), rating: Math.round(a.avgRating ?? 0) } as unknown as PostDetail;
      })
    );
  }

  updateCommentRating(postId: string, commentId: string, rating: number): Observable<PostDetail> {
    return this.apollo.mutate<VoteCommentQuery>({
      mutation: VOTE_COMMENT,
      variables: { id: commentId, vote: rating }
    }).pipe(
      map(result => {
        const c = result.data!.voteComment;
        return { id: String(c.id), rating: Math.round(c.avgRating ?? 0) } as unknown as PostDetail;
      })
    );
  }

  addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail> {
    return this.apollo.mutate<CreateCommentQuery>({
      mutation: CREATE_COMMENT,
      variables: {
        articleId: postId,
        username: comment.author,
        content: comment.text
      }
    }).pipe(
      map(result => {
        const c = result.data!.createComment;
        return {
          id: String(c.id),
          author: c.username,
          text: c.content,
          rating: Math.round(c.avgRating ?? 0),
          date: new Date(c.createdAt).toLocaleDateString()
        } as unknown as PostDetail;
      })
    );
  }
}