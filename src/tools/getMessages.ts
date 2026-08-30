// see what happens when you use the messages.list function. Is there a way of getting specific messages. For example search for particular messages using gmail search but from here instead of actually in gmail search
import type { gmail_v1 } from 'googleapis';

export async function getMessagesIds(gmail: gmail_v1.Gmail) {
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

export async function getMessage(gmail: gmail_v1.Gmail, id: string | null | undefined) {
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