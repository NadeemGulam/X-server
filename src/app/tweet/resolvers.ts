import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import TweetService, { CreateTweetPayload } from "../../services/tweet";
import UserService from "../../services/user";


const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
})

const queries = {
    getAllTweets: () => TweetService.getAllTweets(),
    getSignedURLForTweet: async (parent: any, { imageType, imageName }: { imageType: string, imageName: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) {
            throw new Error("You are Not Unthenticated")
        }

        // const allowedImageType = ["jpeg", 'jpg', "png", "webp"];
        const allowedImageType = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!allowedImageType.includes(imageType)) {
            throw new Error("Unsupported Image Type")
        }

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `upload/${ctx.user.id}/tweets/${imageName}-${Date.now()}.${imageType}`
        })

        const signedURl = await getSignedUrl(s3Client, putObjectCommand);

        return signedURl;
    }
}

const mutations = {
    createTweet: async (parent: any, { payload }: {
        payload: CreateTweetPayload
    }, ctx: GraphqlContext) => {
        if (!ctx.user) throw new Error(" Your are not Authenticated !!");

        const tweet = await TweetService.createTweet({
            ...payload,
            userId: ctx.user.id
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

// const extraResolver = {
//     Tweet: {
//         author: (parent: Tweet) => {
//              return UserService.getUserById(parent.authorId)
//         }
//     }
// }

export const resolvers = { mutations, extraResolver, queries }