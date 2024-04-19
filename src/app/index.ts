import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from "body-parser";
import { prismaClient } from "../clients/db";
import { User } from "./user";
import cors from 'cors'

const app = express();
app.use(cors());
app.use(bodyParser.json())

const graphqlServer = new ApolloServer({

    typeDefs: `
    ${User.types}
       type Query {
        ${User.queries}
       }
    `,
    resolvers: {
        Query: {
            ...User.resolvers.queries,
        },
    },
});

export async function initServer() {
    await graphqlServer.start(); //Extra i Added this
    app.use('/graphql', expressMiddleware(graphqlServer));
    return app;
}

