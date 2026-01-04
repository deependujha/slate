import { EntityIdentifierType, UserDataType } from "@/constants/types";
import { CreateNewModuleComponent } from "./create_new_module";
import { CreateNewPageComponent } from "./create_new_page";
import { DeleteModuleComponent } from "./delete_module";
import { DeletePageComponent } from "./delete_page";

type ActionComponentMapperType = {
	[key: string]: React.ComponentType<{
		userData: UserDataType;
		setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
		activeWorkspaceIdAndName: EntityIdentifierType;
		activeModuleIdAndName: EntityIdentifierType | null;
        activePageIdAndName: EntityIdentifierType | null;
		closeModal: () => void;
	}>;
};

export const ACTION_COMPONENT_MAPPER: ActionComponentMapperType = {
	create_module: CreateNewModuleComponent,
	create_page: CreateNewPageComponent,
	delete_module: DeleteModuleComponent,
	delete_page: DeletePageComponent,
};
