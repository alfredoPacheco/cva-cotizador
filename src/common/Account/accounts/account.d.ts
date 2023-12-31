import type { Models } from 'appwrite';

export interface AccountDto extends Models.User<Models.Preferences> {
  roles: any; // used locally to map roles to labels
}
