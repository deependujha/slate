"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const CreateNewModuleComponent = ({
	closeModal,
	workspaceId,
}: {
	closeModal: () => void;
	workspaceId: string;
}) => {
	const [moduleName, setModuleName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateModule = async () => {
		const newModuleName = moduleName.trim();
		if (!newModuleName || isLoading) return;

		setIsLoading(true);

		try {
			const res = await fetch("/api/modules", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					workspaceId,
					newModuleName,
				}),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Failed to create module");
			}

			toast.success(`Module created: ${newModuleName}`);
			closeModal();
		} catch (error) {
			console.error(error);
			toast.error(
				error instanceof Error
					? error.message
					: "Something went wrong"
			);
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

				<Button
					onClick={handleCreateModule}
					disabled={!moduleName.trim() || isLoading}
				>
					{isLoading ? "Creating…" : "Create module"}
				</Button>
			</div>
		</div>
	);
};
