import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "./button";

export function SlateModal( {
    open,
    onOpenChange,
    title,
    description,
    children,
}: {
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
} ) {
    return (
        <AlertDialog open={ open } onOpenChange={ onOpenChange }>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex justify-between gap-2">
                        <AlertDialogTitle>{ title }</AlertDialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={ () => onOpenChange( false ) }
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <AlertDialogDescription>
                        { description ??
                            "This action affects your workspace. You can cancel anytime." }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                { children }
            </AlertDialogContent>
        </AlertDialog>
    );
}
