var fernet = require('fernet');

var base64js = require('base64-js');

var md5 = require('md5');


function _utf8_bytes_to_string(b) {
  return new TextDecoder("utf-8").decode(b);
}

function _string_to_utf8_bytes(s) {
  return new TextEncoder("utf-8").encode(s);
}

function _string_to_encoded(s) {
  return _bytes_to_string(_string_to_utf8_bytes(s));
}

function _encoded_to_string(b){
    return _utf8_bytes_to_string(_string_to_bytes(b));
}

function _string_to_bytes(s){
    return base64js.toByteArray(s);
}

function _bytes_to_string(b) {
  return base64js.fromByteArray(b);
}

/*
Thanks to Jon Leighton for the below base64ArrayBuffer function that is
  licensed under MIT

MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/
function _base64ArrayBuffer(arrayBuffer) {
  let base64 = '';
  let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  let bytes = new Uint8Array(arrayBuffer);
  let byteLength = bytes.byteLength;
  let byteRemainder = byteLength % 3;
  let mainLength = byteLength - byteRemainder;

  let a, b, c, d = undefined;
  let chunk = undefined;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}


class SymmetricKey {
  constructor({
    symmetric_key = undefined,
    auto_generate = true
  } = {}) {
    this._symkey = undefined;

    if (symmetric_key) {
      this._symkey = _string_to_encoded(md5(symmetric_key));
    } else {
      if (auto_generate) {
        this._symkey = this.generate_symmetric_key();
      }
    }
  }

  /** Generate the key from the passed password */
  static createFromPassword(email, password) {
    let salt = "bIyLor8TVmQKA5Yfng4KKC0sAsLEe7MDghkTA4EXDMo=";
    return new SymmetricKey({
      symmetric_key: salt + email + password,
      auto_generate: false
    });
  }

  /** Randomly generate a good symmetric key */
  generate_symmetric_key() {
    let array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    let secret = _base64ArrayBuffer(array);
    return secret;
  }

  fingerprint() {
    if (!this._symkey) {
      return undefined;
    }

    let m = md5(this._symkey);

    return m.match(/(..?)/g).join(":");
  }

  encrypt(message) {
    if (!this._symkey) {
      this._symkey = this.generate_symmetric_key();
    }

    return _bytes_to_string(this._fernet_encrypt(this._symkey, message));
  }

  /** Function to perform symmetric encryption using fernet - encrypts
   *  'data' with 'key'
   */
  _fernet_encrypt(key, data) {
    let token = new fernet.Token({
      secret: new fernet.Secret(key)
    });

    try {
      let encrypted = token.encode(data);
      encrypted = _string_to_utf8_bytes(encrypted);
      return encrypted;
    } catch (err) {
      throw new Error("Cannot encrypt data", err);
    }
  }

  /** Function to perform symmetric decryption using fernet - decrypts
   *  'data' with 'key'
   */
  _fernet_decrypt(key, data) {
    let token = new fernet.Token({
      secret: new fernet.Secret(key),
      token: _utf8_bytes_to_string(data),
      ttl: 0
    });

    try {
      let result = token.decode();
      return result;
    } catch (err) {
      throw new Error("Cannot decrypt data", err);
    }
  }

  decrypt(message) {
    if (!this._symkey) {
      throw new Error("You cannot decrypt a message " +
        "with a null key!");
    }

    return this._fernet_decrypt(this._symkey, _string_to_bytes(message));
  }å
}

export default SymmetricKey;