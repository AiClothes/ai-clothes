import * as crypto from 'crypto';
import * as util from 'util';
import { URLSearchParams } from 'url';
import * as qs from 'querystring';

/**
 * 不参与加签过程的 header key
 */
const HEADER_KEYS_TO_IGNORE = new Set([
  'authorization',
  // 'content-type',
  'content-length',
  'user-agent',
  'presigned-expires',
  'expect'
]);

export interface SignParams {
  headers?: Record<string, string>;
  method: string;
  query?: Record<string, any>;
  region: string;
  serviceName: string;
  accessKeyId: string;
  secretAccessKey: string;
  pathName?: string;
  needSignHeaderKeys?: string[];
  bodySha?: string;
}

export class HSSign {
  constructor() {}

  /**
   * 签名
   * @param params
   */
  sign(params: SignParams): string {
    const {
      headers = {},
      query = {},
      region = '',
      serviceName = '',
      method = '',
      pathName = '/',
      accessKeyId = '',
      secretAccessKey = '',
      needSignHeaderKeys = [],
      bodySha
    } = params;

    const datetime = headers['X-Date'];
    const shortDate = datetime.substring(0, 8); // YYYYMMDD

    console.log('datetime', datetime);
    console.log('shortDate', shortDate);

    const [signedHeaders, canonicalHeaders] = this.getSignHeaders(
      headers,
      needSignHeaderKeys
    );

    console.log('signedHeaders', signedHeaders);
    console.log('canonicalHeaders', canonicalHeaders);

    const canonicalQueryString = this.queryParamsToString(query);

    console.log('canonicalQueryString', canonicalQueryString);

    const canonicalRequest = [
      method.toUpperCase(),
      pathName,
      canonicalQueryString,
      `${canonicalHeaders}\n`,
      signedHeaders,
      bodySha || this.hash('')
    ].join('\n');

    console.log('canonicalRequest', canonicalRequest);

    console.log('canonicalRequest hash', this.hash(canonicalRequest));

    const credentialScope = [shortDate, region, serviceName, 'request'].join(
      '/'
    );
    const stringToSign = [
      'HMAC-SHA256',
      datetime,
      credentialScope,
      this.hash(canonicalRequest)
    ].join('\n');

    console.log('stringToSign', stringToSign);

    const kDate = this.hmac(`${secretAccessKey}`, shortDate);
    const kRegion = this.hmac(kDate, region);
    const kService = this.hmac(kRegion, serviceName);
    const kSigning = this.hmac(kService, 'request');

    console.log('kSigning', kSigning.toString('hex'));

    const signature = this.hmac(kSigning, stringToSign).toString('hex');

    console.log('signature', signature);

    return [
      'HMAC-SHA256',
      `Credential=${accessKeyId}/${credentialScope},`,
      `SignedHeaders=${signedHeaders},`,
      `Signature=${signature}`
    ].join(' ');
  }

  hmac(secret: any, s: string): Buffer {
    return crypto.createHmac('sha256', secret).update(s, 'utf8').digest();
  }

  hash(s: string): string {
    return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
  }

  queryParamsToString(params: Record<string, any>): string {
    return Object.keys(params)
      .sort()
      .map((key) => {
        const val = params[key];
        if (val === undefined || val === null) {
          return undefined;
        }
        const escapedKey = this.uriEscape(key);
        if (!escapedKey) {
          return undefined;
        }
        if (Array.isArray(val)) {
          return `${escapedKey}=${val.map(this.uriEscape).sort().join(`&${escapedKey}=`)}`;
        }
        return `${escapedKey}=${this.uriEscape(val)}`;
      })
      .filter((v) => v !== undefined)
      .join('&');
  }

  getSignHeaders(
    originHeaders: Record<string, string>,
    needSignHeaders: string[]
  ): [string, string] {
    const trimHeaderValue = (header: string) =>
      header.trim().replace(/\s+/g, ' ');

    let h = Object.keys(originHeaders);

    if (Array.isArray(needSignHeaders)) {
      const needSignSet = new Set(
        [...needSignHeaders, 'content-type', 'x-date', 'host'].map((k) =>
          k.toLowerCase()
        )
      );
      h = h.filter((k) => needSignSet.has(k.toLowerCase()));
    }

    h = h.filter((k) => !HEADER_KEYS_TO_IGNORE.has(k.toLowerCase()));
    const signedHeaderKeys = h
      .slice()
      .map((k) => k.toLowerCase())
      .sort()
      .join(';');
    const canonicalHeaders = h
      .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
      .map((k) => `${k.toLowerCase()}:${trimHeaderValue(originHeaders[k])}`)
      .join('\n');

    return [signedHeaderKeys, canonicalHeaders];
  }

  uriEscape(str: string): string {
    try {
      return encodeURIComponent(str)
        .replace(/[^A-Za-z0-9_.~\-%]+/g, escape)
        .replace(
          /[*]/g,
          (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
        );
    } catch (e) {
      return '';
    }
  }

  getDateTimeNow(): string {
    const now = new Date();
    return now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  }

  getBodySha(body: string | URLSearchParams | Buffer): string {
    const hash = crypto.createHash('sha256');
    if (typeof body === 'string') {
      hash.update(body);
    } else if (body instanceof URLSearchParams) {
      hash.update(body.toString());
    } else if (Buffer.isBuffer(body)) {
      hash.update(body);
    }
    return hash.digest('hex');
  }
}
