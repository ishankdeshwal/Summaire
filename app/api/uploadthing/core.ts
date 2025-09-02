import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { hasReachedUploadLimit } from "@/lib/user";

const f = createUploadthing();
export const OurFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
        .middleware(async ({ req }) => {
            // get user info
            const user = await currentUser();
            if (!user) throw new UploadThingError("UnAuthorized");

            // Check upload limit before allowing upload
            const { hasReachedLimit } = await hasReachedUploadLimit(user.id, user.emailAddresses[0].emailAddress);
            if (hasReachedLimit) {
                throw new UploadThingError("Upload limit reached. Please upgrade your plan to continue uploading.");
            }

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { userId: metadata.userId, file: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;


