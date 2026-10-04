export const CATALOG_BUCKET = "appelectric-510209-uploads";
import { CATALOG_CHUNK_BYTES, CATALOG_MAX_BYTES } from "@/lib/catalogLimits";

export { CATALOG_CHUNK_BYTES, CATALOG_MAX_BYTES };
export const CATALOG_MAX_CHUNKS = Math.ceil(CATALOG_MAX_BYTES / CATALOG_CHUNK_BYTES);

export function isValidUploadId(id: string): boolean {
  return /^[a-z0-9-]{8,80}$/.test(id);
}
