"use client";

import { AppSidebar } from "@/components/navigation_tabs/app-sidebar";
import { SlateTable } from "@/components/table/slate-table";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EntityIdentifierType, UserDataType } from "@/constants/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ConsolePage() {
	const [userData, setUserData] = useState<UserDataType | null>(null);

	const [activeWorkspaceIdAndName, setActiveWorkspaceIdAndName] =
		useState<EntityIdentifierType | null>(null);
	const [activeModuleIdAndName, setActiveModuleIdAndName] = useState<EntityIdentifierType | null>(
		null,
	);
	const [activePageIdAndName, setActivePageIdAndName] = useState<EntityIdentifierType | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/workspaces");
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch workspaces");
				}

				if (data.workspaces.length === 0) {
					throw new Error("No workspaces found");
				}

				setUserData(data);

				const ws = data.workspaces[0];
				setActiveWorkspaceIdAndName({ id: ws.id, name: ws.name });

				if (ws.modules.length > 0) {
					setActiveModuleIdAndName({
						id: ws.modules[0].id,
						name: ws.modules[0].name,
					});
				}
			} catch (err) {
				console.error(err);
				toast.error("Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
	}

	if (!userData) {
		return (
			<div className="flex min-h-screen items-center justify-center">Something went wrong.</div>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar
				userData={userData}
				setUserData={setUserData}
				activeWorkspaceIdAndName={activeWorkspaceIdAndName}
				setActiveWorkspaceIdAndName={setActiveWorkspaceIdAndName}
				activeModuleIdAndName={activeModuleIdAndName}
				setActiveModuleIdAndName={setActiveModuleIdAndName}
				activePageIdAndName={activePageIdAndName}
				setActivePageIdAndName={setActivePageIdAndName}
			/>

			{/* ⬇️ IMPORTANT: full-height column layout */}
			<SidebarInset className="flex flex-col h-screen">
				{/* Header (fixed) */}
				<header className="flex h-14 shrink-0 items-center border-b">
					<div className="flex w-full items-center justify-between px-4">
						<div className="flex items-center gap-2">
							<SidebarTrigger className="-ml-1" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink href="#">slate</BreadcrumbLink>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<ThemeToggle />
					</div>
				</header>

				{/* ⬇️ Scroll boundary lives HERE */}
				<div className="flex-1 min-h-0 overflow-hidden p-4">
					<SlateTable />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
