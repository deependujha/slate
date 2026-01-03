"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React from "react";

type SlateModalProps = {
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    title: string;
    children: React.ReactNode;
};

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SlateModal = ( {
    open,
    onOpenChange,
    title,
    children,
}: SlateModalProps ) => {
    return (
        <AlertDialog open={ open } onOpenChange={ onOpenChange }>
            <AlertDialogContent>
                <AlertDialogHeader className="flex flex-row items-center justify-between">
                    <AlertDialogTitle>{ title }</AlertDialogTitle>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={ () => onOpenChange( false ) }
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </AlertDialogHeader>

                { children }

            </AlertDialogContent>
        </AlertDialog>
    );
};
