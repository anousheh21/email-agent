// Redundant - switched to using the Gmail API instead of MCP

import "dotenv/config";
import open from "open";
import http from "node:http";
import { auth, Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import type { OAuthClientMetadata, OAuthClientProvider, OAuthDiscoveryState, OAuthTokens } from "@modelcontextprotocol/client";

const clientId = getRequiredEnv('GMAIL_AUTH_CLIENT_ID');
const clientSecret = getRequiredEnv('GMAIL_AUTH_CLIENT_SECRET');

if (!clientId || !clientSecret) {
    throw new Error("Missing OAuth credentials");
}

const mcpUrl = new URL('https://gmailmcp.googleapis.com/mcp/v1');

class GmailOAuthProvider implements OAuthClientProvider {
    private storedTokens?: OAuthTokens;    
    private verifier?: string;
    private discovery?: OAuthDiscoveryState;
    lastState?: string;

    readonly redirectUrl = 'http://localhost:8090/callback';
    readonly clientMetadata: OAuthClientMetadata = {
        client_name: 'Email Agent',
        redirect_uris: ['http://localhost:8090/callback'],
        application_type: 'native'
    };

    clientInformation() {
        return {
            client_id: clientId,
            client_secret: clientSecret
        }
    }

    tokens() {
        return this.storedTokens;
    }

    saveTokens(tokens: OAuthTokens) {
        // TODO: the docs said "in production, persist OS keychain / secure storage - never plain files" - do this to prevent the user having to log in every time
        this.storedTokens = tokens;
    }

    state() {
        this.lastState = crypto.randomUUID();
        return this.lastState;
    }

    saveDiscoveryState(state: OAuthDiscoveryState) {
        this.discovery = state;
    }

    discoveryState() {
        return this.discovery;
    }

    async redirectToAuthorization(url: URL) {
        await onRedirect(url);
    }

    saveCodeVerifier(v: string) {
        this.verifier = v;
    }

    codeVerifier() {
        if (!this.verifier) throw new Error('no code verifier');
        return this.verifier;
    }
    
}

const provider = new GmailOAuthProvider();
const client = new Client({ name: 'gmail-client', version: '1.0.0' });

const transport = new StreamableHTTPClientTransport(mcpUrl, { authProvider: provider });

// const callbackPromise = waitForCallback();
await auth(provider, { serverUrl: mcpUrl });

// const callbackUrl = await callbackPromise;
const callbackUrl = await waitForCallback();
console.log("Authentication callback received. Exchanging authorization code...");
const params = new URL(callbackUrl).searchParams;

if (params.get('state') !== provider.lastState) throw new Error('state mismatch');

await transport.finishAuth(params);
console.log("Authorization complete.");

await client.connect(transport);

// List out tools
const { tools } = await client.listTools();
console.log(tools.map(tool => tool.name));

const result = await client.callTool({ name: 'search_threads', arguments: { query: 'from: google '}});
console.log(result.content);
await client.close();

function getRequiredEnv(name: string | undefined): string {
    if (!name) {
        throw new Error(`Missing environment variable: ${name}`)
    }

    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

async function onRedirect(url: URL) {
    console.log("Opening the authorization page in your browser...");
    await open(url.toString());
}

async function waitForCallback(): Promise<string> {
   return new Promise<string>((resolve, reject) => {
        const server = http.createServer((req, res) => {
            if (!req.url) {
                reject(new Error("Callback request had no URL"));
                return;
            }

            res.statusCode = 200;
            res.end("Authentication complete. You can close this tab.");

            server.close();

            resolve(`http://localhost:8090${req.url}`);
        })

        server.on("error", (error) => {
            reject(error);
        })

        console.log("Waiting for the authentication callback on http://localhost:8090/callback...");
        server.listen(8090);
   })
}

// Might be worth doing another tool call here, to double check that the auth persists


// If it makes you log in every time you run it, can you cache somewhere to prevent from having to do this every time in development (so it logs you in automatically)? 

// Also, for writing tests, how is it going to log in so that it can check the tools are running properly?
