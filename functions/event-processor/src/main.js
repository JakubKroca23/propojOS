/**
 * Appwrite Serverless Function: event-processor
 * 
 * This function is triggered by visual workflows in PropojOS.
 * It parses visual event payloads, processes data (doubles numbers / uppercases strings),
 * and returns the structured result in real-time.
 */
export default async ({ req, res, log, error }) => {
  // Safe parsing of incoming trigger payload
  let payload = {};
  try {
    payload = JSON.parse(req.body || '{}');
  } catch (err) {
    error('Failed to parse request body: ' + err.message);
    return res.json({ error: 'Invalid JSON payload' }, 400);
  }

  const value = payload.value;
  log(`⚡ Serverless Visual Event received: "${JSON.stringify(value)}"`);

  // Simple event action processing logic
  let result = value;
  if (typeof value === 'number') {
    result = value * 2;
  } else if (typeof value === 'string') {
    result = value.toUpperCase();
  }

  // Return the processed results
  return res.json({
    status: 'success',
    input: value,
    result: result,
    processedBy: 'Appwrite Serverless Fn (Node.js)',
    timestamp: new Date().toISOString()
  });
};
