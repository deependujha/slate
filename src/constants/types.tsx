export type UserDataType = {
	workspaces: Array<{
		id: string;
		name: string;
		modules: Array<{
			id: string;
			name: string;
			pages: Array<{
				id: string;
				title: string;
				type: string;
				createdAt: string;
				updatedAt: string;
			}>;
		}>;
	}>;
};

export type EntityIdentifierType = {
	id: string;
	name: string;
};

export type ModulesAndPagesTypes = {
	module_id: string;
	name: string;
	pages: Array<{
		page_id: string;
		name: string;
	}>;
};
