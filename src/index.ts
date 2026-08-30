import path from 'node:path';
import process from 'node:process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// The scope for reading Gmail labels.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Authentication
// auth stores the authenticated Google auth client object
const auth = await authenticate({
  scopes: SCOPES,
  keyfilePath: CREDENTIALS_PATH,
});

const gmail = google.gmail({ version: 'v1', auth });

/**
 * Lists the labels in the user's account.
 */
async function listLabels() {
  // Get the list of labels.
  const result = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = result.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  // Print the name of each label.
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

// see what happens when you use the messages.list function. Is there a way of getting specific messages. For example search for particular messages using gmail search but from here instead of actually in gmail search
async function getMessagesIds() {
  const result = await gmail.users.messages.list({
    userId: 'me',
  });

  const messages = result.data.messages;

  if(!messages || messages.length === 0) {
    console.log('No messages found');
    return;
  }

  return messages;
}

async function getMessage(id: string | null | undefined) {
  if(id === null || id === undefined) {
    console.log("Error: no related messages found");
    return;
  }

  const result = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  });

  return result;
}

// TODO: Function to get all unread messages

// await listLabels();
const messages = await getMessagesIds();

const message = await getMessage(messages?.[0]?.id);
console.log(message?.data.snippet);