import jsonpatch from 'fast-json-patch';

/**
 * Creates an RFC 6902 JSON Patch comparing two states.
 */
export function createPatch(before: any, after: any): any[] {
  return jsonpatch.compare(before, after);
}

/**
 * Applies a JSON Patch to reconstruct a state.
 */
export function applyPatch(before: any, patch: any[]): any {
  const result = jsonpatch.applyPatch(before, patch);
  return result.newDocument;
}
