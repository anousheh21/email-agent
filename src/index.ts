import path from 'node:path';
import process from 'node:process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { toolCalls } from './toolCalls.ts';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Authentication
const auth = await authenticate({
  scopes: SCOPES,
  keyfilePath: CREDENTIALS_PATH,
});

const gmail = google.gmail({ version: 'v1', auth });

// Deterministic tool calling (for dev)
toolCalls(gmail);