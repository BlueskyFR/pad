var GoogleAuth = require("google_authenticator").authenticator;
var QRCode = require("qrcode");

var googleAuth = new GoogleAuth();

let secret = googleAuth.createSecret();
console.log(`Generated secret key: ${secret}`);

let otpUrl = googleAuth.getQRCodeText("Pad admin", secret);
QRCode.toDataURL(otpUrl, function(err, dataUrl) {
  console.log(`Base64 QR Code image: ${dataUrl}`);
});
