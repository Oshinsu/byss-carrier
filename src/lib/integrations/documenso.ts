/**
 * DOCUMENSO — E-Signature Integration
 *
 * Open-source DocuSign alternative.
 * Handles contract signing flow for BYSS GROUP prospects.
 *
 * Flow: Upload PDF -> Create signing request -> Track status -> Webhook on completion
 * Gracefully degrades if DOCUMENSO_API_KEY is not set.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface DocumentToSign {
  title: string;
  prospectId: string;
  recipientEmail: string;
  recipientName: string;
  pdfUrl: string;
}

export interface DocumensoDocument {
  id: string;
  title: string;
  status: 'draft' | 'pending' | 'completed' | 'expired' | 'declined';
  recipientEmail: string;
  recipientName: string;
  prospectId: string;
  createdAt: string;
  completedAt: string | null;
  downloadUrl: string | null;
}

export interface DocumensoRecipient {
  email: string;
  name: string;
  role: 'SIGNER' | 'VIEWER' | 'APPROVER';
  signingOrder: number;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const DOCUMENSO_API_URL = process.env.DOCUMENSO_API_URL || 'https://app.documenso.com/api/v1';
const DOCUMENSO_API_KEY = process.env.DOCUMENSO_API_KEY || '';

function isConfigured(): boolean {
  return DOCUMENSO_API_KEY.length > 0;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isConfigured()) {
    throw new Error('[DOCUMENSO] API key not configured. Set DOCUMENSO_API_KEY env var.');
  }

  const response = await fetch(`${DOCUMENSO_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${DOCUMENSO_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`[DOCUMENSO] API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────
// FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Upload a PDF and create a signing request.
 * Returns the created document with signing URL.
 */
export async function createDocument(
  doc: DocumentToSign
): Promise<DocumensoDocument | null> {
  if (!isConfigured()) {
    console.warn('[DOCUMENSO] Not configured — returning mock document');
    return {
      id: `mock-${Date.now()}`,
      title: doc.title,
      status: 'pending',
      recipientEmail: doc.recipientEmail,
      recipientName: doc.recipientName,
      prospectId: doc.prospectId,
      createdAt: new Date().toISOString(),
      completedAt: null,
      downloadUrl: null,
    };
  }

  try {
    // Step 1: Create document
    const createResponse = await apiRequest<{ id: string }>('/documents', {
      method: 'POST',
      body: JSON.stringify({
        title: doc.title,
        externalId: doc.prospectId,
      }),
    });

    // Step 2: Upload PDF from URL
    await apiRequest(`/documents/${createResponse.id}/upload`, {
      method: 'POST',
      body: JSON.stringify({ url: doc.pdfUrl }),
    });

    // Step 3: Add recipient
    await apiRequest(`/documents/${createResponse.id}/recipients`, {
      method: 'POST',
      body: JSON.stringify({
        recipients: [
          {
            email: doc.recipientEmail,
            name: doc.recipientName,
            role: 'SIGNER',
            signingOrder: 1,
          },
        ],
      }),
    });

    // Step 4: Send for signing
    await apiRequest(`/documents/${createResponse.id}/send`, {
      method: 'POST',
    });

    return {
      id: createResponse.id,
      title: doc.title,
      status: 'pending',
      recipientEmail: doc.recipientEmail,
      recipientName: doc.recipientName,
      prospectId: doc.prospectId,
      createdAt: new Date().toISOString(),
      completedAt: null,
      downloadUrl: null,
    };
  } catch (error) {
    console.error('[DOCUMENSO] Failed to create document:', error);
    return null;
  }
}

/**
 * Check the signing status of a document.
 */
export async function getDocumentStatus(
  docId: string
): Promise<DocumensoDocument | null> {
  if (!isConfigured()) {
    console.warn('[DOCUMENSO] Not configured — returning mock status');
    return {
      id: docId,
      title: 'Mock Document',
      status: 'pending',
      recipientEmail: 'mock@example.com',
      recipientName: 'Mock User',
      prospectId: 'mock-prospect',
      createdAt: new Date().toISOString(),
      completedAt: null,
      downloadUrl: null,
    };
  }

  try {
    const response = await apiRequest<{
      id: string;
      title: string;
      status: string;
      recipients: Array<{ email: string; name: string }>;
      createdAt: string;
      completedAt: string | null;
    }>(`/documents/${docId}`);

    const recipient = response.recipients?.[0];

    return {
      id: response.id,
      title: response.title,
      status: response.status as DocumensoDocument['status'],
      recipientEmail: recipient?.email || '',
      recipientName: recipient?.name || '',
      prospectId: '',
      createdAt: response.createdAt,
      completedAt: response.completedAt,
      downloadUrl: response.completedAt
        ? `${DOCUMENSO_API_URL}/documents/${docId}/download`
        : null,
    };
  } catch (error) {
    console.error('[DOCUMENSO] Failed to get document status:', error);
    return null;
  }
}

/**
 * List all documents and their signing status.
 */
export async function listDocuments(): Promise<DocumensoDocument[]> {
  if (!isConfigured()) {
    console.warn('[DOCUMENSO] Not configured — returning mock list');
    return [
      {
        id: 'mock-1',
        title: 'Proposition Wizzee — Site Vitrine',
        status: 'completed',
        recipientEmail: 'contact@wizzee.fr',
        recipientName: 'Wizzee',
        prospectId: 'prospect-wizzee',
        createdAt: '2026-03-15T10:00:00Z',
        completedAt: '2026-03-16T14:30:00Z',
        downloadUrl: null,
      },
      {
        id: 'mock-2',
        title: 'Contrat GoodCircle — App Mobile',
        status: 'pending',
        recipientEmail: 'contact@goodcircle.fr',
        recipientName: 'GoodCircle',
        prospectId: 'prospect-goodcircle',
        createdAt: '2026-03-20T09:00:00Z',
        completedAt: null,
        downloadUrl: null,
      },
    ];
  }

  try {
    const response = await apiRequest<{
      documents: Array<{
        id: string;
        title: string;
        status: string;
        recipients: Array<{ email: string; name: string }>;
        createdAt: string;
        completedAt: string | null;
      }>;
    }>('/documents');

    return response.documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      status: doc.status as DocumensoDocument['status'],
      recipientEmail: doc.recipients?.[0]?.email || '',
      recipientName: doc.recipients?.[0]?.name || '',
      prospectId: '',
      createdAt: doc.createdAt,
      completedAt: doc.completedAt,
      downloadUrl: doc.completedAt
        ? `${DOCUMENSO_API_URL}/documents/${doc.id}/download`
        : null,
    }));
  } catch (error) {
    console.error('[DOCUMENSO] Failed to list documents:', error);
    return [];
  }
}

/**
 * Check if Documenso integration is available.
 */
export function getIntegrationStatus(): {
  configured: boolean;
  apiUrl: string;
} {
  return {
    configured: isConfigured(),
    apiUrl: DOCUMENSO_API_URL,
  };
}
