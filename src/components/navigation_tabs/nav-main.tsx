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

const MODAL_META: Record<
  ModalAction,
  { title: string; description: string }
> = {
  create_module: {
    title: "Create new module",
    description: "Modules help organize related pages.",
  },
  create_page: {
    title: "Create new page",
    description: "Pages are individual documents inside a module.",
  },
  delete_module: {
    title: "Delete module",
    description: "This will remove the module and all its pages.",
  },
  delete_page: {
    title: "Delete page",
    description: "This action cannot be undone.",
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
  const [ modalOpen, setModalOpen ] = useState( false );
  const [ action, setAction ] = useState<ModalAction | null>( null );

  const openModal = ( next: ModalAction ) => {
    setAction( next );
    setModalOpen( true );
  };

  return (
    <>
      {/* ================= Sidebar Group ================= */ }
      <SidebarGroup className="flex h-full flex-col">
        {/* ---------- Header ---------- */ }
        <div className="flex items-center justify-between shrink-0 px-1">
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
            className="cursor-pointer opacity-70 transition hover:opacity-100"
          >
            <IoAddCircleOutline size={ 16 } />
          </span>
        </div>

        {/* ---------- Scrollable Modules ---------- */ }
        <div className="mt-2 flex-1 overflow-y-auto no-scrollbar">
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

                      {/* Right actions */ }
                      <div className="ml-auto flex w-16 items-center justify-end gap-2">
                        <span
                          role="button"
                          tabIndex={ 0 }
                          onClick={ ( e ) => {
                            e.stopPropagation();
                            openModal( "create_page" );
                          } }
                          className="cursor-pointer opacity-0 transition group-hover/module:opacity-100 text-muted-foreground hover:text-foreground"
                        >
                          <IoAddCircleOutline size={ 16 } />
                        </span>

                        <span
                          role="button"
                          tabIndex={ 0 }
                          onClick={ ( e ) => {
                            e.stopPropagation();
                            openModal( "delete_module" );
                          } }
                          className="cursor-pointer opacity-0 transition group-hover/module:opacity-100 text-muted-foreground hover:text-destructive"
                        >
                          <MdDelete size={ 16 } />
                        </span>

                        <ChevronRight
                          className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                        />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* ---------- Pages ---------- */ }
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

                              <span className="w-8 flex justify-end">
                                <span
                                  role="button"
                                  tabIndex={ 0 }
                                  onClick={ ( e ) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openModal( "delete_page" );
                                  } }
                                  className="cursor-pointer opacity-0 transition group-hover/page:opacity-100 text-muted-foreground hover:text-destructive"
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
        </div>
      </SidebarGroup>

      {/* ================= Modal ================= */ }
      <SlateModal
        open={ modalOpen }
        onOpenChange={ setModalOpen }
        title={ action ? MODAL_META[ action ].title : "" }
        description={ action ? MODAL_META[ action ].description : "" }
      >
        { action === "create_module" && (
          <CreateNewModuleComponent
            workspaceId={ workspaceId }
            closeModal={ () => setModalOpen( false ) }
          />
        ) }

        { action === "create_page" && (
          <CreateNewPageComponent
            moduleId={ moduleId }
            closeModal={ () => setModalOpen( false ) }
          />
        ) }

        { action === "delete_module" && (
          <DeleteModuleComponent
            moduleId={ moduleId }
            closeModal={ () => setModalOpen( false ) }
          />
        ) }

        { action === "delete_page" && (
          <DeletePageComponent
            pageId={ pageId }
            closeModal={ () => setModalOpen( false ) }
          />
        ) }
      </SlateModal>
    </>
  );
}
