import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SkillModel } from './skill.model.js';
import { ProfessionalLinkModel } from './professional-link.model.js';
import { ProjectModel } from './project.model.js';
import { ExperienceModel } from './experience.model.js';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => [SkillModel])
  skills: SkillModel[];

  @Field(() => [ProfessionalLinkModel])
  links: ProfessionalLinkModel[];

  @Field(() => [ProjectModel])
  projects: ProjectModel[];

  @Field(() => [ExperienceModel])
  experience: ExperienceModel[];
}
