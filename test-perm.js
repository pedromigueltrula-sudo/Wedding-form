import { google } from 'googleapis';
import fs from 'fs';

const credentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function run() {
  try {
    const res = await drive.files.create({
      requestBody: {
        name: 'test-resumable.txt',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
      },
      fields: 'id',
    });
    console.log("Created file:", res.data.id);
    
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    console.log("Permission set to anyone!");
  } catch (e) {
    console.error(e);
  }
}
run();
