import fs from 'fs';

async function run() {
  const initRes = await fetch("http://localhost:3000/api/drive-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: "testput.txt", mimeType: "text/plain", size: 12 })
  });
  const data = await initRes.json();
  console.log("Upload URL:", !!data.uploadUrl);

  const putRes = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/plain" },
    body: "Hello world!"
  });
  console.log("PUT status:", putRes.status);
  console.log("PUT response:", await putRes.text());
}
run();
