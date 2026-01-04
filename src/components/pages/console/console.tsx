"use client";
import { AppSidebar } from "@/components/navigation_tabs/app-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
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
				if (res.ok) {
					if (data.workspaces.length > 0) {
						setUserData(data);
						setActiveWorkspaceIdAndName({
							id: data.workspaces[0].id,
							name: data.workspaces[0].name,
						});
						if (data.workspaces[0].modules.length > 0) {
							setActiveModuleIdAndName({
								id: data.workspaces[0].modules[0].id,
								name: data.workspaces[0].modules[0].name,
							});
						}
					} else {
						toast.error("No workspaces, modules, or pages found.");
					}
				} else {
					console.error("Error fetching workspaces:", data.error);
					toast.error("Failed to fetch workspaces.");
				}
			} catch (error) {
				toast.error("Failed to fetch workspaces.");
				console.error("Error fetching workspaces:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
	}

	if (!userData || userData.workspaces.length === 0) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				An error occurred. Please try again later or contact support.
			</div>
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
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center border-b">
					<div className="flex w-full items-center justify-between px-4">
						<div className="flex items-center gap-2">
							<SidebarTrigger className="-ml-1" />

                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

						<ThemeToggle />
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
					</div>
					<div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
