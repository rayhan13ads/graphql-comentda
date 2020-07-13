const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require('mongoose');
require("dotenv").config({ path: ".env" });

const Post = require('./models/Post')
const User = require('./models/User')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const pubsub = new PubSub();

const server = new ApolloServer({
  // cors:{
  //   origin:(origin, callback) =>{
  //     const whitelist = [
  //       "http://localhost:5000",
  //       "http://localhost:3000",
  //   ];

  //   if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true)
  //   } else {
  //       callback(new Error("Not allowed by CORS"))
  //   }
  //   },
  //   credentials: true
  // },
  cors:{
    origin:true,
    allowedHeaders: ['Authorization', 'Content-Type', 'apollographql-client-name']
  },
  typeDefs,
  resolvers,
  context:({req}) => ({req, pubsub})
});

mongoose.connect(process.env.MONGO_PATH, { useNewUrlParser:true})
.then(()=>{
    console.log('Mongodb connented!!');
    
    return server.listen({port:process.env.PORT})
})
.then((res) => console.log(`Server running at ${res.url}`));



// origin: "*",
//       methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//       preflightContinue: false,
//       optionsSuccessStatus: 204,
//       credentials: true