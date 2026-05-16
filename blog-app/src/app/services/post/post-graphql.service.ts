import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { PostDetail } from './types/post-detail';
import { IPostService } from './post-service.interface';
import { Comment } from './types/comment';

const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      imgSrc
      avgRating
    }
  }
`;

const GET_COMMENTS = gql`
  query GetComments($articleId: ID!) {
    commentsByArticle(articleId: $articleId) {
      id
      username
      content
      avgRating
      createdAt
    }
  }
`;

const VOTE_ARTICLE = gql`
  mutation VoteArticle($id: ID!, $vote: Float!) {
    voteArticle(id: $id, vote: $vote) {
      id
      avgRating
    }
  }
`;

const VOTE_COMMENT = gql`
  mutation VoteComment($id: ID!, $vote: Float!) {
    voteComment(id: $id, vote: $vote) {
      id
      avgRating
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($articleId: String!, $username: String!, $content: String!) {
    createComment(createComment: { articleId: $articleId, username: $username, content: $content }) {
      id
      username
      content
      avgRating
      createdAt
    }
  }
`;

@Injectable()
export class PostGraphqlService implements IPostService {
  private apollo = inject(Apollo);

  getPost(id: string): Observable<PostDetail> {
    return forkJoin({
      article: this.apollo.query<any>({
        query: GET_ARTICLE,
        variables: { id }
      }),
      comments: this.apollo.query<any>({
        query: GET_COMMENTS,
        variables: { articleId: id }
      })
    }).pipe(
      map(({ article, comments }) => {
        const a = article.data.article;
        const c = comments.data.commentsByArticle;
        return {
          id: String(a.id),
          title: a.title,
          description: a.content,
          image: a.imgSrc ?? 'images/post.jpg',
          rating: Math.round(a.avgRating ?? 0),
          comments: c.map((comment: any) => ({
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
    return this.apollo.mutate<any>({
      mutation: VOTE_ARTICLE,
      variables: { id: postId, vote: rating }
    }).pipe(
      map(result => {
        const a = result.data.voteArticle;
        return { id: String(a.id), rating: Math.round(a.avgRating ?? 0) } as unknown as PostDetail;
      })
    );
  }

  updateCommentRating(postId: string, commentId: string, rating: number): Observable<PostDetail> {
    return this.apollo.mutate<any>({
      mutation: VOTE_COMMENT,
      variables: { id: commentId, vote: rating }
    }).pipe(
      map(result => {
        const c = result.data.voteComment;
        return { id: String(c.id), rating: Math.round(c.avgRating ?? 0) } as unknown as PostDetail;
      })
    );
  }

  addComment(postId: string, comment: Omit<Comment, 'id' | 'date'>): Observable<PostDetail> {
    return this.apollo.mutate<any>({
      mutation: CREATE_COMMENT,
      variables: {
        articleId: postId,
        username: comment.author,
        content: comment.text
      }
    }).pipe(
      map(result => {
        const c = result.data.createComment;
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