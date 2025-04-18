import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string;
    }
};

const ServerIdPage = async ({
    params
}: ServerIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "негізгі-арна"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "негізгі-арна") {
        return null;
    }

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerIdPage;