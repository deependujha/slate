"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const CreateNewPageComponent = ( {
    closeModal,
    moduleId,
}: {
    closeModal: () => void;
    moduleId: string;
} ) => {
    const [ pageName, setPageName ] = useState( "" );
    const [ isLoading, setIsLoading ] = useState( false );

    const handleCreateModule = async () => {
        const newPageName = pageName.trim();
        if ( !newPageName || isLoading ) return;

        setIsLoading( true );

        try {
            const res = await fetch( "/api/pages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {
                    moduleId,
                    newPageName,
                    type: "TABLE",
                } ),
            } );

            if ( !res.ok ) {
                const data = await res.json().catch( () => ( {} ) );
                throw new Error( data.error || "Failed to create module" );
            }

            toast.success( `Page created: ${newPageName}` );
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
            handleCreateModule();
        }

        if ( e.key === "Escape" ) {
            e.preventDefault();
            closeModal();
        }
    };

    return (
        <div className="space-y-4" onKeyDown={ handleKeyDown }>
            <Input
                autoFocus
                value={ pageName }
                onChange={ ( e ) => setPageName( e.target.value ) }
                placeholder="Page name"
                disabled={ isLoading }
            />

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
                    onClick={ handleCreateModule }
                    disabled={ !pageName.trim() || isLoading }
                >
                    { isLoading ? "Creating…" : "Create page" }
                </Button>
            </div>
        </div>
    );
};
