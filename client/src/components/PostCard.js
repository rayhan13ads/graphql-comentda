import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "./MyPopup";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const {
    id,
    body,
    username,
    createdAt,
    comments,
    likes,
    commentCount,
    likeCount,
  } = post;

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://images.unsplash.com/photo-1528900403525-dc523d4f18d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
          <LikeButton post={{ id, likes, likeCount }} user={user} />
        <MyPopup content="Comment Here">
          <Button as="div" labelPosition="right">
            <Button color="blue" basic as={Link} to={`/posts/${id}`}>
              <Icon name="comment" />
            </Button>
            <Label as="a" basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.object,
};

export default PostCard;
