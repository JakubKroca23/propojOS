import * as dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.propoj.app/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT || 'propoj-os';
const key = 'standard_a8d6b6925d491fdcea6aaa89efa9eb0876ee5a3948e7eb482798a22b1fe1952444e13892911c62658e12a1c3dbc7985a7cc8186b9cec1cf22b41a5d206bca5785064380728e1845a93905ef17792b2432de852142a37e76618f576186725fcd0433c9862558e7b3f317f4128631b97150defd7f741165b2b97ac61bd6a7f7a57';

const headers = {
  'content-type': 'application/json',
  'x-appwrite-project': projectId,
  'x-appwrite-key': key
};

async function checkDocs() {
  const dbId = 'propojos_db';
  const configCollId = 'os_configs';

  console.log('Fetching documents from os_configs collection...');
  const res = await fetch(`${endpoint}/databases/${dbId}/collections/${configCollId}/documents`, {
    method: 'GET',
    headers
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  console.log(`Total documents found: ${data.total}`);
  data.documents.forEach((doc: any, i: number) => {
    console.log(`\nDocument #${i + 1}:`);
    console.log(`ID: ${doc.$id}`);
    console.log(`userId: ${doc.userId}`);
    console.log(`Permissions:`, doc.$permissions);
    console.log(`Widgets (truncated):`, doc.widgets.substring(0, 100));
  });
}

checkDocs().catch(console.error);
