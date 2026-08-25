import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const client = new Client({ name: 'gmail-client', version: '1.0.0' });

const transport = new StreamableHTTPClientTransport(new URL('https://gmailmcp.googleapis.com/mcp/v1'));

await client.connect(transport);

// List out tools
const { tools } = await client.listTools();
console.log(tools.map(tool => tool.name));

// Not working because you have to implement auth!
const result = await client.callTool({ name: 'search_threads', arguments: { query: 'from: google '}});
console.log(result.content);

// Might be worth doing another tool call here, to double check that the auth persists


// If it makes you log in every time you run it, can you cache somewhere to prevent from having to do this every time in development (so it logs you in automatically)? 

// Also, for writing tests, how is it going to log in so that it can check the tools are running properly?