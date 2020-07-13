import React, { useState } from "react";
import { useMutation } from "react-apollo";
import {
  DELETE_POST_MUTATION,
  POSTS_QUERY,
  DELETE_COMMENT_MUTATION,
} from "../db/postGql";
import { Confirm, Button, Icon } from "semantic-ui-react";
import MyPopup from "./MyPopup";

const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },

    update(cache) {
      setConfirmOpen(false);

      if (!commentId) {
        const { posts } = cache.readQuery({ query: POSTS_QUERY });
        cache.writeQuery({
          query: POSTS_QUERY,
          data: { posts: posts.filter((p) => p.id !== postId) },
        });
      }

      if (callback) {
        callback();
      }
    },
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => {
          setConfirmOpen(true);
        }}
      >
        <Icon name="trash" />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;
