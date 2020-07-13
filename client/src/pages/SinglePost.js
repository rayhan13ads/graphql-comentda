import React, { useContext, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { POST_QUERY, SUBMIT_COMMENT_MUTATION } from "../db/postGql";
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment, { updateLocale } from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import MyPopup from "../components/MyPopup";

const SinglePost = (props) => {
  const postId = props.match.params.postId;

  const [comment, setComment] = useState("");
  console.log(postId);
  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: {
      postId,
      body: comment,
    },
    update() {
      setComment("");
      inputRef.current.blur();
    },
  });

  const deletePostCallback = () => {
    props.history.push("/");
  };

  return (
    <div>
      <Query query={POST_QUERY} variables={{ postId: postId }}>
        {({ data, loading, error }) => {
          let postMarkup;

          console.log(data);
          if (error) {
            return <p>Error{error.message}</p>;
          }

          if (!data) {
            return <p>loading....</p>;
          } else {
            const {
              id,
              body,
              username,
              createdAt,
              comments,
              likes,
              commentCount,
              likeCount,
            } = data.post;

            postMarkup = (
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Image
                      src="https://images.unsplash.com/photo-1528900403525-dc523d4f18d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                      size="small"
                      floated="right"
                    />
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Card fluid>
                      <Card.Content>
                        <Card.Header>{username}</Card.Header>
                        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                        <Card.Description>{body}</Card.Description>
                      </Card.Content>
                      <hr />
                      <Card.Content extra>
                        <LikeButton
                          post={{ id, likes, likeCount }}
                          user={user}
                        />
                        <MyPopup content="Comment in below">
                          <Button as="div" labelPosition="right">
                            <Button
                              color="blue"
                              basic
                              as={Link}
                              to={`/posts/${id}`}
                            >
                              <Icon name="comment" />
                            </Button>
                            <Label as="a" basic color="blue" pointing="left">
                              {commentCount}
                            </Label>
                          </Button>
                        </MyPopup>

                        {user && user.username === username && (
                          <DeleteButton
                            postId={id}
                            callback={deletePostCallback}
                          />
                        )}
                      </Card.Content>
                    </Card>
                    {user && (
                      <Card fluid>
                        <Card.Content>
                          <p>Post a comment</p>
                          <Form>
                            <div className="ui action input fluid">
                              <input
                                type="text"
                                placeholder="Comment..."
                                name="comment"
                                value={comment}
                                onChange={(event) =>
                                  setComment(event.target.value)
                                }
                                ref={inputRef}
                              />
                              <Button
                                type="submit"
                                className="ui button teal"
                                disabled={comment.trim() === ""}
                                onClick={submitComment}
                              >
                                Submit
                              </Button>
                            </div>
                          </Form>
                        </Card.Content>
                      </Card>
                    )}
                    {comments.map((comment) => (
                      <Card fluid key={comment.id}>
                        <Card.Content>
                          {user && user.username === comment.username && (
                            <DeleteButton postId={id} commentId={comment.id} />
                          )}
                          <Card.Header>{comment.username}</Card.Header>
                          <Card.Meta>
                            {moment(comment.createdAt).fromNow(true)}
                          </Card.Meta>
                          <Card.Description>{comment.body}</Card.Description>
                        </Card.Content>
                      </Card>
                    ))}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            );
          }

          return postMarkup;
        }}
      </Query>
    </div>
  );
};

export default SinglePost;
