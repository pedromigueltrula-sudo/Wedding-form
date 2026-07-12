import { google } from 'googleapis';

const credentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
const drive = google.drive({ version: 'v3', auth });

async function run() {
  const token = await auth.getAccessToken();
  const idRes = await drive.files.generateIds({ count: 1 });
  const fileId = idRes.data.ids[0];
  console.log("Generated ID:", fileId);

  const fileMetadata = { id: fileId, name: 'test2.txt', parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] };
  const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Upload-Content-Type': 'text/plain' },
    body: JSON.stringify(fileMetadata)
  });
  console.log("Init OK?", initRes.ok);
  
  await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' }
  });
  console.log("Permissions set!");
}
run();
