"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EntityIdentifierType, UserDataType } from "@/constants/types";

export const DeleteModuleComponent = ({
	userData,
	setUserData,
	activeWorkspaceIdAndName,
	activeModuleIdAndName,
	closeModal,
}: {
	userData: UserDataType;
	setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
	activeWorkspaceIdAndName: EntityIdentifierType;
	activeModuleIdAndName: EntityIdentifierType | null;
	closeModal: () => void;
}) => {
	if (!activeModuleIdAndName) {
		throw new Error("Active module is null");
	}

	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteModule = async () => {
		if (isLoading) return;

		setIsLoading(true);
		const originalUserData = { ...userData };

		try {
			/* ----------------------------------
			 * Optimistic UI update
			 * ---------------------------------- */
			const tmpUserData = { ...userData };

			for (const workspace of tmpUserData.workspaces) {
				if (workspace.id === activeWorkspaceIdAndName.id) {
					workspace.modules = workspace.modules.filter(
						(module) => module.id !== activeModuleIdAndName.id,
					);
				}
			}

			setUserData(tmpUserData);
			closeModal();

			/* ----------------------------------
			 * API call
			 * ---------------------------------- */
			const res = await fetch("/api/modules", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					moduleId: activeModuleIdAndName.id,
				}),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Failed to delete module");
			}
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Something went wrong");

			// rollback
			setUserData(originalUserData);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleDeleteModule();
		}

		if (e.key === "Escape") {
			e.preventDefault();
			closeModal();
		}
	};

	return (
		<div className="space-y-4" onKeyDown={handleKeyDown}>
			<div className="flex justify-end gap-2">
				<Button
					variant="ghost"
					onClick={closeModal}
					className="text-muted-foreground"
					disabled={isLoading}
				>
					Cancel
				</Button>

				<Button
					onClick={handleDeleteModule}
					disabled={isLoading}
					className="bg-red-500 hover:bg-red-600 text-white"
				>
					{isLoading ? "Deleting…" : "Delete module"}
				</Button>
			</div>
		</div>
	);
};
