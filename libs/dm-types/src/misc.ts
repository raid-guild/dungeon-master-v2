import _ from "lodash";

// SKILLS M2M ENUM
export type Skills = {
  skill: string;
  skill_type: string;
};


export type ISkill = { skill_key: string; skill_type_key: string; member_id: string; }


export type LINK_TYPES_ENUM = [
  'SPECIFICATION',
  'RETROSPECTIVE',
  'OTHER', 
]



export type ILink ={
  application_id?: string;
  consultation_id?: string;
  id?: string;
  link: string;
  member_id?: string;
  raid_id?: string;
  type: LINK_TYPES_ENUM;

}


export function contactToURL(raidContact: any) {
  const twitterHandle = _.get(raidContact, 'contact.contactInfo.twitter');
  const githubHandle = _.get(raidContact, 'contact.contactInfo.github');
  const discordHandle = _.get(raidContact, 'contact.contactInfo.discord');
  const contactName = _.get(raidContact, 'contact.name');
  const email = _.get(raidContact, 'contact.contactInfo.email');

  if (twitterHandle) {
    return `https://twitter.com/${twitterHandle}`;
  } if (githubHandle) {
    return `https://github.com/${githubHandle}`;
  } if (discordHandle) {
    // Discord does not use a simple URL format for user profiles
    return `Discord Handle: ${discordHandle}`;
  } 
  if (email) {
    return `mailto:${email}`;
  } 
  if (contactName) {
    // Name is converted to a Google Search 
    return `https://www.google.com/search?q=${contactName}`;
  } 
    return '-';
  
}
