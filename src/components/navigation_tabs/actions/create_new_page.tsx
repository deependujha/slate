"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EntityIdentifierType, UserDataType } from "@/constants/types";

export const CreateNewPageComponent = ({
	userData,
	setUserData,
	activeWorkspaceIdAndName,
	activeModuleIdAndName,
	activePageIdAndName, // unused but intentionally accepted
	closeModal,
}: {
	userData: UserDataType;
	setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
	activeWorkspaceIdAndName: EntityIdentifierType;
	activeModuleIdAndName: EntityIdentifierType | null;
	activePageIdAndName: EntityIdentifierType | null;
	closeModal: () => void;
}) => {
	if (!activeModuleIdAndName) {
		throw new Error("Active module is null");
	}

	const [pageName, setPageName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCreatePage = async () => {
		const newPageName = pageName.trim();
		if (!newPageName || isLoading) return;

		setIsLoading(true);

		const tempPageId = `temp-page-${Date.now()}`;
		const originalUserData = structuredClone(userData);

		try {
			/* ----------------------------------
			 * Optimistic UI update
			 * ---------------------------------- */
			const optimisticUserData: UserDataType = {
				...userData,
				workspaces: userData.workspaces.map((workspace) => {
					if (workspace.id !== activeWorkspaceIdAndName.id) {
						return workspace;
					}

					return {
						...workspace,
						modules: workspace.modules.map((module) => {
							if (module.id !== activeModuleIdAndName.id) {
								return module;
							}

							return {
								...module,
								pages: [
									...module.pages,
									{
										id: tempPageId,
										title: newPageName,
										type: "TABLE",
										createdAt: new Date().toISOString(),
										updatedAt: new Date().toISOString(),
									},
								],
							};
						}),
					};
				}),
			};

			setUserData(optimisticUserData);
			closeModal();

			/* ----------------------------------
			 * API call
			 * ---------------------------------- */
			const res = await fetch("/api/pages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					moduleId: activeModuleIdAndName.id,
					newPageName,
					type: "TABLE",
				}),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to create page");
			}

			const data = await res.json();
			const createdPage = data?.page ?? data;

			if (!createdPage?.id) {
				throw new Error("Invalid page returned from server");
			}

			/* ----------------------------------
			 * Reconcile temp page → real page
			 * ---------------------------------- */
			const reconciledUserData: UserDataType = {
				...optimisticUserData,
				workspaces: optimisticUserData.workspaces.map((workspace) => {
					if (workspace.id !== activeWorkspaceIdAndName.id) {
						return workspace;
					}

					return {
						...workspace,
						modules: workspace.modules.map((module) => {
							if (module.id !== activeModuleIdAndName.id) {
								return module;
							}

							return {
								...module,
								pages: module.pages.map((page) => (page.id === tempPageId ? createdPage : page)),
							};
						}),
					};
				}),
			};

			setUserData(reconciledUserData);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Something went wrong");
			setUserData(originalUserData); // rollback
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleCreatePage();
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
				value={pageName}
				onChange={(e) => setPageName(e.target.value)}
				placeholder="Page name"
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

				<Button onClick={handleCreatePage} disabled={!pageName.trim() || isLoading}>
					{isLoading ? "Creating…" : "Create page"}
				</Button>
			</div>
		</div>
	);
};
