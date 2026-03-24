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
            repo_path: "",
            since_date: "",
            max_commits: ""
        }
    }
)

server.registerTool(
    "generate_standup_message",
    {
        title: "Generate Standup Message",
        description: "Accepts the commit history and returns a formatted standup message",
        inputSchema: {
             
        }
    }
)