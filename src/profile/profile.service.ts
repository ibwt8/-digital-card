import { Injectable } from '@nestjs/common';
import type {
  Profile,
  Skill,
  ProfessionalLink,
  Project,
  Experience,
} from '../generated/prisma/client.js';
import { ProfileRepository } from './profile.repository.js';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  getProfile(): Promise<Profile | null> {
    return this.repository.getProfile();
  }

  getSkills(profileId: string): Promise<Skill[]> {
    return this.repository.getSkills(profileId);
  }

  getLinks(profileId: string): Promise<ProfessionalLink[]> {
    return this.repository.getLinks(profileId);
  }

  getProjects(profileId: string): Promise<Project[]> {
    return this.repository.getProjects(profileId);
  }

  getExperience(profileId: string): Promise<Experience[]> {
    return this.repository.getExperience(profileId);
  }
}
