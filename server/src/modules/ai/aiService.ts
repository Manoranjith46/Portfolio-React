import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env.js';

// Enforce Zod schema strictly for Resume Structuring
export const ResumeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.object({ name: z.string(), category: z.string() })),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      year: z.string(),
    }),
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.string(),
    }),
  ).optional(),
  links: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }).optional(),
});

export type Resume = z.infer<typeof ResumeSchema>;

// Enforce Zod schema for Project Summary
export const ProjectSummarySchema = z.object({
  overview: z.string(),
  features: z.array(z.string()),
  techStack: z.array(z.string()),
  challenges: z.string(),
  learningOutcomes: z.string(),
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;

let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
  if (!env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

/**
 * structureResume extracts structured resume content from raw OCR text using Claude.
 */
export async function structureResume(ocrText: string): Promise<Resume> {
  const client = getAnthropicClient();
  if (!client) {
    console.warn('[AI] ANTHROPIC_API_KEY not configured. Returning mocked structured resume.');
    return getMockStructuredResume();
  }

  const prompt = `You are a resume parser. Extract structured data from the following resume text.
Respond ONLY with valid JSON matching this schema. No markdown, no explanation, no preamble.
Schema:
{
  "name": "string",
  "email": "string (email format)",
  "phone": "string (optional)",
  "summary": "string",
  "skills": [{"name": "string", "category": "string"}],
  "experience": [{"company": "string", "role": "string", "startDate": "string", "endDate": "string (optional)", "description": "string"}],
  "education": [{"institution": "string", "degree": "string", "field": "string", "year": "string"}],
  "certifications": [{"name": "string", "issuer": "string", "year": "string"}],
  "links": {"github": "string (url)", "linkedin": "string (url)", "portfolio": "string (url)"}
}

Resume text:
${ocrText}`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: 'You are a precise data extraction assistant. Respond ONLY with valid JSON. No markdown fences, no explanation, no preamble. If you cannot extract a field, use null or omit it.',
      messages: [{ role: 'user', content: prompt }],
    });

    const textResponse = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return ResumeSchema.parse(parsed);
  } catch (err) {
    console.error('[AI] Claude structuring failed, retrying once...', err);
    // Retry once with stricter prompt
    return structureResumeRetry(ocrText);
  }
}

async function structureResumeRetry(ocrText: string): Promise<Resume> {
  const client = getAnthropicClient()!;
  const prompt = `Convert the following OCR text to a STRICT valid JSON. Double check syntax.
Text: ${ocrText}`;

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    system: 'Return only valid JSON. Do not write anything else. Zero conversational padding.',
    messages: [{ role: 'user', content: prompt }],
  });

  const textResponse = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  return ResumeSchema.parse(parsed);
}

/**
 * generateProjectSummary analyzes a readme to generate a standard project summary.
 */
export async function generateProjectSummary(
  readme: string,
  repoName: string,
  languages: string[],
): Promise<ProjectSummary> {
  const client = getAnthropicClient();
  if (!client) {
    console.warn('[AI] ANTHROPIC_API_KEY not configured. Returning mocked project summary.');
    return {
      overview: `A portfolio management platform built for ${repoName} utilizing ${languages.join(', ')}.`,
      features: ['Secure local authentication', 'Automated resume parsing pipeline', 'In-memory caching'],
      techStack: languages,
      challenges: 'Managing asynchronous document processing pipelines with state synchronization.',
      learningOutcomes: 'Developed clean modular design patterns in Express and TypeScript.',
    };
  }

  const prompt = `Generate a project summary for the GitHub repository: ${repoName} (Languages: ${languages.join(', ')}).
Analyze this README text:
${readme}`;

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: 'You are a technical project assistant. Respond ONLY with valid JSON. Schema: { overview: string, features: string[], techStack: string[], challenges: string, learningOutcomes: string }',
    messages: [{ role: 'user', content: prompt }],
  });

  const textResponse = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  return ProjectSummarySchema.parse(parsed);
}

/**
 * classifyVersionChange classifies changes between snapshots as major or minor.
 */
export async function classifyVersionChange(before: any, after: any): Promise<'major' | 'minor'> {
  // Returns major if hero section, experience, or projects changed significantly.
  // In-process classification can check simple structural changes as a fallback.
  const profileChanged = JSON.stringify(before.profile) !== JSON.stringify(after.profile);
  const projectsChanged = JSON.stringify(before.projects) !== JSON.stringify(after.projects);
  const experienceChanged = JSON.stringify(before.experience) !== JSON.stringify(after.experience);

  if (profileChanged || projectsChanged || experienceChanged) {
    return 'major';
  }
  return 'minor';
}

/**
 * improveDescription rewrites descriptions professionally.
 */
export async function improveDescription(text: string, context: string): Promise<string> {
  const client = getAnthropicClient();
  if (!client) {
    return `Improved description for ${context}: ${text}`;
  }

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: `You are a professional CV and resume copywriter. Rewrite this description for a ${context} to be action-oriented, professional, and impact-driven. Return ONLY the rewritten text with no quotes or padding.`,
    messages: [{ role: 'user', content: text }],
  });

  const textResponse = response.content[0].type === 'text' ? response.content[0].text : '';
  return textResponse.trim();
}

/**
 * Returns dummy resume mock structure for local offline test.
 */
function getMockStructuredResume(): Resume {
  return {
    name: 'Manoranjith Dhanapal',
    email: 'manoranjithd46@gmail.com',
    phone: '+919876543210',
    summary: 'MERN stack developer specialized in creating high-quality SaaS applications and responsive user interfaces.',
    skills: [
      { name: 'React', category: 'Frontend' },
      { name: 'TypeScript', category: 'Languages' },
      { name: 'NodeJS', category: 'Backend' },
      { name: 'Firestore', category: 'Databases' },
    ],
    experience: [
      {
        company: 'Innovative Software Ltd',
        role: 'Full Stack Engineer',
        startDate: '2024-01-01',
        description: 'Developed and optimized user interfaces and document parsing microservices.',
      },
    ],
    education: [
      {
        institution: 'Anna University',
        degree: 'Bachelor of Engineering',
        field: 'Computer Science',
        year: '2023',
      },
    ],
    certifications: [
      {
        name: 'Google Cloud Professional Architect',
        issuer: 'Google Cloud',
        year: '2025',
      },
    ],
    links: {
      github: 'https://github.com/Manoranjith46',
      linkedin: 'https://linkedin.com/in/manoranjith',
    },
  };
}
