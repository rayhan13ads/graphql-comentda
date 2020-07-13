const POST_RESOLVER = require('./posts')
const USER_RESOLVER = require('./users')
const COMMENT_RESOLVER = require('./comment')


module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
      },
    Query:{
        ...POST_RESOLVER.Query
    },
    Mutation:{
        ...USER_RESOLVER.Mutation,
        ...POST_RESOLVER.Mutation,
        ...COMMENT_RESOLVER.Mutation 
    },

    Subscription:{
        ...POST_RESOLVER.Subscription
    }
}