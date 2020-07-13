import React from 'react'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'
import App from './App'



const AuthLink = setContext(()=>{
    const token = localStorage.getItem('jwtToken')

    return {
        headers:{
            Authorization: token? `Bearer ${token}`: ''
        }
    }
})

const httpLink = createHttpLink({
    uri:'http://localhost:5000/'
});

const client = new ApolloClient({
    link: AuthLink.concat(httpLink),
    cache: new InMemoryCache()
});



export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
);
