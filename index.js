var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    clients: [Client]
  }
  type Client {
    name: String,
    age: Int,
    hobbies: [Hobby]
  }
  type Hobby {
    name: String,
    level: HobbyLevel 
  }
  enum HobbyLevel {
    NOVICE,
    INTERMEDIATE,
    EXPERT
  }
`);

var root = {
  clients: [
    {
      name: 'Hector',
      age: 22,
      hobbies: [
        {
          name: 'Videogames',
          level: 'INTERMEDIATE'
        }
      ]
    },
    {
      name: 'Susana',
      age: 26,
      hobbies: [
        {
          name: 'Football',
          level: 'INTERMEDIATE'
        }
      ]
    },
    {
      name: 'Andy',
      age: 32,
      hobbies: [
        {
          name: 'Reading',
          level: 'EXPERT'
        }
      ]
    }
  ]
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));