const Post = require("../../models/Post");
const { checkAuth } = require("../../utils/jwtUtils");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    //==============all post
    posts: async (parent, args, ctx, info) => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    //======================= single post
    post: async (parent, { postId }, ctx, info) => {
      try {
        const post = await Post.findById({ _id:postId });
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    //create post

    createPost: async (parent, { body }, ctx, info) => {
      const user = checkAuth(ctx);
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      ctx.pubsub.publish('NEW_POST',{
          newPost:post
      })

      return post;
    },

    //===================delete post

    deletePost: async (parent, { postId }, ctx, info) => {
      const user = checkAuth(ctx);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfuly";
        } else {
          throw new AuthenticationError("Action not alowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    //================================== like post

    likePost: async (_, { postId }, ctx, info) => {
      const { username } = checkAuth(ctx);
      const post = await Post.findById(postId);

      if (post) {
        const like = post.likes.find((c) => c.username === username);
        if (like) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post

      } else {
        throw new UserInputError("Post not found");
      }
    },
  },

  Subscription:{
      newPost:{
          subscribe:(parent, args, {pubsub}, info) =>{
            return pubsub.asyncIterator('NEW_POST')
          }
      }
  }
};
