"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();
    const refi = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
          content: "",
        },
        resolver: zodResolver(formSchema),
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const url = qs.stringifyUrl({
            url: apiUrl,
            query,
          });
    
          await axios.post(url, values);
          form.reset();
          router.refresh();
        } catch (error) {
          console.log(error);
        }
    };
    
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <div className="relative p-4 pb-6">
                    <button
                        type="button"
                        onClick={() => {}}
                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-slate-500 dark:bg-slate-400 hover:bg-slate-600 dark:hover:bg-slate-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                        <Plus className="text-white dark:text-slate-900" />
                    </button>
                    <Input
                        disabled={isLoading}
                        autoFocus
                        className="px-14 py-6 bg-slate-200/90 dark:bg-slate-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
                        placeholder={`Хабарламаны ${
                        type === "conversation" ? name : "#" + name
                        } ішінде жазу`}
                        {...field}
                        ref={refi}
                    />
                    <div className="absolute top-7 right-8">
                        <Smile
                        />
                    </div>
                    </div>
                </FormControl>
                </FormItem>
            )}
        />
        </form>
    </Form>
    )
}