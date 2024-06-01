import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateTweetPayload {
    content: string
    imageURL?: string
}

const queries = {
    getAllTweets: () => prismaClient.tweet.findMany({ orderBy: { createdAt: 'desc' } })
}

const mutations = {
    createTweet: async (parent: any, { payload }: {
        payload: CreateTweetPayload
    }, ctx: GraphqlContext) => {
        if (!ctx.user) throw new Error(" Your are not Authenticated !!");

        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: {
                    connect: {
                        id: ctx.user.id
                    }
                }
            }
        })
        return tweet;
    }
}

const extraResolver = {
    Tweet: {
        author: (parent: Tweet) => {
            return prismaClient.user.findUnique({ where: { id: parent.authorId } })
        }
    }
}

export const resolvers = { mutations, extraResolver , queries}