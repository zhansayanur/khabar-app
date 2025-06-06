"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    CommandDialog,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components//ui/command";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data:
          | {
              icon: React.ReactNode;
              name: string;
              id: string;
            }[]
          | undefined;
      }[];
}

export const ServerSearch = ({ 
    data 
}: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if ((e.key === "k" && e.ctrlKey) || e.metaKey) {
            e.preventDefault();
            setOpen((o) => !o);
          }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);
    
    const onClick = ({
        id,
        type,
    }: {
        id: string;
        type: "channel" | "member";
    }) => {
        setOpen(false);
        if (type === "member") {
        return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if (type === "channel") {
        return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    };

    return (
        <>
        <button
            onClick={() => setOpen(true)}
            className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition"
        >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <p>
                Іздеу
            </p>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto dark:bg-slate-700 dark:border-slate-600">
                <span className="text-xs">CTRL </span> K
            </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Іздеу" className="dark:bg-slate-900" />
            <CommandList className="dark:bg-slate-900">
                <CommandEmpty>Ештеңе табылған жоқ</CommandEmpty>
                {data.map(({ label, type, data }) => {
                    if (!data?.length) return null;

                    return (
                    <CommandGroup key={label} heading={label} className="dark:bg-slate-900">
                        {data?.map(({ icon, name, id }) => (
                        <CommandItem key={id} onSelect={() => onClick({ id, type })} className="dark:hover:bg-slate-800/50" >
                            {icon}
                            <span>{name}</span>
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    );
                })}
            </CommandList>
        </CommandDialog>
        </>
    )
}