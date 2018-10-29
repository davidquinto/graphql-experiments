var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    getHuman(id: ID!): Client,
    clients: [Client]
  }
  type Client {
    id: ID!,
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

var fakeDatabase = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

var root = {
  getHuman: function({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error('no human exists with id ' + id);
    }
    return fakeDatabase[id]
  },
  clients: fakeDatabase
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));