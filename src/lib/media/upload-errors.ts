export function describeUploadHttpError(status: number, body?: { error?: string }): string {
  if (body?.error) return body.error;
  if (status === 413) {
    return "File too large for upload. Maximum size is 50 MB. If proxied through Nginx, raise client_max_body_size.";
  }
  if (status === 401) return "Authentication required. Sign in and retry the upload.";
  if (status === 403) return "Owner clearance required for Signal Deck uploads.";
  if (status >= 500) {
    return "Upload failed on the server. Check storage permissions and application logs.";
  }
  return `Upload failed (HTTP ${status}). Check file type, size, and server storage permissions.`;
}
