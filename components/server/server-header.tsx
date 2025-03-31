"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    ChevronDown, 
    UserPlus,
    Settings,
    User,
    LogOut,
    PlusCircle,
    Trash
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole;
};

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 items-center flex h-12 border-neutral-200 dark:border-slate-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-slate-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:bg-slate-950 dark:text-neutral-300/90 dark:border-slate-900 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("invite", { server })}
                        className="text-orange-500 dark:text-orange-400 dark:hover:bg-orange-400/10 px-3 py-2 text-sm cursor-pointer"
                    >
                        Адамдарды Шақыру
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("editServer", { server })}
                        className="dark:hover:bg-orange-400/10 px-3 py-2 text-sm cursor-pointer"
                    >
                        Серверді Баптау
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("members", { server })}
                        className="dark:hover:bg-orange-400/10 px-3 py-2 text-sm cursor-pointer"
                    >
                        Қатысушыларды Басқару
                        <User className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("createChannel", { server })}
                        className="dark:hover:bg-orange-400/10 px-3 py-2 text-sm cursor-pointer"
                    >
                        Жаңа Арна Қосу
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator className="dark:bg-slate-800" />
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("deleteServer", { server })}
                        className="text-rose-500 dark:hover:bg-rose-500 dark:hover:text-neutral-100/90 px-3 py-2 text-sm cursor-pointer"
                    >
                        Серверді Жою
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("leaveServer", { server })}
                        className="text-rose-500 dark:hover:bg-rose-500 dark:hover:text-neutral-100/90 px-3 py-2 text-sm cursor-pointer"
                    >
                        Серверден Шығу
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}