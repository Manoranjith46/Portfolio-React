import { Request, Response, NextFunction } from 'express';
import { getDocument, setDocument } from '../../utils/firestoreService.js';
import { Collections, DocIds } from '../../types/collections.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';
import { auditLog } from '../../utils/auditLog.js';

const DEFAULT_SETTINGS = {
  seo: {
    pageTitle: 'Manoranjith Dhanapal - Portfolio',
    metaDescription: 'Personal portfolio of Manoranjith Dhanapal, Full Stack Web Developer.',
    ogImage: '',
    canonicalUrl: 'https://manoranjithd.vercel.app',
  },
  socialLinks: {
    github: 'https://github.com/Manoranjith46',
    linkedin: 'https://www.linkedin.com/in/manoranjith-d/',
    whatsapp: 'https://wa.me/919025199507',
  },
  contact: {
    email: 'manoranjithd46@gmail.com',
    phone: '+91 90251 99507',
    location: 'Omalur, Salem, TamilNadu-636011',
    enableContactForm: true,
  },
  featureFlags: {
    showBlog: false,
    showCertifications: true,
    showAnalytics: true,
    enableContactForm: true,
    showResumeDownload: true,
    showTestimonials: false,
    maintenanceMode: false,
  },
  theme: {
    primaryColor: '#0052cc',
    accentColor: '#00cc88',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    animationSpeed: '0.3s',
    mode: 'dark',
  },
  analyticsEnabled: true,
};

export async function getSettingsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await getDocument<any>(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL);
    sendSuccess(res, settings || DEFAULT_SETTINGS);
  } catch (err) {
    next(err);
  }
}

export async function updateSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const updates = req.body;
    const settings = (await getDocument<any>(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL)) || DEFAULT_SETTINGS;

    const newSettings = {
      ...settings,
      ...updates,
      seo: { ...settings.seo, ...updates.seo },
      socialLinks: { ...settings.socialLinks, ...updates.socialLinks },
      contact: { ...settings.contact, ...updates.contact },
      featureFlags: { ...settings.featureFlags, ...updates.featureFlags },
      theme: { ...settings.theme, ...updates.theme },
      updatedAt: new Date(),
    };

    await setDocument(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL, newSettings);
    await auditLog('SETTINGS_UPDATED', updates, 'admin', adminId);

    sendSuccess(res, newSettings);
  } catch (err) {
    next(err);
  }
}

export async function updateThemeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const themeUpdates = req.body;
    const settings = (await getDocument<any>(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL)) || DEFAULT_SETTINGS;

    const newSettings = {
      ...settings,
      theme: { ...settings.theme, ...themeUpdates },
      updatedAt: new Date(),
    };

    await setDocument(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL, newSettings);
    await auditLog('THEME_CHANGED', themeUpdates, 'admin', adminId);

    sendSuccess(res, newSettings.theme);
  } catch (err) {
    next(err);
  }
}
