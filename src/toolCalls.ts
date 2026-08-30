import type { gmail_v1 } from 'googleapis';
import { listLabels } from './tools/getLabels.ts';
import { getMessagesIds, getMessage } from './tools/getMessages.ts';

export async function toolCalls(gmail: gmail_v1.Gmail) {
    await listLabels(gmail);
    const messages = await getMessagesIds(gmail);

    const message = await getMessage(gmail, messages?.[0]?.id);
    console.log(message?.data.snippet);
}