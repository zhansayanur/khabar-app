"use client";

import { useState } from "react";
import axios from "axios";

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

export const DeleteServerModal = () => {
    const {isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteServer";
    const { server } = data;   
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
          setIsLoading(true);
          await axios.delete(`/api/servers/${server?.id}`);
    
          onClose();
          router.refresh();
          router.push("/");
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
                        Серверді жою
                    </DialogTitle>
                    <DialogDescription className="text-left text-slate-500" >
                        <span className="font-semibold text-orange-500" >{server?.name}</span> серверін шынымен жойғыңыз келе ме? <br />
                        Сервер біржола жойылады.
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
    )
}