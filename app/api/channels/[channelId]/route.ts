import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }:{ params: { channelId: string}}
)   {
        try {
            const profile = await currentProfile();
            const { searchParams } = new URL(req.url)
    
            const serverId = searchParams.get("serverId")
    
    
            if (!profile) {
                return new NextResponse("Тіркелмеген", {status : 401})
            }
    
            if (!serverId) {
                return new NextResponse("Сервер ID жоқ", { status: 400 })
            }
    
            if (!params.channelId) {
                return new NextResponse("Арна ID жоқ", { status: 400})
            }

            const server = await db.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: profile.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            },
                        }
                    }
                },
                data:{
                    channels:{
                        delete:{
                            id: params.channelId,
                            name:{
                                not: "негізгі-арна",
                            }
                        }
                    }
                }
            });
            return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]",error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }:{ params: { channelId: string}}) 
    {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url)
        const { name, type } = await req.json()

        const serverId = searchParams.get("serverId")


        if (!profile) {
            return new NextResponse("Тіркелмеген", {status : 401})
        }

        if (!serverId) {
            return new NextResponse("Сервер ID жоқ", { status: 400 })
        }

        if (!params.channelId) {
            return new NextResponse("Арна ID жоқ", { status: 400})
        }

        if (name === "негізгі-арна"){
            return new NextResponse("Арна атауы 'негізгі-арна' бола алмайды ", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        },
                    }
                }
            },
            data:{
                channels: {
                    update:{
                        where:{
                            id: params.channelId,
                            NOT: {
                                name: "негізгі-арна",
                            },
                        },
                        data:{
                            name,
                            type,
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]",error);
        return new NextResponse("Internal Error", {status: 500})
    }
}