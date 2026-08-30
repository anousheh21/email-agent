import path from 'node:path';
import process from 'node:process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { getMessagesIds, getMessage } from './tools/getMessages.ts';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Authentication
const auth = await authenticate({
  scopes: SCOPES,
  keyfilePath: CREDENTIALS_PATH,
});

const gmail = google.gmail({ version: 'v1', auth });

async function listLabels() {
  const result = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = result.data.labels;

  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }

  console.log('Labels:');

  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}



await listLabels();
const messages = await getMessagesIds(gmail);

const message = await getMessage(gmail, messages?.[0]?.id);
console.log(message?.data.snippet);