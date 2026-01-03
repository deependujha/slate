"use client";

import { useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

type ModalAction = "create_module" | "create_page";

const MODAL_TITLE: Record<ModalAction, string> = {
  create_module: "Create new module",
  create_page: "Create new page",
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export function NavMain( { items, workspaceId, moduleId, pageId }: { items: SidebarItem[]; workspaceId: string; moduleId: string; pageId: string } ) {
  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const [ activeAction, setActiveAction ] = useState<ModalAction | null>( null );

  const openCreateModuleModal = () => {
    setActiveAction( "create_module" );
    setIsModalOpen( true );
  };

  const openCreatePageModal = () => {
    setActiveAction( "create_page" );
    setIsModalOpen( true );
  };

  return (
    <>
      <SidebarGroup>
        {/* Group header */ }
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>

          <button
            type="button"
            onClick={ openCreateModuleModal }
            className="opacity-70 hover:opacity-100 transition cursor-pointer"
          >
            <IoAddCircleOutline size={ 16 } />
          </button>
        </div>

        {/* Modules */ }
        <SidebarMenu>
          { items.map( ( module ) => (
            <Collapsible
              key={ module.title }
              asChild
              defaultOpen={ module.isActive }
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={ module.title } className="gap-2">
                    {/* Left: icon + title */ }
                    <div className="flex items-center gap-2">
                      { module.icon && <module.icon size={ 16 } /> }
                      <span>{ module.title }</span>
                    </div>

                    {/* Right: actions */ }
                    <div className="ml-auto flex items-center gap-2">
                      {/* Add page */ }
                      <button
                        type="button"
                        onClick={ ( e ) => {
                          e.stopPropagation(); // 🔑 don't toggle collapse
                          openCreatePageModal();
                        } }
                        className="opacity-0 group-hover/collapsible:opacity-100 transition cursor-pointer"
                      >
                        <IoAddCircleOutline size={ 16 } />
                      </button>

                      {/* Chevron */ }
                      <ChevronRight
                        className="transition-transform duration-200
                          group-data-[state=open]/collapsible:rotate-90"
                      />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Pages */ }
                <CollapsibleContent>
                  <SidebarMenuSub>
                    { module.items?.map( ( page ) => (
                      <SidebarMenuSubItem key={ page.title }>
                        <SidebarMenuSubButton asChild>
                          <a href={ page.url }>
                            <span>{ page.title }</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ) ) }
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) ) }
        </SidebarMenu>
      </SidebarGroup>

      {/* Modal */ }
      <SlateModal
        open={ isModalOpen }
        onOpenChange={ setIsModalOpen }
        title={ activeAction ? MODAL_TITLE[ activeAction ] : "" }
      >
        { activeAction === "create_module" && (
          <CreateNewModuleComponent closeModal={ () => setIsModalOpen( false ) } workspaceId={ workspaceId } />
        ) }

        { activeAction === "create_page" && (
          <CreateNewPageComponent closeModal={ () => setIsModalOpen( false ) } moduleId={ moduleId } />
        ) }
      </SlateModal>
    </>
  );
}
