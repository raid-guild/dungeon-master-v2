export type IContact = {
  id?: string;
  name: string;
  bio: string;
  contactInfo: IContactInfo;
};

export type IContactInfo = {
  id?: string;
  email?: string;
  discord?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
};

