import { performOcr } from '../../utils/ocrService.js';
import { structureResume } from '../ai/aiService.js';
import { diffResume } from './diffEngine.js';
import { setDocument, getDocument, getAllDocuments } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';

/**
 * Runs the async background task to parse the PDF, run OCR, structure via AI, diff, and save.
 */
export async function processResumeJob(jobId: string, pdfBuffer: Buffer, adminId: string): Promise<void> {
  try {
    // 1. Run OCR (Document AI)
    const rawText = await performOcr(pdfBuffer);

    // 2. AI Structuring (Claude)
    const structured = await structureResume(rawText);

    // 3. Retrieve current database state
    const profile = (await getDocument(Collections.PORTFOLIO_PUBLISHED, 'main')) || {};
    const skills = (await getAllDocuments(Collections.SKILLS)) || [];
    const experience = (await getAllDocuments(Collections.EXPERIENCE)) || [];
    const education = (await getAllDocuments(Collections.EDUCATION)) || [];

    // 4. Calculate diff
    const diff = diffResume(structured, { profile, skills, experience, education });

    // 5. Save diff details to resumeDiffs
    await setDocument(Collections.RESUME_DIFFS, jobId, {
      jobId,
      adminId,
      extracted: structured,
      diff,
    });

    // 6. Update job status to ready
    await setDocument(
      Collections.RESUME_JOBS,
      jobId,
      {
        status: 'ready',
        updatedAt: new Date(),
      },
      true,
    );
  } catch (err: any) {
    console.error(`[Worker] Resume processing job ${jobId} failed:`, err);
    await setDocument(
      Collections.RESUME_JOBS,
      jobId,
      {
        status: 'failed',
        error: err.message || 'Unknown processing error',
        updatedAt: new Date(),
      },
      true,
    );
  }
}
