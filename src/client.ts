import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const client = new Client({ name: 'gmail-client', version: '1.0.0' });

const transport = new StreamableHTTPClientTransport(new URL('https://gmailmcp.googleapis.com/mcp/v1'));

await client.connect(transport);

// List out tools
const { tools } = await client.listTools();
for (const tool of tools) {
    console.log(tool.name);
}