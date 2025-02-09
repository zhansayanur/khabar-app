"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Сервердің атауы міндетті."
    }),
    imageURL: z.string().min(1, {
        message: "Сервердің суреті міндетті."
    })
});

export const InittialModal = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageURL: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    if (!isMounted){
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Серверіңізді баптаңыз
                    </DialogTitle>
                    <DialogDescription className="text-left text-slate-500">
                        Серверіңізге аты мен суретің қойыңыз. Оны кейінірек өзгерте аласыз.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageURL"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-slate-500 dark:text-secondary/70">
                                        Сервер аты
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-white border-2 border-slate-300 focus-visible: ring-0 text-slate-900 focus-visible: ring-offset-0"
                                            placeholder="Сервер атын еңгізіңіз"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>

                                    </FormMessage>
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