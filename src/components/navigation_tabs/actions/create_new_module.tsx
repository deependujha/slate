"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CreateNewModuleComponent = ( {
    closeModal,
}: {
    closeModal: () => void;
} ) => {
    const [ moduleName, setModuleName ] = useState( "" );

    const handleCreateModule = async () => {
        if ( !moduleName.trim() ) return;

        console.log( "Creating module:", moduleName );
        closeModal();
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
        <div
            className="space-y-4"
            onKeyDown={ handleKeyDown }
        >
            <Input
                autoFocus
                value={ moduleName }
                onChange={ ( e ) => setModuleName( e.target.value ) }
                placeholder="Module name"
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
                    onClick={ handleCreateModule }
                    disabled={ !moduleName.trim() }
                >
                    Create module
                </Button>
            </div>
        </div>
    );
};
