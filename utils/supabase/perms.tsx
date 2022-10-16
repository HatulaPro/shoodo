export type Perm = {
	id: number;
	guest_id: string;
	project_id: number;
	can_edit: boolean;
	user: { id: string; email: string };
};
