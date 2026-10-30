import { Injectable } from '@nestjs/common';
import type {
  Profile,
  Skill,
  ProfessionalLink,
  Project,
  Experience,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PROFILE_ID } from './profile.constants.js';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { id: PROFILE_ID },
    });
  }

  getSkills(profileId: string): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  getLinks(profileId: string): Promise<ProfessionalLink[]> {
    return this.prisma.professionalLink.findMany({
      where: { profileId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  getProjects(profileId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  getExperience(profileId: string): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
