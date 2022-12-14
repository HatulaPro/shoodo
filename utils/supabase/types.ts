/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
	'/': {
		get: {
			responses: {
				/** OK */
				200: unknown;
			};
		};
	};
	'/projects': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.projects.id'];
					created_at?: parameters['rowFilter.projects.created_at'];
					name?: parameters['rowFilter.projects.name'];
					description?: parameters['rowFilter.projects.description'];
					user_id?: parameters['rowFilter.projects.user_id'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['projects'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** projects */
					projects?: definitions['projects'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.projects.id'];
					created_at?: parameters['rowFilter.projects.created_at'];
					name?: parameters['rowFilter.projects.name'];
					description?: parameters['rowFilter.projects.description'];
					user_id?: parameters['rowFilter.projects.user_id'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.projects.id'];
					created_at?: parameters['rowFilter.projects.created_at'];
					name?: parameters['rowFilter.projects.name'];
					description?: parameters['rowFilter.projects.description'];
					user_id?: parameters['rowFilter.projects.user_id'];
				};
				body: {
					/** projects */
					projects?: definitions['projects'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/columns': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.columns.id'];
					project_id?: parameters['rowFilter.columns.project_id'];
					name?: parameters['rowFilter.columns.name'];
					style?: parameters['rowFilter.columns.style'];
					importance?: parameters['rowFilter.columns.importance'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['columns'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** columns */
					columns?: definitions['columns'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.columns.id'];
					project_id?: parameters['rowFilter.columns.project_id'];
					name?: parameters['rowFilter.columns.name'];
					style?: parameters['rowFilter.columns.style'];
					importance?: parameters['rowFilter.columns.importance'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.columns.id'];
					project_id?: parameters['rowFilter.columns.project_id'];
					name?: parameters['rowFilter.columns.name'];
					style?: parameters['rowFilter.columns.style'];
					importance?: parameters['rowFilter.columns.importance'];
				};
				body: {
					/** columns */
					columns?: definitions['columns'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/history': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.history.id'];
					user_id?: parameters['rowFilter.history.user_id'];
					project_id?: parameters['rowFilter.history.project_id'];
					last_used?: parameters['rowFilter.history.last_used'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['history'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** history */
					history?: definitions['history'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.history.id'];
					user_id?: parameters['rowFilter.history.user_id'];
					project_id?: parameters['rowFilter.history.project_id'];
					last_used?: parameters['rowFilter.history.last_used'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.history.id'];
					user_id?: parameters['rowFilter.history.user_id'];
					project_id?: parameters['rowFilter.history.project_id'];
					last_used?: parameters['rowFilter.history.last_used'];
				};
				body: {
					/** history */
					history?: definitions['history'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/tasks': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.tasks.id'];
					project_id?: parameters['rowFilter.tasks.project_id'];
					content?: parameters['rowFilter.tasks.content'];
					done?: parameters['rowFilter.tasks.done'];
					importance?: parameters['rowFilter.tasks.importance'];
					column_id?: parameters['rowFilter.tasks.column_id'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['tasks'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** tasks */
					tasks?: definitions['tasks'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.tasks.id'];
					project_id?: parameters['rowFilter.tasks.project_id'];
					content?: parameters['rowFilter.tasks.content'];
					done?: parameters['rowFilter.tasks.done'];
					importance?: parameters['rowFilter.tasks.importance'];
					column_id?: parameters['rowFilter.tasks.column_id'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.tasks.id'];
					project_id?: parameters['rowFilter.tasks.project_id'];
					content?: parameters['rowFilter.tasks.content'];
					done?: parameters['rowFilter.tasks.done'];
					importance?: parameters['rowFilter.tasks.importance'];
					column_id?: parameters['rowFilter.tasks.column_id'];
				};
				body: {
					/** tasks */
					tasks?: definitions['tasks'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/users': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.users.id'];
					email?: parameters['rowFilter.users.email'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['users'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** users */
					users?: definitions['users'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.users.id'];
					email?: parameters['rowFilter.users.email'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.users.id'];
					email?: parameters['rowFilter.users.email'];
				};
				body: {
					/** users */
					users?: definitions['users'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/perms': {
		get: {
			parameters: {
				query: {
					id?: parameters['rowFilter.perms.id'];
					guest_id?: parameters['rowFilter.perms.guest_id'];
					project_id?: parameters['rowFilter.perms.project_id'];
					can_edit?: parameters['rowFilter.perms.can_edit'];
					/** Filtering Columns */
					select?: parameters['select'];
					/** Ordering */
					order?: parameters['order'];
					/** Limiting and Pagination */
					offset?: parameters['offset'];
					/** Limiting and Pagination */
					limit?: parameters['limit'];
				};
				header: {
					/** Limiting and Pagination */
					Range?: parameters['range'];
					/** Limiting and Pagination */
					'Range-Unit'?: parameters['rangeUnit'];
					/** Preference */
					Prefer?: parameters['preferCount'];
				};
			};
			responses: {
				/** OK */
				200: {
					schema: definitions['perms'][];
				};
				/** Partial Content */
				206: unknown;
			};
		};
		post: {
			parameters: {
				body: {
					/** perms */
					perms?: definitions['perms'];
				};
				query: {
					/** Filtering Columns */
					select?: parameters['select'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** Created */
				201: unknown;
			};
		};
		delete: {
			parameters: {
				query: {
					id?: parameters['rowFilter.perms.id'];
					guest_id?: parameters['rowFilter.perms.guest_id'];
					project_id?: parameters['rowFilter.perms.project_id'];
					can_edit?: parameters['rowFilter.perms.can_edit'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
		patch: {
			parameters: {
				query: {
					id?: parameters['rowFilter.perms.id'];
					guest_id?: parameters['rowFilter.perms.guest_id'];
					project_id?: parameters['rowFilter.perms.project_id'];
					can_edit?: parameters['rowFilter.perms.can_edit'];
				};
				body: {
					/** perms */
					perms?: definitions['perms'];
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferReturn'];
				};
			};
			responses: {
				/** No Content */
				204: never;
			};
		};
	};
	'/rpc/get_user_uid': {
		post: {
			parameters: {
				body: {
					args: {
						/** Format: text */
						email: string;
					};
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferParams'];
				};
			};
			responses: {
				/** OK */
				200: unknown;
			};
		};
	};
	'/rpc/edit_perm': {
		post: {
			parameters: {
				body: {
					args: {
						/** Format: text */
						auth_id: string;
						/** Format: boolean */
						can_edit: boolean;
						/** Format: text */
						email: string;
						/** Format: bigint */
						pid: number;
					};
				};
				header: {
					/** Preference */
					Prefer?: parameters['preferParams'];
				};
			};
			responses: {
				/** OK */
				200: unknown;
			};
		};
	};
}

export interface definitions {
	projects: {
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: number;
		/**
		 * Format: timestamp with time zone
		 * @default now()
		 */
		created_at: string | null;
		/** Format: text */
		name: string;
		/** Format: text */
		description: string;
		/**
		 * Format: uuid
		 * @description Note:
		 * This is a Foreign Key to `users.id`.<fk table='users' column='id'/>
		 */
		user_id: string;
	};
	columns: {
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: number;
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Foreign Key to `projects.id`.<fk table='projects' column='id'/>
		 */
		project_id: number;
		/** Format: text */
		name: string;
		/** Format: text */
		style: string;
		/** Format: double precision */
		importance: number;
	};
	history: {
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: number;
		/**
		 * Format: uuid
		 * @description Note:
		 * This is a Foreign Key to `users.id`.<fk table='users' column='id'/>
		 */
		user_id: string;
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Foreign Key to `projects.id`.<fk table='projects' column='id'/>
		 */
		project_id: number;
		/** Format: timestamp without time zone */
		last_used: string;
	};
	tasks: {
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: number;
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Foreign Key to `projects.id`.<fk table='projects' column='id'/>
		 */
		project_id: number;
		/** Format: text */
		content: string;
		/** Format: boolean */
		done: boolean;
		/** Format: double precision */
		importance: number;
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Foreign Key to `columns.id`.<fk table='columns' column='id'/>
		 */
		column_id: number;
	};
	users: {
		/**
		 * Format: uuid
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: string;
		/** Format: text */
		email: string | null;
	};
	perms: {
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Primary Key.<pk/>
		 */
		id: number;
		/**
		 * Format: uuid
		 * @description Note:
		 * This is a Foreign Key to `users.id`.<fk table='users' column='id'/>
		 */
		guest_id: string;
		/**
		 * Format: bigint
		 * @description Note:
		 * This is a Foreign Key to `projects.id`.<fk table='projects' column='id'/>
		 */
		project_id: number;
		/** Format: boolean */
		can_edit: boolean;
	};
}

export interface parameters {
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferParams: 'params=single-object';
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferReturn: 'return=representation' | 'return=minimal' | 'return=none';
	/**
	 * @description Preference
	 * @enum {string}
	 */
	preferCount: 'count=none';
	/** @description Filtering Columns */
	select: string;
	/** @description On Conflict */
	on_conflict: string;
	/** @description Ordering */
	order: string;
	/** @description Limiting and Pagination */
	range: string;
	/**
	 * @description Limiting and Pagination
	 * @default items
	 */
	rangeUnit: string;
	/** @description Limiting and Pagination */
	offset: string;
	/** @description Limiting and Pagination */
	limit: string;
	/** @description projects */
	'body.projects': definitions['projects'];
	/** Format: bigint */
	'rowFilter.projects.id': string;
	/** Format: timestamp with time zone */
	'rowFilter.projects.created_at': string;
	/** Format: text */
	'rowFilter.projects.name': string;
	/** Format: text */
	'rowFilter.projects.description': string;
	/** Format: uuid */
	'rowFilter.projects.user_id': string;
	/** @description columns */
	'body.columns': definitions['columns'];
	/** Format: bigint */
	'rowFilter.columns.id': string;
	/** Format: bigint */
	'rowFilter.columns.project_id': string;
	/** Format: text */
	'rowFilter.columns.name': string;
	/** Format: text */
	'rowFilter.columns.style': string;
	/** Format: double precision */
	'rowFilter.columns.importance': string;
	/** @description history */
	'body.history': definitions['history'];
	/** Format: bigint */
	'rowFilter.history.id': string;
	/** Format: uuid */
	'rowFilter.history.user_id': string;
	/** Format: bigint */
	'rowFilter.history.project_id': string;
	/** Format: timestamp without time zone */
	'rowFilter.history.last_used': string;
	/** @description tasks */
	'body.tasks': definitions['tasks'];
	/** Format: bigint */
	'rowFilter.tasks.id': string;
	/** Format: bigint */
	'rowFilter.tasks.project_id': string;
	/** Format: text */
	'rowFilter.tasks.content': string;
	/** Format: boolean */
	'rowFilter.tasks.done': string;
	/** Format: double precision */
	'rowFilter.tasks.importance': string;
	/** Format: bigint */
	'rowFilter.tasks.column_id': string;
	/** @description users */
	'body.users': definitions['users'];
	/** Format: uuid */
	'rowFilter.users.id': string;
	/** Format: text */
	'rowFilter.users.email': string;
	/** @description perms */
	'body.perms': definitions['perms'];
	/** Format: bigint */
	'rowFilter.perms.id': string;
	/** Format: uuid */
	'rowFilter.perms.guest_id': string;
	/** Format: bigint */
	'rowFilter.perms.project_id': string;
	/** Format: boolean */
	'rowFilter.perms.can_edit': string;
}

export interface operations {}

export interface external {}
