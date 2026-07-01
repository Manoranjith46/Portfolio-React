import { Request, Response, NextFunction } from 'express';
import {
  getPublicProfile,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
  getPublicProjects,
} from './portfolioService.js';
import { sendSuccess } from '../../utils/response.js';

export async function getProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    const profile = await getPublicProfile(adminId);
    sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function getSkillsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    const skills = await getPublicSkills(adminId);
    sendSuccess(res, skills);
  } catch (err) {
    next(err);
  }
}

export async function getExperienceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    const experience = await getPublicExperience(adminId);
    sendSuccess(res, experience);
  } catch (err) {
    next(err);
  }
}

export async function getEducationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    const education = await getPublicEducation(adminId);
    sendSuccess(res, education);
  } catch (err) {
    next(err);
  }
}

export async function getProjectsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    const projects = await getPublicProjects(adminId);
    sendSuccess(res, projects);
  } catch (err) {
    next(err);
  }
}
