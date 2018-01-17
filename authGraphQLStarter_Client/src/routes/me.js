import React from 'react';
import {graphql} from 'react-apollo';
import {Container, Dimmer, Loader} from 'semantic-ui-react';
import queries from '../queries';


export default graphql(queries.query.me)(
  ({data:{loading,me}}) => {

    return <Container text>
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>
      <h3>My info</h3>
      {
        !loading && (
          <span>username: {me.username}</span>
        )
      }
    </Container>
  }
)
