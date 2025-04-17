"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Арна атауы міндетті."
    })
    .refine((name) => name !== "негізгі-арна", {
        message: "Арна атауы 'негізгі-арна' бола алмайды",
    }),
    type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const { channel, server } = data;

    const isModalOpen = isOpen && type === "editChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT,
        }
    });

    useEffect(() => {
      if (channel) {
        form.setValue("name", channel.name);
        form.setValue("type", channel.type);
      }
    }, [form, channel]);


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                  serverId: server?.id,
                },
              });
            await axios.patch(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
      };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                      Арнаны баптау
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        suppressHydrationWarning
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-slate-500 dark:text-secondary/70">
                                        Арна аты
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-white border-2 border-slate-300 focus-visible: ring-0 text-slate-900 focus-visible: ring-offset-0"
                                            placeholder="Арна атын еңгізіңіз"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>

                                    </FormMessage>
                                </FormItem>
                            )}
                            />
                            <FormField 
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-slate-500 dark:text-secondary/70">
                                      Арна түрі
                                    </FormLabel>
                                    <Select
                                      disabled={isLoading}
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-white border-2 border-slate-300 focus-visible: ring-0 text-slate-900 focus-visible: ring-offset-0 capitalize">
                                          <SelectValue placeholder="Арна түрін таңдау" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="text-black dark:bg-slate-950 dark:text-neutral-300/90 dark:border-slate-900">
                                        {Object.values(ChannelType).map((type) => (
                                          <SelectItem
                                            key={type}
                                            value={type}
                                            className="capitalize"
                                          >
                                            {type.toLowerCase()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-slate-100 px-6 py-4">
                            <Button variant='primary' disabled={isLoading}>
                                Сақтау
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}