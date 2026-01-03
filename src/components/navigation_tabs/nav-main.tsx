"use client";

import { useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

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
import { DeletePageComponent } from "./actions/delete_page";
import { DeleteModuleComponent } from "./actions/delete_module";

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

type ModalAction =
  | "create_module"
  | "create_page"
  | "delete_module"
  | "delete_page";

const MODAL_TITLE: Record<ModalAction, { title: string; description: string }> = {
  create_module: {
    title: "Create new module",
    description: "Modules help you organize related pages in your workspace.",
  },
  create_page: {
    title: "Create new page",
    description: "Pages are the individual documents within a module.",
  },
  delete_module: {
    title: "Delete module",
    description: "This action affects your workspace. You can cancel anytime.",
  },
  delete_page: {
    title: "Delete page",
    description: "This action affects your workspace. You can cancel anytime.",
  },
};
/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export function NavMain( {
  items,
  workspaceId,
  moduleId,
  pageId,
}: {
  items: SidebarItem[];
  workspaceId: string;
  moduleId: string;
  pageId: string;
} ) {
  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const [ activeAction, setActiveAction ] = useState<ModalAction | null>( null );

  const openModal = ( action: ModalAction ) => {
    setActiveAction( action );
    setIsModalOpen( true );
  };

  return (
    <>
      <SidebarGroup>
        {/* Group header */ }
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>

          <span
            role="button"
            tabIndex={ 0 }
            onClick={ () => openModal( "create_module" ) }
            onKeyDown={ ( e ) => {
              if ( e.key === "Enter" || e.key === " " ) {
                e.preventDefault();
                openModal( "create_module" );
              }
            } }
            className="opacity-70 hover:opacity-100 transition cursor-pointer"
          >
            <IoAddCircleOutline size={ 16 } />
          </span>
        </div>

        {/* Modules */ }
        <SidebarMenu>
          { items.map( ( module ) => (
            <Collapsible
              key={ module.title }
              asChild
              defaultOpen={ module.isActive }
            >
              <SidebarMenuItem className="group/module">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="gap-2">
                    {/* Left */ }
                    <div className="flex items-center gap-2">
                      { module.icon && <module.icon size={ 16 } /> }
                      <span>{ module.title }</span>
                    </div>

                    {/* Right (fixed width, no layout shift) */ }
                    <div className="ml-auto flex items-center gap-2 w-16 justify-end">
                      {/* Create page */ }
                      <span
                        role="button"
                        tabIndex={ 0 }
                        onClick={ ( e ) => {
                          e.stopPropagation();
                          openModal( "create_page" );
                        } }
                        onKeyDown={ ( e ) => {
                          if ( e.key === "Enter" || e.key === " " ) {
                            e.preventDefault();
                            e.stopPropagation();
                            openModal( "create_page" );
                          }
                        } }
                        className="
                          opacity-0 group-hover/module:opacity-100
                          transition cursor-pointer
                          text-muted-foreground hover:text-foreground
                        "
                      >
                        <IoAddCircleOutline size={ 16 } />
                      </span>

                      {/* Delete module */ }
                      <span
                        role="button"
                        tabIndex={ 0 }
                        onClick={ ( e ) => {
                          e.stopPropagation();
                          openModal( "delete_module" );
                        } }
                        onKeyDown={ ( e ) => {
                          if ( e.key === "Enter" || e.key === " " ) {
                            e.preventDefault();
                            e.stopPropagation();
                            openModal( "delete_module" );
                          }
                        } }
                        className="
                          opacity-0 group-hover/module:opacity-100
                          transition cursor-pointer
                          text-muted-foreground hover:text-destructive
                        "
                      >
                        <MdDelete size={ 16 } />
                      </span>

                      <ChevronRight
                        className="
                          transition-transform duration-200
                          group-data-[state=open]/collapsible:rotate-90
                        "
                      />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Pages */ }
                <CollapsibleContent>
                  <SidebarMenuSub>
                    { module.items?.map( ( page ) => (
                      <SidebarMenuSubItem
                        key={ page.title }
                        className="group/page"
                      >
                        <SidebarMenuSubButton asChild>
                          <a
                            href={ page.url }
                            className="flex items-center gap-2"
                          >
                            <span className="flex-1 truncate">
                              { page.title }
                            </span>

                            {/* Reserved space */ }
                            <span className="w-8 flex justify-end">
                              <span
                                role="button"
                                tabIndex={ 0 }
                                onClick={ ( e ) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openModal( "delete_page" );
                                } }
                                onKeyDown={ ( e ) => {
                                  if ( e.key === "Enter" || e.key === " " ) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openModal( "delete_page" );
                                  }
                                } }
                                className="
                                  opacity-0 group-hover/page:opacity-100
                                  transition cursor-pointer
                                  text-muted-foreground hover:text-destructive
                                "
                              >
                                <MdDelete size={ 14 } />
                              </span>
                            </span>
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
        title={ activeAction ? MODAL_TITLE[ activeAction ].title : "" }
        description={ activeAction ? MODAL_TITLE[ activeAction ].description : "" }
      >
        { activeAction === "create_module" && (
          <CreateNewModuleComponent
            closeModal={ () => setIsModalOpen( false ) }
            workspaceId={ workspaceId }
          />
        ) }

        { activeAction === "create_page" && (
          <CreateNewPageComponent
            closeModal={ () => setIsModalOpen( false ) }
            moduleId={ moduleId }
          />
        ) }

        { activeAction === "delete_module" && (
          <DeleteModuleComponent
            closeModal={ () => setIsModalOpen( false ) }
            moduleId={ moduleId }
          />
        ) }

        { activeAction === "delete_page" && (
          <DeletePageComponent
            closeModal={ () => setIsModalOpen( false ) }
            pageId={ pageId }
          />
        ) }
      </SlateModal>
    </>
  );
}
