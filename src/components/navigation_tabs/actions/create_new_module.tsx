"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EntityIdentifierType, UserDataType } from "@/constants/types";

export const CreateNewModuleComponent = ({
	userData,
	setUserData,
	activeWorkspaceIdAndName,
	closeModal,
}: {
	userData: UserDataType;
	setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
	activeWorkspaceIdAndName: EntityIdentifierType;
	closeModal: () => void;
}) => {
	const [moduleName, setModuleName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateModule = async () => {
		const newModuleName = moduleName.trim();
		if (!newModuleName || isLoading) return;

		setIsLoading(true);

		// IMPORTANT: keep original reference for rollback
		const originalUserData = userData;

		// temp id for optimistic module
		const tempModuleId = `temp-id-${Date.now()}`;

		try {
			/* ----------------------------------
			 * Optimistic UI update (IMMUTABLE)
			 * ---------------------------------- */
			const tmpUserData: UserDataType = {
				...userData,
				workspaces: userData.workspaces.map((workspace) => {
					if (workspace.id !== activeWorkspaceIdAndName.id) {
						return workspace;
					}

					return {
						...workspace,
						modules: [
							...workspace.modules,
							{
								id: tempModuleId,
								name: newModuleName,
								pages: [],
							},
						],
					};
				}),
			};

			setUserData(tmpUserData);
			closeModal();

			/* ----------------------------------
			 * API call
			 * ---------------------------------- */
			const res = await fetch("/api/modules", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					workspaceId: activeWorkspaceIdAndName.id,
					newModuleName,
				}),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Failed to create module");
			}

			const data = await res.json();
			console.log("Created module:", data);
			const createdModule = {
				id: data.id,
				name: data.name,
				pages: [],
			};

			/* ----------------------------------
			 * Reconcile temp module → real module
			 * ---------------------------------- */
			const reconciledUserData: UserDataType = {
				...tmpUserData,
				workspaces: tmpUserData.workspaces.map((workspace) => {
					if (workspace.id !== activeWorkspaceIdAndName.id) {
						return workspace;
					}

					return {
						...workspace,
						modules: workspace.modules.map((module) =>
							module.id === tempModuleId ? createdModule : module,
						),
					};
				}),
			};

			setUserData(reconciledUserData);
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
			handleCreateModule();
		}

		if (e.key === "Escape") {
			e.preventDefault();
			closeModal();
		}
	};

	return (
		<div className="space-y-4" onKeyDown={handleKeyDown}>
			<Input
				autoFocus
				value={moduleName}
				onChange={(e) => setModuleName(e.target.value)}
				placeholder="Module name"
				disabled={isLoading}
			/>

			<div className="flex justify-end gap-2">
				<Button
					variant="ghost"
					onClick={closeModal}
					className="text-muted-foreground"
					disabled={isLoading}
				>
					Cancel
				</Button>

				<Button onClick={handleCreateModule} disabled={!moduleName.trim() || isLoading}>
					{isLoading ? "Creating…" : "Create module"}
				</Button>
			</div>
		</div>
	);
};
