export interface Users42
{
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	url: string;
	phone: string,
	displayname: string;
	image_url: string;
	staff?: boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string;
	wallet: number;
	groups: any[];
	cursus_users: any[];
	projects_users: any[];
	languages_users: any[];
	achievements: any[];
	titles: any[];
	titles_users: any[];
	partnerships: any[];
	patroned: any[];
	patroning: any[];
	expertises_users: any[];
	campus: any[];
	campus_users: any[];
}
