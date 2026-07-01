import admin from 'firebase-admin';
import { env } from '../config/env.js';

/**
 * Parses a PDF buffer using Google Document AI REST API.
 * Falls back to high-quality mockup text if credentials are not configured.
 */
export async function performOcr(pdfBuffer: Buffer): Promise<string> {
  if (!env.GOOGLE_DOCUMENT_AI_PROJECT || !env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID) {
    console.warn('[OCR] Google Document AI credentials missing. Falling back to mock OCR text.');
    return getMockOcrText();
  }

  try {
    // Retrieve authentication token using firebase-admin credential options
    const credential = admin.app().options.credential;
    if (!credential) {
      throw new Error('Firebase credentials not loaded');
    }
    const tokenObj = await (credential as any).getAccessToken();
    const token = tokenObj.access_token;

    const projectId = env.GOOGLE_DOCUMENT_AI_PROJECT;
    const processorId = env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID;
    const location = 'us'; // Default location

    const url = `https://${location}-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawDocument: {
          content: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API returned status: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.document?.text || '';
  } catch (err) {
    console.error('[OCR] Google Document AI API call failed, using mock fallback:', err);
    return getMockOcrText();
  }
}

function getMockOcrText(): string {
  return `
  MANORANJITH DHANAPAL
  Email: manoranjithd46@gmail.com | Phone: +919876543210
  Website: https://github.com/Manoranjith46

  SUMMARY
  Dedicated MERN stack developer specialized in creating high-quality SaaS applications and responsive user interfaces. Extensive experience with TypeScript, React, NodeJS, and Cloud Databases.

  SKILLS
  - Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
  - Languages: JavaScript, TypeScript, Python
  - Backend: NodeJS, Express, REST APIs
  - Databases: Firestore, MongoDB

  EXPERIENCE
  Innovative Software Ltd - Full Stack Engineer (2024-01-01 to Present)
  Developed and optimized user interfaces and document parsing microservices. Reduced latency by 20% on core APIs.

  EDUCATION
  Anna University - Bachelor of Engineering in Computer Science (2023 Passing Year)

  CERTIFICATIONS
  Google Cloud Professional Architect - Google Cloud (2025)
  `;
}
