var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

var data = require('./data.json');

var hobbyLevelType = new graphql.GraphQLEnumType({
  name: 'HobbyLevel',
  values: {
    NOVICE: { value: 0 },
    INTERMEDIATE: { value: 1 },
    EXPERT: { value: 2 }
  }
});

var hobbyType = new graphql.GraphQLObjectType({
  name: 'Hobby',
  fields: {
    name: { type: graphql.GraphQLString },
    level: { type: hobbyLevelType },
  }
});

var clientType = new graphql.GraphQLObjectType({
  name: 'Client',
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    hobbies: { type: new graphql.GraphQLList(hobbyType) },
  }
});

// Define the Query type
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getClientById: {
      type: clientType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLID) }
      },
      resolve: function (_, { id }) {
        return data.clients[id];
      }
    },
    getAllClients: {
      type: new graphql.GraphQLList(clientType),
      resolve: (_) => data.clients
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));