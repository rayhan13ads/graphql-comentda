import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LIKE_MUTATION, POSTS_QUERY} from "../db/postGql";
import { Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import MyPopup from "./MyPopup";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_MUTATION, {
    variables: { postId: id },
    update(cache, data){
      
      console.log(data);
      
      const { posts } = cache.readQuery({ query: POSTS_QUERY });
      console.log(posts);
      
      // cache.writeQuery({
      //   query: POSTS_QUERY,
      //   data: data.likePost,
      // });

    }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <MyPopup content={liked ? 'Unlike' :'Like'}>

      {likeButton}
      </MyPopup>
      <Label as="a" basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};



export default LikeButton;
