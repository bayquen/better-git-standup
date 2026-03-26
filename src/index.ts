import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// TODO: Figure out the API (if any) or Git commands needed to be accessed
const API = "";
const USER_AGENT = "";

// Create a server instance
const server = new McpServer({
    name: "git-standup-generation",
    version: "1.0.0",
});

server.registerTool(
    "get_commits",
    {
        title: "Get Git Commits",
        description: "Reads current repo's git commit history for a given time period (e.g. yesterday or today)",
        inputSchema: {
            type: "object",
            properties: {
                repo_path: {type: "string", description: "Absolute path to git repo folder"},
                since_date: {type: "string", format: "date", description: "Relative date string for filtering commits after this date"},
                max_commits: {type: "integer", description: "Max number of commits to list from git history"}
            },
            required: ["repo_path", "since_date"]
        }
    },
    async ({ repo_path, since_date, max_commits }) => {
        // TODO: Implement git logic
        return {
            content: [{ type: "text", text: "Placeholder: commits would be returned here" }]
        }
    }
);

server.registerTool(
    "generate_standup_message",
    {
        title: "Generate Standup Message",
        description: "Takes raw commit history from get_commits() tool and formats it into a professional standup message (e.g. 'Yesterday I fixed bug X, added feature Y')",
        inputSchema: {
             type: "object",
             properties: {
                commits: {
                    type: "array",
                    description: "Array of git commit objects from get_commits tool",
                    items: {
                        type: "object",
                        properties: {
                            hash: { type: "string" },
                            message: { type: "string" },
                            author: { type: "string" },
                            date: { type: "string" }
                        },
                        required: ["hash", "message"]
                    }
                },
                time_period: {
                    type: "string",
                    enum: ["today", "yesterday", "this_week"],
                    description: "What time period the standup covers",
                    default: "yesterday"
                }
             },
             required: ["commits"]
        }
    },
    async ({ commits, time_period }) => {
        // Format commits into standup text; loops thru each commit and displays each as a bullet.
        // E.g: "
        //      Today's Standup:
        //      • Fixed login bug (a1b2c3d4)
        //      • Added dark mode (e5f6g7h8)
        //      "
        const message = `**${time_period.charAt(0).toUpperCase() + time_period.slice(1)}'s Standup:**\n\n` +
            commits.map(c => `• ${c.message} (${c.hash.slice(0, 8)})`).join('\n');
        return { content: [{ type: "text", text: message }] };
    }
);

// // Start the server
// const transport = new StdioServerTransport();
// await server.connect(transport);