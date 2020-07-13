import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/hooks";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_POST_MUTATION, POSTS_QUERY } from "../db/postGql";

const PostFrom = () => {
  const { onChange, onSubmit, values } = useForm(creatPostCallBack, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(cache, {data:{createPost}}) {
      // const data = proxy.readQuery({
      //   query: POSTS_QUERY,
      // });
      // console.log(result);
      // console.log(data);

      // data.posts = [result.data.createPost, ...data.posts];
      // proxy.writeQuery({ query: POSTS_QUERY, data });

      const { posts } = cache.readQuery({ query: POSTS_QUERY });
      
      cache.writeQuery({
        query: POSTS_QUERY,
        data: { posts: [createPost, ...posts] },
      });

      values.body = "";
    },
  });
  function creatPostCallBack() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
          <h2>Post Here</h2>
        <Form.Input
          placeholder="What's on your mind?"
          type="text"
          name="body"
          value={values.body}
          onChange={onChange}
          error= {error? true : false}
        />

        <Button type="submint" color="teal">
          Post
        </Button>
      </Form>
      {error && (
        <div className="ui error message">
          <ul>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostFrom;
