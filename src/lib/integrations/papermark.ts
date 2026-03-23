/**
 * PAPERMARK — Document Analytics Integration
 *
 * Open-source DocSend alternative.
 * Tracks how prospects engage with shared documents:
 * views, read time, page-by-page analytics.
 *
 * Every proposal becomes intelligence.
 * Gracefully degrades if PAPERMARK_API_KEY is not set.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SharedDocument {
  id: string;
  name: string;
  url: string;
  views: number;
  avgReadTime: number;
  lastViewed: string;
}

export interface PageAnalytics {
  pageNumber: number;
  views: number;
  avgDuration: number;
  dropOffRate: number;
}

export interface DocumentAnalytics {
  id: string;
  name: string;
  totalViews: number;
  uniqueViews: number;
  avgReadTime: number;
  completionRate: number;
  lastViewed: string | null;
  pages: PageAnalytics[];
  viewerBreakdown: ViewerInfo[];
}

export interface ViewerInfo {
  email: string | null;
  viewedAt: string;
  duration: number;
  completionRate: number;
  location: string | null;
  device: string | null;
}

export interface SharingLink {
  id: string;
  url: string;
  documentId: string;
  prospectId: string;
  password: string | null;
  expiresAt: string | null;
  emailRequired: boolean;
  allowDownload: boolean;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const PAPERMARK_API_URL =
  process.env.PAPERMARK_API_URL || 'https://api.papermark.io/api/v1';
const PAPERMARK_API_KEY = process.env.PAPERMARK_API_KEY || '';

function isConfigured(): boolean {
  return PAPERMARK_API_KEY.length > 0;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isConfigured()) {
    throw new Error(
      '[PAPERMARK] API key not configured. Set PAPERMARK_API_KEY env var.'
    );
  }

  const response = await fetch(`${PAPERMARK_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAPERMARK_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`[PAPERMARK] API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────
// FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Share a document with tracked analytics.
 * Creates a Papermark link that captures view data.
 */
export async function shareDocument(
  name: string,
  url: string,
  prospectId: string,
  options?: {
    emailRequired?: boolean;
    password?: string;
    expiresAt?: string;
    allowDownload?: boolean;
  }
): Promise<SharingLink | null> {
  if (!isConfigured()) {
    console.warn('[PAPERMARK] Not configured — returning mock sharing link');
    const mockId = `mock-${Date.now()}`;
    return {
      id: mockId,
      url: `https://papermark.io/view/${mockId}`,
      documentId: mockId,
      prospectId,
      password: options?.password || null,
      expiresAt: options?.expiresAt || null,
      emailRequired: options?.emailRequired ?? true,
      allowDownload: options?.allowDownload ?? false,
    };
  }

  try {
    // Step 1: Create document in Papermark
    const docResponse = await apiRequest<{ id: string }>('/documents', {
      method: 'POST',
      body: JSON.stringify({
        name,
        url,
        type: 'pdf',
      }),
    });

    // Step 2: Create sharing link with tracking options
    const linkResponse = await apiRequest<{
      id: string;
      url: string;
    }>(`/documents/${docResponse.id}/links`, {
      method: 'POST',
      body: JSON.stringify({
        emailProtected: options?.emailRequired ?? true,
        password: options?.password || null,
        expiresAt: options?.expiresAt || null,
        allowDownload: options?.allowDownload ?? false,
      }),
    });

    return {
      id: linkResponse.id,
      url: linkResponse.url,
      documentId: docResponse.id,
      prospectId,
      password: options?.password || null,
      expiresAt: options?.expiresAt || null,
      emailRequired: options?.emailRequired ?? true,
      allowDownload: options?.allowDownload ?? false,
    };
  } catch (error) {
    console.error('[PAPERMARK] Failed to share document:', error);
    return null;
  }
}

/**
 * Get detailed analytics for a shared document.
 * Includes views, read time, page-by-page data, and viewer info.
 */
