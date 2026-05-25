import { gql } from 'apollo-angular';

export const GET_ARTICLE = gql`
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

export const GET_COMMENTS = gql`
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

export const VOTE_ARTICLE = gql`
  mutation VoteArticle($id: ID!, $vote: Float!) {
    voteArticle(id: $id, vote: $vote) {
      id
      avgRating
    }
  }
`;

export const VOTE_COMMENT = gql`
  mutation VoteComment($id: ID!, $vote: Float!) {
    voteComment(id: $id, vote: $vote) {
      id
      avgRating
    }
  }
`;

export const CREATE_COMMENT = gql`
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