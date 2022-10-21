import { definitions } from './types';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			columns: {
				Row: {
					id: number;
					project_id: number;
					name: string;
					style: string;
					importance: number;
				};
				Insert: {
					id?: number;
					project_id: number;
					name: string;
					style: string;
					importance: number;
				};
				Update: {
					id?: number;
					project_id?: number;
					name?: string;
					style?: string;
					importance?: number;
				};
			};
			history: {
				Row: {
					id: number;
					user_id: string;
					project_id: number;
					last_used: string;
				};
				Insert: {
					id?: number;
					user_id: string;
					project_id: number;
					last_used: string;
				};
				Update: {
					id?: number;
					user_id?: string;
					project_id?: number;
					last_used?: string;
				};
			};
			perms: {
				Row: {
					id: number;
					guest_id: string;
					project_id: number;
					can_edit: boolean;
				};
				Insert: {
					id?: number;
					guest_id: string;
					project_id: number;
					can_edit: boolean;
				};
				Update: {
					id?: number;
					guest_id?: string;
					project_id?: number;
					can_edit?: boolean;
				};
			};
			projects: {
				Row: {
					id: number;
					created_at: string | null;
					name: string;
					description: string;
					user_id: string;
				};
				Insert: {
					id?: number;
					created_at?: string | null;
					name: string;
					description: string;
					user_id: string;
				};
				Update: {
					id?: number;
					created_at?: string | null;
					name?: string;
					description?: string;
					user_id?: string;
				};
			};
			tasks: {
				Row: {
					id: number;
					project_id: number;
					content: string;
					done: boolean;
					importance: number;
					column_id: number;
				};
				Insert: {
					id?: number;
					project_id: number;
					content: string;
					done: boolean;
					importance: number;
					column_id: number;
				};
				Update: {
					id?: number;
					project_id?: number;
					content?: string;
					done?: boolean;
					importance?: number;
					column_id?: number;
				};
			};
			users: {
				Row: {
					id: string;
					email: string | null;
				};
				Insert: {
					id: string;
					email?: string | null;
				};
				Update: {
					id?: string;
					email?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			edit_perm: {
				Args: { email: string; pid: number; can_edit: boolean; auth_id: string };
				Returns: definitions['perms'];
			};
			get_user_uid: {
				Args: { email: string };
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
