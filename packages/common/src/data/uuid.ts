import * as uuidv4 from 'uuid/v4';

// Generate a url-safe base64-encoded UUID (see RFC7515, appendix C)
export function uuid() {
  const buffer = uuidv4(null, Buffer.alloc(16), 0);
  return buffer
    .toString('base64')
    .replace(/\=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
