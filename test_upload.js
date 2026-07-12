import { google } from 'googleapis';

const credentials = {
  client_email: "victoriaypedrocontenidos@victoriaypedrocontenidos.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFODOsM3PoW4qb\niCpFzqeiDq1qqFuXo3obuzArPOhx03ub2MfztKClNxO5DhtW0C8pmZ/qAltUd0i+\nRBwRR9QvBaQrESgqjRJC+1Ya9UgwGjgyVpucwk3I126bEbIlJkaEXNFM+njN4hnc\ntJfP+iwIpikayNS1qyzCpqOReW/jS3eCyNHXGXnJjWIT4wF2GlcBSwi++Y4j7csN\n2j7sWROiMD6XsnWhzd4xb7q6yr0bEhQ4kMUMBSRghPgR8mcOfgR9si1vXYGCcPR8\nuuNWH6SaHhwWQDns8YP0Yeumm2kvO9YBUHqoQf+JrPfqFe0zgauMIB5f8eKmLNmu\np33jOfMRAgMBAAECggEALrVoW4zWEz52/e4KYP0YK6QBQ2T7SFcx6NZ1CpCC1s6J\nFHiLprbtYyO/upDSPcXRna8iNhh3y/HyWwmjgh46bSaPYpnOIwHFRPLkyj60aZwU\nGivz7/T+2iXXrsdKo0zE371h3rLloJE/octttxafji7YRl0xL5OKZtFzpNUXgEOp\nV6ky5RgXhsG99yjNeoWa7bkK2Rcp5tYKMfAjq2AwOzNpH451j7i0/hZinvWs+QQ4\nb1AMeRda+Tnorxgyw5Kh1b2HwygRKCgfHt4Dip/EKtliWANJLeMz0tU5qcscdsTM\nbMBAzjFetcTcl2yZ4O/nj36BsK27y0qcAowr5gjt6QKBgQDphZ+fu/i/WaNzEvFz\nN8dOdgyjJuF0984MBK8K2i/yT/zONGI7R85CQ0/rK8sMbHN25toM+e3VnHY4Pv/n\n/kTq1EqeJi+3hmVaKrVbJTOwTY4dT6ZvuegQguBqolrVhom//88Hx9P7KIJYSDFS\nHuISAJS8VPtIZlFHuTdm6Z4hNQKBgQDYNAZpGQ7jinSMJyumnXj3+rKGUIV/iah/\n4BH//Ck4F4P+tXCvSSVssmd6kCxUjDHqo5Yl/NWF9YwseSbU7lbhXTdXdhv6t+pU\n04Y/MI/gO65IKglSgUZMoD0bRPm5zTUWsqHKg7OpVaLzzynuH5pv+9iNRt43vB6T\nx1YSkWQB7QKBgBKpF+FWzwDTc+k9KUgwu998NXRQJhIHv1JciXRPjSdK1wPPUc40\n5bmL0XYUcMxUWkG1HtWMn0HDl/rUpfRu8Cjnv/K1UHjU54J2CTn4VhIPkHytIbqp\n225+VtqOkL2hW56ZHX0crcbTLN9LHY3XY+9WVoxaKh5V9sbJeTDjGDzFAoGBAI7P\nvrRJgxY2bMnvTdwfBLr49FfYdHZMXesp/XnT/P46OkxTWX3PmVL1fXjuJvoqKQbO\ny+2H1xtHmTH/TPE2BlmTE21IbS7tsXIazwCKeV8qzPKKIeJH1kHjTrnmk/ZxYHH/\nyPNWj6R5FsxpuU67vW3fM6oOd9blAmWnNGnLc/35AoGAL/G46s/yQSZl2jMvxU8C\nwovkRznHRKyi27DPKDlvymXe78IFfhNPtwA/mm5v5PNYT6ocgEQeag74vih4+sfv\n937Uss38zttRsGBLUamNIXpuuUiAYdpaEVS6miK4Jac3WBCQUPhw/3CWJUH5eIvh\nC89Rcor/2LEGHOnL+AzQINU=\n-----END PRIVATE KEY-----\n"
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function testUpload() {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: 'test.txt',
        parents: ['1ioJKVQf3SIeX_bW9SoSLvfQG-5dLaOZb']
      },
      media: {
        mimeType: 'text/plain',
        body: 'Hello World'
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testUpload();
