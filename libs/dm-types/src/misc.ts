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