import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { 
    Hash, 
    Mic, 
    ShieldAlert, 
    ShieldCheck, 
    Video } from "lucide-react";
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" />,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="mr-2 h-4 w-4 text-teal-500" />
    ),
};

export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id); 

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-slate-800 bg-[#F2F3F5]">
            <ServerHeader 
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch 
                     data={[
                        {
                          label: "Мәтін арналар",
                          type: "channel",
                          data: textChannels?.map((channel) => ({
                            icon: iconMap[channel.type],
                            name: channel.name,
                            id: channel.id,
                          })),
                        },
                        {
                          label: "Аудио арналар",
                          type: "channel",
                          data: audioChannels?.map((channel) => ({
                            icon: iconMap[channel.type],
                            name: channel.name,
                            id: channel.id,
                          })),
                        },
                        {
                          label: "Бейне арналар",
                          type: "channel",
                          data: videoChannels?.map((channel) => ({
                            icon: iconMap[channel.type],
                            name: channel.name,
                            id: channel.id,
                          })),
                        },
                        {
                          label: "Members",
                          type: "member",
                          data: members?.map((member) => ({
                            icon: roleIconMap[member.role],
                            name: member.profile.name,
                            id: member.id,
                          })),
                        },
                      ]}
                    />
                </div>
                <Separator className="bg-slate-200 dark:bg-slate-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Мәтін арна"
                    /> 
                    <div className="space-y-[2px]">
                    {textChannels.map((channel) => (
                        <ServerChannel
                        key={channel.id}
                        channel={channel}
                        role={role}
                        server={server}
                    />
                    ))}
                    </div>
                </div>
                )}
                
                {!!audioChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label="Аудио арна"
                    />
                    <div className="space-y-[2px]">
                    {audioChannels.map((channel) => (
                        <ServerChannel
                        key={channel.id}
                        channel={channel}
                        role={role}
                        server={server}
                    />
                    ))}
                    </div>
                </div>
                )}

                {!!videoChannels?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label="Бейне арна"
                    />
                    <div className="space-y-[2px]">
                    {videoChannels.map((channel) => (
                        <ServerChannel
                        key={channel.id}
                        channel={channel}
                        role={role}
                        server={server}
                    />
                    ))}
                    </div>
                </div>
                )}

                {!!members?.length && (
                    <div className="mb-2 ">
                        <ServerSection
                        sectionType="members"
                        role={role}
                        label="Қатысушылар"
                        server={server}
                    />
                    <div className="space-y-[2px]">
                    {members.map((member) => (
                        <ServerMember 
                        key={member.id} 
                        member={member} 
                        server={server}
                        />
                    ))}
                    </div>
                </div>
                )}
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar;