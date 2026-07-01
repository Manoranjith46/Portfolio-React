import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { getBucket } from '../../config/firebase.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Endpoint performing parallel pings to test Firestore, Storage, GitHub, and Anthropic APIs.
 */
export async function getHealthHandler(_req: Request, res: Response, _next: NextFunction) {
  const services: any[] = [];

  // 1. Check Firestore
  try {
    const start = Date.now();
    await admin.firestore().collection('healthcheck').doc('test').get();
    services.push({
      name: 'Firestore',
      status: 'ok',
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    services.push({
      name: 'Firestore',
      status: 'error',
      message: err.message || 'Firestore connection check failed',
    });
  }

  // 2. Check Storage
  try {
    const start = Date.now();
    await getBucket().exists();
    services.push({
      name: 'Firebase Storage',
      status: 'ok',
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    services.push({
      name: 'Firebase Storage',
      status: 'error',
      message: err.message || 'Storage connection check failed',
    });
  }

  // 3. Check GitHub
  try {
    const start = Date.now();
    const resGh = await fetch('https://api.github.com', { method: 'HEAD' });
    services.push({
      name: 'GitHub API',
      status: resGh.ok ? 'ok' : 'error',
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    services.push({
      name: 'GitHub API',
      status: 'error',
      message: err.message || 'GitHub ping failed',
    });
  }

  // 4. Check Anthropic
  try {
    const start = Date.now();
    const resAnt = await fetch('https://api.anthropic.com', { method: 'HEAD' });
    services.push({
      name: 'Anthropic API',
      status: resAnt.status < 500 ? 'ok' : 'error',
      latencyMs: Date.now() - start,
    });
  } catch (err: any) {
    services.push({
      name: 'Anthropic API',
      status: 'error',
      message: err.message || 'Anthropic ping failed',
    });
  }

  sendSuccess(res, {
    services,
    checkedAt: new Date().toISOString(),
  });
}
