"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Member, MemberRole, Profile } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
      profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-teal-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-orange-500" />,
};
  
  const roleColorMap = {
    GUEST: "text-slate-500",
    MODERATOR: "text-teal-500",
    ADMIN: "text-orange-500",
};

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
          return;
        }
    
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    };

    useEffect(() => {
        const handleKeyDown = (event: any) => {
          if (event.key === "Escape" || event.keyCode === 27) {
            setIsEditing(false);
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => window.removeEventListener("keyDown", handleKeyDown);
    }, []);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          content: content,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          });
    
          await axios.patch(url, values);
    
          form.reset();
          setIsEditing(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        form.reset({
          content: content,
        });
    }, [content]);

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;

    return (
        <div className="relative group flex items-center hover:bg-slate-950/20 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                onClick={onMemberClick}
                                className={cn(
                                "font-semibold text-sm hover:underline cursor-pointer",
                                roleColorMap[member.role]
                                )}
                            >
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-md mt-2 overflow-hidden border-slate-700 flex items-center bg-slate-400 dark:bg-slate-950 h-48 w-48"
                      >
                        <Image
                            src={fileUrl}
                            alt={content}
                            fill
                            className="object-cover"
                        />
                      </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-slate-950">
                        <FileIcon className="h-10 w-10 fill-orange-200 stroke-orange-400" />
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-orange-500 dark:text-orange-400 hover:underline"
                        >
                            PDF
                        </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                        className={cn(
                            "text-sm text-slate-600 dark:text-slate-300",
                            deleted &&
                            "italic text-slate-500 dark:text-slate-400 text-xs mt-1"
                        )}
                        >
                        {content}
                        {isUpdated && !deleted && (
                            <span className="text-[10px] mx-2 text-slate-500 dark:text-slate-400">
                            (өзгертілген)
                            </span>
                        )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                        <form
                            className="flex items-center w-full gap-x-2 pt-2"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative w-full">
                                    <Input
                                        disabled={isLoading}
                                        className="p-2 bg-slate-200/90 dark:bg-slate-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-600 dark:text-slate-200"
                                        placeholder="Өзгертілген хабарлама"
                                        {...field}
                                    />
                                    </div>
                                </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button disabled={isLoading} size="sm" variant="primary">
                            Сақтау
                            </Button>
                        </form>
                        <span className="text-[10px] mt-1 text-slate-400">
                            Еscape болдырмау үшін, enter сақтау үшін
                        </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-slate-800 border rounded-sm">
                {canEditMessage && (
                    <ActionTooltip label="Өзгерту">
                    <Edit
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer ml-auto w-4 h-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    />
                    </ActionTooltip>
                )}
                <ActionTooltip label="Жою">
                    <Trash
                    // onClick={() =>
                    //     onOpen("deleteMessage", {
                    //     apiUrl: `${socketUrl}/${id}`,
                    //     query: socketQuery,
                    //     })
                    // }
                    className="cursor-pointer ml-auto w-4 h-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    />
                </ActionTooltip>
                </div>
            )}
        </div>
    )
}