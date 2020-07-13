const Post = require('../../models/Post')
const { checkAuth } = require("../../utils/jwtUtils");
const {AuthenticationError, UserInputError} = require("apollo-server");

module.exports = {
    Mutation:{
        //============================== create comment
        createComment: async (parent, {postId,body},ctx,info) =>{
                const {username} = checkAuth(ctx)

                if (body.trim() === '') {
                    throw new UserInputError('Empty comment',{
                        errors:{
                            body:'Comment body must not empty'
                        }
                    })
                }

                const post = await Post.findById(postId)

                if (post) {
                    
                    post.comments.unshift({
                        body,
                        username,
                        createdAt: new Date().toISOString(),
                    })
                    await post.save()
                    return post
                }else{
                    throw new UserInputError('Post not found')
                }
        },

        //================================= delete comment

        deleteComment: async(_,{postId, commentId},ctx,info) =>{
            const {username} = checkAuth(ctx)
            const post = await Post.findById(postId)

            if (post) {
                
                const commentIndex =  post.comments.findIndex(c => c.id === commentId)

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex,1)
                    await post.save()
                    return post
                }else{
                    throw new AuthenticationError('Action not allowed!')
                }
            }else{
                throw new UserInputError('Post not found')
            }


        }
    }
}