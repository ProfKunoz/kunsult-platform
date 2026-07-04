/**
 * FOUNDATION STORAGE SERVICE
 *
 * Evidence Engine and Report Engine both need to store files. Without this,
 * each engine picks its own blob provider and its own URL convention, and
 * migrating storage later means touching every engine instead of one
 * provider file.
 *
 * SPRINT 1 SCOPE: no real provider wired (Vercel Blob, S3, etc. — pick
 * one and implement StorageProvider below; see README integration steps).
 * The in-memory stub lets routes and tests run without a live bucket.
 * Engines call registerFile()/getDownloadUrl() — never a provider SDK
 * directly.
 */

export interface StorageProvider {
  registerFile(params: { tenantId: string; fileName: string; mimeType?: string; contentBase64?: string }): Promise<string>; // returns storageUrl
  getDownloadUrl(storageUrl: string): Promise<string>;
}

class StubStorageProvider implements StorageProvider {
  async registerFile(params: { tenantId: string; fileName: string }): Promise<string> {
    // Deterministic fake URL so repeated calls in tests/dev are stable.
    return `stub://${params.tenantId}/${Date.now()}-${params.fileName}`;
  }

  async getDownloadUrl(storageUrl: string): Promise<string> {
    return storageUrl;
  }
}

// Swap this for a real provider (e.g. new VercelBlobStorageProvider()) when
// wiring actual file storage — every call site stays the same.
export const storageService: StorageProvider = new StubStorageProvider();
