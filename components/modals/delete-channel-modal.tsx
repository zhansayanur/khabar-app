"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const DeleteChannelModal = () => {
    const {isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;   
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
          setIsLoading(true);
          const url = qs.stringifyUrl({
            url: `/api/channels/${channel?.id}`,
            query: {
              serverId: server?.id,
            },
          });
    
          await axios.delete(url);
          onClose();
          router.refresh();
          router.push("/servers/" + server?.id);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Арнаны жою
                    </DialogTitle>
                    <DialogDescription className="text-left text-slate-500" >
                        <span className="font-semibold text-orange-500" >#{channel?.name}</span> арнасын шынымен жойғыңыз келе ме? <br />
                        Арна біржола жойылады.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
                            Артқа оралу
                        </Button>
                        <Button disabled={isLoading} variant="primary" onClick={onClick}>
                            Жою
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};