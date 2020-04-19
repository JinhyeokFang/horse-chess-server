import {createCipher, createDecipher, Cipher, Decipher} from 'crypto';

var encrypt = function (data: string): string {
    const cipher: Cipher = createCipher("aes-256-cbc", "SECRET_KEY");
    let temp: string = cipher.update(data, "utf8", "base64");
    temp += cipher.final("base64");
    return temp;
}

var decrypt = function (data: string): string {
    const decipher: Decipher = createDecipher("aes-256-cbc", "SECRET_KEY");
    let temp: string = decipher.update(data, "base64", "utf8");
    temp += decipher.final("utf8");
    return temp;
}

export { encrypt, decrypt };