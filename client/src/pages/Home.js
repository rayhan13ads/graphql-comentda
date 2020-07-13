import React, { useContext } from "react";
//import { useQuery } from "@apollo/react-hooks";
import { Grid, TransitionGroup, Transition } from "semantic-ui-react";
import { Query } from 'react-apollo'
import PostCard from "../components/PostCard";
import { POSTS_QUERY } from "../db/postGql";
import { AuthContext } from "../context/auth";
import PostFrom from "../components/PostFrom";

const Home = () => {

  

  const { user } = useContext(AuthContext);
  //const { loading, data, error } = useQuery(POSTS_QUERY);

  

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostFrom />
          </Grid.Column>
        )}
      <Query query={POSTS_QUERY}>
        {
          ({data,loading, error})=>{

            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (<Transition.Group>
              {data.posts &&
                data.posts.map((post) => (
                  <Grid.Column key={post.id} style={mbrStyle}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>)
          }
        }
      </Query>
        
      </Grid.Row>
    </Grid>
  );
};

const mbrStyle = {
  marginBottom: 20,
};

export default Home;
