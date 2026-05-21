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

async function setup() {
  const dbId = 'propojos_db';
  const collId = 'plugins';

  console.log('Creating database...');
  let res = await fetch(`${endpoint}/databases`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ databaseId: dbId, name: 'PropojOS DB' })
  });
  if (res.status === 409) console.log('Database already exists.');
  else if (!res.ok) throw new Error(await res.text());
  else console.log('Database created.');

  console.log('Creating plugins collection...');
  res = await fetch(`${endpoint}/databases/${dbId}/collections`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ collectionId: collId, name: 'Plugins', permissions: ['read("any")'] })
  });
  if (res.status === 409) console.log('Collection already exists.');
  else if (!res.ok) throw new Error(await res.text());
  else console.log('Collection created.');

  const attributes = ['name', 'url', 'module', 'componentName'];
  for (const attr of attributes) {
    console.log(`Creating attribute: ${attr}`);
    res = await fetch(`${endpoint}/databases/${dbId}/collections/${collId}/attributes/string`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: attr, size: 255, required: true })
    });
    if (res.status === 409) console.log(`Attribute ${attr} already exists.`);
    else if (!res.ok) console.error(`Error creating ${attr}:`, await res.text());
  }
}

setup().catch(console.error);