export async function getDocumentAnalytics(
  docId: string
): Promise<DocumentAnalytics | null> {
  if (!isConfigured()) {
    console.warn('[PAPERMARK] Not configured — returning mock analytics');
    return {
      id: docId,
      name: 'Mock Proposal — BYSS GROUP',
      totalViews: 12,
      uniqueViews: 4,
      avgReadTime: 185,
      completionRate: 0.73,
      lastViewed: new Date().toISOString(),
      pages: [
        { pageNumber: 1, views: 12, avgDuration: 45, dropOffRate: 0.0 },
        { pageNumber: 2, views: 11, avgDuration: 38, dropOffRate: 0.08 },
        { pageNumber: 3, views: 10, avgDuration: 52, dropOffRate: 0.09 },
        { pageNumber: 4, views: 8, avgDuration: 30, dropOffRate: 0.2 },
        { pageNumber: 5, views: 7, avgDuration: 20, dropOffRate: 0.13 },
      ],
      viewerBreakdown: [
        {
          email: 'prospect@example.com',
          viewedAt: new Date().toISOString(),
          duration: 210,
          completionRate: 1.0,
          location: 'Fort-de-France, MQ',
          device: 'Desktop',
        },
      ],
    };
  }

  try {
    const response = await apiRequest<{
      id: string;
      name: string;
      views: Array<{
        viewerEmail: string | null;
        viewedAt: string;
        totalDuration: number;
        completionRate: number;
        geo: { city: string; country: string } | null;
        device: string | null;
        viewedPages: Array<{
          pageNumber: number;
          duration: number;
        }>;
      }>;
    }>(`/documents/${docId}`);

    const views = response.views || [];
    const totalViews = views.length;
    const uniqueEmails = new Set(views.filter((v) => v.viewerEmail).map((v) => v.viewerEmail));
    const avgReadTime =
      totalViews > 0
        ? views.reduce((sum, v) => sum + v.totalDuration, 0) / totalViews
        : 0;
    const completionRate =
      totalViews > 0
        ? views.reduce((sum, v) => sum + v.completionRate, 0) / totalViews
        : 0;

    // Aggregate page analytics
    const pageMap = new Map<number, { views: number; totalDuration: number }>();
    views.forEach((view) => {
      (view.viewedPages || []).forEach((page) => {
        const existing = pageMap.get(page.pageNumber) || {
          views: 0,
          totalDuration: 0,
        };
        existing.views += 1;
        existing.totalDuration += page.duration;
        pageMap.set(page.pageNumber, existing);
      });
    });

    const pages: PageAnalytics[] = Array.from(pageMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([pageNumber, data], index, arr) => ({
        pageNumber,
        views: data.views,
        avgDuration: data.views > 0 ? Math.round(data.totalDuration / data.views) : 0,
        dropOffRate:
          index > 0
            ? Math.max(0, 1 - data.views / (arr[index - 1]?.[1]?.views || data.views))
            : 0,
      }));

    return {
      id: response.id,
      name: response.name,
      totalViews,
      uniqueViews: uniqueEmails.size,
      avgReadTime: Math.round(avgReadTime),
      completionRate: Math.round(completionRate * 100) / 100,
      lastViewed: views.length > 0 ? views[views.length - 1].viewedAt : null,
      pages,
      viewerBreakdown: views.map((v) => ({
        email: v.viewerEmail,
        viewedAt: v.viewedAt,
        duration: v.totalDuration,
        completionRate: v.completionRate,
        location: v.geo ? `${v.geo.city}, ${v.geo.country}` : null,
        device: v.device,
      })),
    };
  } catch (error) {
    console.error('[PAPERMARK] Failed to get analytics:', error);
    return null;
  }
}

/**
 * List all shared documents with summary stats.
 */
export async function listSharedDocuments(): Promise<SharedDocument[]> {
  if (!isConfigured()) {
    console.warn('[PAPERMARK] Not configured — returning mock documents');
    return [
      {
        id: 'mock-pm-1',
        name: 'Proposition Technique — Wizzee',
        url: 'https://papermark.io/view/mock-pm-1',
        views: 8,
        avgReadTime: 195,
        lastViewed: '2026-03-20T14:30:00Z',
      },
      {
        id: 'mock-pm-2',
        name: 'Audit IA — Digicel Martinique',
        url: 'https://papermark.io/view/mock-pm-2',
        views: 3,
        avgReadTime: 120,
        lastViewed: '2026-03-19T10:15:00Z',
      },
      {
        id: 'mock-pm-3',
        name: 'Roadmap BYSS GROUP 2026',
        url: 'https://papermark.io/view/mock-pm-3',
        views: 15,
        avgReadTime: 340,
        lastViewed: '2026-03-21T16:45:00Z',
      },
    ];
  }

  try {
    const response = await apiRequest<{
      documents: Array<{
        id: string;
        name: string;
        links: Array<{ url: string }>;
        _count: { views: number };
        views: Array<{ totalDuration: number; viewedAt: string }>;
      }>;
    }>('/documents');

    return response.documents.map((doc) => {
      const views = doc.views || [];
      const avgReadTime =
        views.length > 0
          ? Math.round(
              views.reduce((sum, v) => sum + v.totalDuration, 0) / views.length
            )
          : 0;

      return {
        id: doc.id,
        name: doc.name,
        url: doc.links?.[0]?.url || '',
        views: doc._count?.views || views.length,
        avgReadTime,
        lastViewed:
          views.length > 0
            ? views[views.length - 1].viewedAt
            : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('[PAPERMARK] Failed to list documents:', error);
    return [];
  }
}

/**
 * Check if Papermark integration is available.
 */
export function getIntegrationStatus(): {
  configured: boolean;
  apiUrl: string;
} {
  return {
    configured: isConfigured(),
    apiUrl: PAPERMARK_API_URL,
  };
}
