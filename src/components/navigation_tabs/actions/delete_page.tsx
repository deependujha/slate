"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DeletePageComponent = ( {
    closeModal,
    pageId,
}: {
    closeModal: () => void;
    pageId: string;
} ) => {
    const [ isLoading, setIsLoading ] = useState( false );

    const handleDeletePage = async () => {
        if ( isLoading ) return;

        setIsLoading( true );

        try {
            const res = await fetch( "/api/modules", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {
                    pageId,
                } ),
            } );

            if ( !res.ok ) {
                const data = await res.json().catch( () => ( {} ) );
                throw new Error( data.error || "Failed to create module" );
            }

            toast.success( `Page deleted: ${pageId}` );
            closeModal();
        } catch ( error ) {
            console.error( error );
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setIsLoading( false );
        }
    };

    const handleKeyDown = ( e: React.KeyboardEvent ) => {
        if ( e.key === "Enter" ) {
            e.preventDefault();
            handleDeletePage();
        }

        if ( e.key === "Escape" ) {
            e.preventDefault();
            closeModal();
        }
    };

    return (
        <div className="space-y-4" onKeyDown={ handleKeyDown }>
            <div className="space-y-2 text-md">
                <p>Are you sure you want to delete this page? This action cannot be undone.</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    onClick={ closeModal }
                    className="text-muted-foreground"
                    disabled={ isLoading }
                >
                    Cancel
                </Button>

                <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={ handleDeletePage }
                    disabled={ isLoading }
                >
                    { isLoading ? "Deleting…" : "Delete page" }
                </Button>
            </div>
        </div>
    );
};
