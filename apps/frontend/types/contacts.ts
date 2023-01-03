export type IContactInfo = {
  id: string;
  email?: string;
  discord?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
};

export type IContact = {
  name: string;
  bio: string;
  contactInfo: IContactInfo;
};
