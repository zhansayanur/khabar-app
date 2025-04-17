"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
    channel: Channel;
    role?: MemberRole;
    server: Server;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
    channel,
    role,
    server,
}: ServerChannelProps) => {
    const params = useParams();
    const router = useRouter();
    const { onOpen } = useModal();
    const Icon = iconMap[channel.type];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    };
    
      const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { server, channel });
    };
    
    return (
        <button
            onClick={onClick}
            className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition mb-1",
            params?.channelId === channel.id && "bg-slate-700/20 dark:bg-slate-700")}
        >   
            <Icon className="flex-shrink-0 w-5 h-5 text-slate-500 dark:text-slate-400 " />
            <p
                className={cn(
                "line-clamp-1 font-semibold text-sm slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300 transition",
                params?.channelId === channel.id &&
                    "text-primary dark:text-slate-200 dark:group-hover:text-white"
                )}
            >
                {channel.name}
            </p>
            {channel.name !== "негізгі-арна" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Арнаны баптау">
                        <Edit
                        onClick={(e) => onAction(e, "editChannel")}
                        className="hidden group-hover:block w-4 h-4 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Арнаны жою">
                        <Trash
                        onClick={(e) => onAction(e, "deleteChannel")}
                        className="hidden group-hover:block w-4 h-4 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "негізгі-арна" && (
                <Lock className="ml-auto w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
        </button>
    )
}

export default ServerChannel;