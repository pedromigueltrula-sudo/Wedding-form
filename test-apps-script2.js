async function run() {
  const url = "https://script.google.com/macros/s/AKfycbyZMOsGBzZE30Gb88-RfgoNeWCOEN1NYut-9sFKl9xBT4ivJ0kRNdeoRJ8W4ViC1EqT/exec";
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upload_init', filename: 'test.txt', mimeType: 'text/plain', size: 10 })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}
run();
