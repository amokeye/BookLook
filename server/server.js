// Dependencies
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

// Imports
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

// App and PORT set-up
const app = express();
const PORT = process.env.PORT || 3001;

// Integrate middleware into server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
