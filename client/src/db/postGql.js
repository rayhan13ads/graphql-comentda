import gql from "graphql-tag";

export const POSTS_QUERY = gql`
  {
    posts {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      commentCount
      likeCount
    }
  }
`;

export const POST_QUERY = gql`
  query($postId: ID!) {
    post(postId: $postId) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      commentCount
      likeCount
    }
  }
`;

export const LIKE_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export const SUBMIT_COMMENT_MUTATION =gql`
  mutation($postId:ID!, $body:String!){
    createComment(postId:$postId, body:$body){
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
    
  }


`;
