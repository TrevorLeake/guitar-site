
export const unpackCanvasCtx = (ref: React.RefObject<HTMLCanvasElement>) => {
  const canvas = ref.current
  if(!canvas) {
    const errorMessage = 'No canvas element on Canvas ref!'
    console.error(errorMessage, ref)
    throw new Error(errorMessage)
  }

  const ctx = canvas.getContext("2d");
  if(!ctx) {
    const errorMessage = 'No drawing context on canvas element!'
    console.error(errorMessage, ref)
    throw new Error(errorMessage)
  }

  return { ctx, canvas }
}

export async function sha256(value: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', value);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}


export const arrayBufferToString = (buffer: ArrayBuffer): string => {
  // Convert from ArrayBuffer to serializable string
  if (!("TextDecoder" in window))
    alert("Sorry, this browser does not support TextEncoder...");
  return new TextDecoder().decode(buffer);
}

export const stringToArrayBuffer = (s: string): Uint8Array => {
  // Convert from serializable string to ArrayBuffer
  if (!("TextEncoder" in window))
    alert("Sorry, this browser does not support TextEncoder...");
  return new TextEncoder().encode(s);
}

/*
var markers = {
    RIFF: new ArrayBuffer('RIFF'),
    WAVE: new ArrayBuffer('WAVE'),
    fmt: new ArrayBuffer('fmt '),
    data: new ArrayBuffer('data')
};
*/
/*
export function decodeWAV(data: ArrayBuffer, sampleRate: number = 44100, bitDepth: number = 32, channels: number = 2){
//    data = new Buffer(data.buffer || data);
    console.log(data.byteLength)
    const output = new ArrayBuffer(data.byteLength + 44);
    const dataView = new DataView(output);
    output.
    var blockAlign = (channels * bitDepth) >> 3;
    var byteRate = blockAlign * sampleRate;
    var subChunk2Size = (data.byteLength / (bitDepth == 32 ? 4 : 2)) * channels * (bitDepth >> 3);
    var chunkSize = 36 + subChunk2Size;

    output.set(markers.RIFF, 0);
    dv.setUint32(4, chunkSize, true);
    output.set(markers.WAVE, 8);
    output.set(markers.fmt, 12);
    dv.setUint32(16, 16, true);
    dv.setUint16(20, bitDepth == 32 ? 3 : 1, true);
    dv.setUint16(22, channels, true);
    dv.setUint32(24, sampleRate, true);
    dv.setUint32(28, byteRate, true);
    dv.setUint16(32, blockAlign, true);
    dv.setUint16(34, bitDepth, true);
    output.set(markers.data, 36);
    dv.setUint32(40, subChunk2Size, true);
    output.set(data, 44);

	return output.buffer;
}
*/
