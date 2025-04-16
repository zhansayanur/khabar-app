"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
};

export const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server,
  }: ServerSectionProps) => {
    const { onOpen } = useModal();
  
    return (
      <div className="flex justify-between items-center py-2">
        <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Арна қосу" side="top">
            <button
              onClick={() => onOpen("createChannel", { channelType })} 
              className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Қатысушыларды басқару" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      </div>
    );
  };