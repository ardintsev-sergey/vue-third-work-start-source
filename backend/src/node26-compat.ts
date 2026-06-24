import {Buffer} from 'buffer';

const bufferModule = require('buffer') as typeof import('buffer') & {
  SlowBuffer?: {
    prototype: typeof Buffer.prototype;
    new (size: number): Buffer;
  };
};

if (!bufferModule.SlowBuffer) {
  function SlowBuffer(size: number) {
    return Buffer.allocUnsafeSlow(size);
  }

  SlowBuffer.prototype = Buffer.prototype;
  bufferModule.SlowBuffer = SlowBuffer as unknown as typeof bufferModule.SlowBuffer;
}
