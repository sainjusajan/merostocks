export interface IPartner {
  id: number;
  name: string;
  dmat_number: number;
  crn_number: string;
  citizenship_number: string;
  date_of_birth: any;
  contact_number: string;
  father_name: string;
  grandfather_name: string;
  account_number: string;
  account_title: string;
  email_address: string;
  beneficiary_bank: string;
}
export interface IApplicationUser {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string;
  partners: IPartner[];
}

export interface IUserId {
  id: number | null;
}
export const INIT_APPLICATION_USER: IApplicationUser = {
  email: '',
  first_name: '',
  last_name: '',
  avatar_url: '',
  partners: []
};
