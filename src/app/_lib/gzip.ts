import { createGzip, createGunzip } from "node:zlib";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { Buffer } from "node:buffer";

const gzip = promisify(pipeline);
const gunzip = promisify(pipeline);

export async function gzipAndEncode(data: string): Promise<string> {
  const gzipStream = createGzip();
  const bufferStream = Buffer.from(data);

  const chunks: Buffer[] = [];
  const stream = new (require("stream").Readable)();
  stream.push(bufferStream);
  stream.push(null);

  await gzip(
    stream,
    gzipStream,
    new (require("stream").Writable)({
      write(chunk: Buffer, encoding: string, callback: () => void) {
        chunks.push(chunk);
        callback();
      },
    })
  );

  return Buffer.concat(chunks).toString("base64");
}

export async function decodeAndGunzip(data: string): Promise<string> {
  const decodedBuffer = Buffer.from(data, "base64");
  const chunks: Buffer[] = [];

  const stream = new (require("stream").Readable)();
  stream.push(decodedBuffer);
  stream.push(null);

  const gunzipStream = createGunzip();

  await gunzip(
    stream,
    gunzipStream,
    new (require("stream").Writable)({
      write(chunk: Buffer, encoding: string, callback: () => void) {
        chunks.push(chunk);
        callback();
      },
    })
  );

  return Buffer.concat(chunks).toString();
}
