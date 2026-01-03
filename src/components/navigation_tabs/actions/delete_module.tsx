"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DeleteModuleComponent = ( {
	closeModal,
	moduleId,
}: {
	closeModal: () => void;
	moduleId: string;
} ) => {
	const [ isLoading, setIsLoading ] = useState( false );

	const handleDeleteModule = async () => {
		if ( isLoading ) return;

		setIsLoading( true );

		try {
			const res = await fetch( "/api/modules", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify( {
					moduleId,
				} ),
			} );

			if ( !res.ok ) {
				const data = await res.json().catch( () => ( {} ) );
				throw new Error( data.error || "Failed to delete module" );
			}

			toast.success( `Module deleted: ${moduleId}` );
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
			handleDeleteModule();
		}

		if ( e.key === "Escape" ) {
			e.preventDefault();
			closeModal();
		}
	};

	return (
		<div className="space-y-4" onKeyDown={ handleKeyDown }>
			<div className="space-y-2 text-md">
				<p>Are you sure you want to delete this module? This action cannot be undone.</p>
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
					onClick={ handleDeleteModule }
					disabled={ isLoading }
				>
					{ isLoading ? "Deleting…" : "Delete module" }
				</Button>
			</div>
		</div>
	);
};
