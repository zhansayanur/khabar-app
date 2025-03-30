import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    ) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if (!profile){
            return new NextResponse("Тіркелмеген", {status: 401})
        }

        if (!serverId){
            return new NextResponse("Сервер ID жоқ", {status: 400})
        }

        if (name === "негізгі-арна"){
            return new NextResponse("Арна атауы 'негізгі-арна' бола алмайды", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in:[MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                }
            },
            data:{
                channels: {
                    create:{
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        })

        return NextResponse.json(server);
        
    } catch (error) {
        console.log("[CHANNELS_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
    
}