import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from "body-parser";
import { prismaClient } from "../clients/db";
import { User } from "./user";
import { Tweet } from "./tweet";
import cors from 'cors'
import { GraphqlContext, JWTUser } from "../interfaces";
import JWTService from "../services/jwt";



const app = express();
app.use(cors());
app.use(bodyParser.json())

const graphqlServer = new ApolloServer<GraphqlContext>({

    typeDefs: `
    ${User.types}
    ${Tweet.types}
       type Query {
        ${User.queries}
        ${Tweet.queries}
       }


       type Mutation {
        ${Tweet.muatation}
       }
    `,
    resolvers: {
        Query: {
            ...User.resolvers.queries,
            ...Tweet.resolvers.queries,
        },
        Mutation: {
            ...Tweet.resolvers.mutations,
        },
        ...Tweet.resolvers.extraResolver,
        ...User.resolvers.extraResolvers,
    },
    introspection: true,
});

export async function initServer() {
    await graphqlServer.start(); //Extra i Added this
    app.use('/graphql', expressMiddleware(graphqlServer, {
        context: async ({ req, res }) => {
            return {
                user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1]) : undefined
            }
        }
    }));
    return app;
}

