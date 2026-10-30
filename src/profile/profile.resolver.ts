import { Query, Resolver, Parent, ResolveField } from '@nestjs/graphql';
import type {
  Profile,
  Skill,
  ProfessionalLink,
  Project,
  Experience,
} from '../generated/prisma/client.js';
import { ProfileModel } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';
import { SkillModel } from './models/skill.model.js';
import { ProfessionalLinkModel } from './models/professional-link.model.js';
import { ProjectModel } from './models/project.model.js';
import { ExperienceModel } from './models/experience.model.js';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { name: 'profile', nullable: true })
  getProfile(): Promise<Profile | null> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [SkillModel])
  skills(@Parent() profile: Profile): Promise<Skill[]> {
    return this.profileService.getSkills(profile.id);
  }

  @ResolveField(() => [ProfessionalLinkModel])
  links(@Parent() profile: Profile): Promise<ProfessionalLink[]> {
    return this.profileService.getLinks(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() profile: Profile): Promise<Project[]> {
    return this.profileService.getProjects(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  experience(@Parent() profile: Profile): Promise<Experience[]> {
    return this.profileService.getExperience(profile.id);
  }
}
