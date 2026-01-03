"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CreateNewPageComponent = ( {
    closeModal,
}: {
    closeModal: () => void;
} ) => {
    const [ pageName, setPageName ] = useState( "" );

    const handleCreatePage = async () => {
        if ( !pageName.trim() ) return;

        console.log( "Creating page:", pageName );
        closeModal();
    };

    const handleKeyDown = ( e: React.KeyboardEvent ) => {
        if ( e.key === "Enter" ) {
            e.preventDefault();
            handleCreatePage();
        }

        if ( e.key === "Escape" ) {
            e.preventDefault();
            closeModal();
        }
    };

    return (
        <div
            className="space-y-4"
            onKeyDown={ handleKeyDown }
        >
            <Input
                autoFocus
                value={ pageName }
                onChange={ ( e ) => setPageName( e.target.value ) }
                placeholder="Page name"
            />

            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    onClick={ closeModal }
                    className="text-muted-foreground"
                >
                    Cancel
                </Button>

                <Button
                    onClick={ handleCreatePage }
                    disabled={ !pageName.trim() }
                >
                    Create page
                </Button>
            </div>
        </div>
    );
};
