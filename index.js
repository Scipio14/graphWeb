import express from "express";
const app = express();
import expressGraphQL, { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
const PORT = 1414;

const authors = [
  { id: 1, name: "J.K.Rowling" },
  { id: 2, name: "Jane Austen" },
  { id: 3, name: "C.J. Sansom" },
  { id: 4, name: "J.R.R. Tolkien" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Pride and Prejudice", authorId: 2 },
  { id: 4, name: "Dissolution", authorId: 3 },
  { id: 5, name: "Dark Fire", authorId: 3 },
  { id: 6, name: "Sovereign", authorId: 3 },
  { id: 7, name: "The Fellowship of the Ring", authorId: 4 },
  { id: 8, name: "The Two Towers", authorId: 4 },
];

const AuthorType = new GraphQLObjectType({
  name: "Authors",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (root, args) => {
        return books.filter((book) => book.authorId === root.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Books",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (root, args) => {
        return authors.find((author) => author.id === root.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of Authors",
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
