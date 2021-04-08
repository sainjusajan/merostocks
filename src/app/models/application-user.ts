export interface IApplicationUser {
  id: number | null;
  is_superuser: boolean | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_staff: boolean | null;
  is_active: boolean | null;
}

export interface IUserId {
  id: number | null;
}
export const INIT_APPLICATION_USER: IApplicationUser = {
  id: null,
  is_superuser: null,
  username: ``,
  first_name: '',
  last_name: '',
  email: '',
  is_staff: null,
  is_active: null,
};
