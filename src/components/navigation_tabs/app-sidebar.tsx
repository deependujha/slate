"use client";

import { useEffect, useState } from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/navigation_tabs/nav-main";
import { NavUser } from "@/components/navigation_tabs/nav-user";
import { WorkspaceSwitcher } from "@/components/navigation_tabs/workspace-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { EntityIdentifierType, ModulesAndPagesTypes, UserDataType } from "@/constants/types";

export function AppSidebar({
	userData,
	setUserData,
	activeWorkspaceIdAndName,
	setActiveWorkspaceIdAndName,
	activeModuleIdAndName,
	setActiveModuleIdAndName,
	activePageIdAndName,
	setActivePageIdAndName,
	...props
}: {
	userData: UserDataType;
	setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
	activeWorkspaceIdAndName: EntityIdentifierType | null;
	setActiveWorkspaceIdAndName: React.Dispatch<React.SetStateAction<EntityIdentifierType | null>>;
	activeModuleIdAndName: EntityIdentifierType | null;
	setActiveModuleIdAndName: React.Dispatch<React.SetStateAction<EntityIdentifierType | null>>;
	activePageIdAndName: EntityIdentifierType | null;
	setActivePageIdAndName: React.Dispatch<React.SetStateAction<EntityIdentifierType | null>>;
} & React.ComponentProps<typeof Sidebar>) {
	const [userWorkspacesData, setUserWorkspacesData] = useState<Array<{ name: string; id: string }>>(
		[],
	);
	const [userModulesAndPagesData, setUserModulesAndPagesData] = useState<
		Array<ModulesAndPagesTypes>
	>([]);

	useEffect(() => {
		console.log("updated userData:", userData);
		const workspaces: Array<{ name: string; id: string }> = [];
		const modulesAndPages: Array<ModulesAndPagesTypes> = [];
		for (const workspace of userData?.workspaces || []) {
			workspaces.push({
				name: workspace.name,
				id: workspace.id,
			});
		}

		for (const workspace of userData?.workspaces || []) {
			if (workspace.id === activeWorkspaceIdAndName?.id) {
				for (const module of workspace.modules) {
					modulesAndPages.push({
						module_id: module.id,
						name: module.name,
						pages: module.pages.map((page) => ({
							page_id: page.id,
							name: page.title,
						})),
					});
				}
			}

			setUserWorkspacesData(workspaces);
			setUserModulesAndPagesData(modulesAndPages);
		}
	}, [userData, activeWorkspaceIdAndName]);

	if (activeWorkspaceIdAndName === null || activeModuleIdAndName === null) {
		return null;
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<WorkspaceSwitcher userWorkspaces={userWorkspacesData} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					userData={userData}
					setUserData={setUserData}
					userModulesAndPages={userModulesAndPagesData}
					activeWorkspaceIdAndName={activeWorkspaceIdAndName}
					activeModuleIdAndName={activeModuleIdAndName}
					setActiveModuleIdAndName={setActiveModuleIdAndName}
					activePageIdAndName={activePageIdAndName}
					setActivePageIdAndName={setActivePageIdAndName}
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
