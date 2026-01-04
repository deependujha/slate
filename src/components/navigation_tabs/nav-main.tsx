"use client";

import React, { useState } from "react";
import { ChevronRight, Frame, type LucideIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { SlateModal } from "../ui/modal";
import { CreateNewModuleComponent } from "./actions/create_new_module";
import { CreateNewPageComponent } from "./actions/create_new_page";
import { DeletePageComponent } from "./actions/delete_page";
import { DeleteModuleComponent } from "./actions/delete_module";
import { EntityIdentifierType, ModulesAndPagesTypes, UserDataType } from "@/constants/types";
import { toast } from "sonner";
import { ACTION_COMPONENT_MAPPER } from "./actions/action-component-mapper";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type SidebarItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
};

type ModalAction = "create_module" | "create_page" | "delete_module" | "delete_page";

const MODAL_META: Record<ModalAction, { title: string; description: string }> = {
	create_module: {
		title: "Create new module",
		description: "Modules help organize related pages.",
	},
	create_page: {
		title: "Create new page",
		description: "creating new page in {module} module.",
	},
	delete_module: {
		title: "Delete {module} module",
		description:
			"This will remove the {module} module and all its pages. This action cannot be undone.",
	},

	delete_page: {
		title: "Delete {page} page in {module} module",
		description:
			"This will remove the {page} page in the {module} module. This action cannot be undone.",
	},
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export function NavMain({
	userData,
	setUserData,
	userModulesAndPages,
	activeWorkspaceIdAndName,
	activeModuleIdAndName,
	setActiveModuleIdAndName,
	activePageIdAndName,
	setActivePageIdAndName,
}: {
	userData: UserDataType;
	setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
	userModulesAndPages: Array<ModulesAndPagesTypes>;
	activeWorkspaceIdAndName: EntityIdentifierType;
	activeModuleIdAndName: EntityIdentifierType | null;
	setActiveModuleIdAndName: React.Dispatch<React.SetStateAction<EntityIdentifierType | null>>;
	activePageIdAndName: EntityIdentifierType | null;
	setActivePageIdAndName: React.Dispatch<React.SetStateAction<EntityIdentifierType | null>>;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [action, setAction] = useState<ModalAction | null>(null);

	const openModal = (
		next: ModalAction,
		module_id_and_name: EntityIdentifierType | null = null,
		page_id_and_name: EntityIdentifierType | null = null,
	) => {
		if (module_id_and_name) {
			setActiveModuleIdAndName(module_id_and_name);
		}
		if (page_id_and_name) {
			setActivePageIdAndName(page_id_and_name);
		}
		setAction(next);
		setModalOpen(true);
	};

	return (
		<>
			{/* ================= Sidebar Group ================= */}
			<SidebarGroup className="flex h-full flex-col">
				{/* ---------- Header ---------- */}
				<div className="flex items-center justify-between shrink-0 px-1">
					<SidebarGroupLabel>Projects</SidebarGroupLabel>

					<span
						role="button"
						tabIndex={0}
						onClick={() => openModal("create_module")}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								openModal("create_module");
							}
						}}
						className="cursor-pointer opacity-70 transition hover:opacity-100"
					>
						<IoAddCircleOutline size={16} />
					</span>
				</div>

				{/* ---------- Scrollable Modules ---------- */}
				<div className="mt-2 flex-1 overflow-y-auto no-scrollbar">
					<SidebarMenu>
						{userModulesAndPages.map((module) => (
							<Collapsible
								key={module.module_id}
								asChild
								defaultOpen={activeModuleIdAndName?.id === module.module_id}
							>
								<SidebarMenuItem className="group/module">
									<CollapsibleTrigger asChild>
										<SidebarMenuButton className="gap-2">
											{/* Left */}
											<div className="flex items-center gap-2">
												<Frame size={16} />
												<span>{module.name}</span>
											</div>

											{/* Right actions */}
											<div className="ml-auto flex w-16 items-center justify-end gap-2">
												<span
													role="button"
													tabIndex={0}
													onClick={(e) => {
														e.stopPropagation();
														openModal("create_page", { id: module.module_id, name: module.name });
													}}
													className="cursor-pointer opacity-0 transition group-hover/module:opacity-100 text-muted-foreground hover:text-foreground"
												>
													<IoAddCircleOutline size={16} />
												</span>

												<span
													role="button"
													tabIndex={0}
													onClick={(e) => {
														e.stopPropagation();
														openModal("delete_module", { id: module.module_id, name: module.name });
													}}
													className="cursor-pointer opacity-0 transition group-hover/module:opacity-100 text-muted-foreground hover:text-destructive"
												>
													<MdDelete size={16} />
												</span>

												<ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</div>
										</SidebarMenuButton>
									</CollapsibleTrigger>

									{/* ---------- Pages ---------- */}
									<CollapsibleContent>
										<SidebarMenuSub>
											{module.pages.map((page) => (
												<SidebarMenuSubItem key={page.name} className="group/page">
													<SidebarMenuSubButton asChild>
														<button className="flex items-center gap-2">
															<span className="flex-1 truncate">{page.name}</span>
															<span className="w-8 flex justify-end">
																<span
																	role="button"
																	tabIndex={0}
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		openModal(
																			"delete_page",
																			{ id: module.module_id, name: module.name },
																			{ id: page.page_id, name: page.name },
																		);
																	}}
																	className="cursor-pointer opacity-0 transition group-hover/page:opacity-100 text-muted-foreground hover:text-destructive"
																>
																	<MdDelete size={14} />
																</span>
															</span>
														</button>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</div>
			</SidebarGroup>

			{/* ================= Modal ================= */}
			<SlateModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				title={
					action
						? MODAL_META[action].title
								.replace("{module}", activeModuleIdAndName?.name || "")
								.replace("{page}", activePageIdAndName?.name || "")
						: ""
				}
				description={
					action
						? MODAL_META[action].description
								.replace("{module}", activeModuleIdAndName?.name || "")
								.replace("{page}", activePageIdAndName?.name || "")
						: ""
				}
			>
				{ACTION_COMPONENT_MAPPER[action!] && action
					? React.createElement(ACTION_COMPONENT_MAPPER[action!], {
							userData,
							setUserData,
							activeWorkspaceIdAndName,
							activeModuleIdAndName,
              activePageIdAndName,
							closeModal: () => setModalOpen(false),
						})
					: null}
			</SlateModal>
		</>
	);
}
