import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";  // For passing & executing shell/git commands synchronously + returning its output

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
                since_date: {type: "string", format: "date", description: "Starting date string for filtering commits (Format: 'YYYY-MM-DD')."},
                until_date: {type: "string", format: "date", description: "End date string for filtering commits (Format: 'YYYY-MM-DD')."},
                max_commits: {type: "integer", description: "Max number of commits to list from git history"},
                time_period: {type: "string", enum: ["yesterday", "today", "this_week"], description: "Time period for standup (e.g. yesterday, today, this_week)"}
            },
            required: ["repo_path", "time_period"]
        }
    },
    async ({ repo_path, max_commits, time_period }) => {
        let since_date: string;
        let until_date: string;

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        switch (time_period) {
            case "yesterday":
                // Get yesterday's date
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                since_date = yesterday.toISOString().split('T')[0];
                until_date = todayString;
                break;
            case "today":
                since_date = todayString;
                // Get tomorrow's date
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                until_date = tomorrow.toISOString().split('T')[0];
                break;
            case "this_week":
                since_date = todayString;
                
                const startOfWeek = new Date(today);
                // Get start of week's date (that Monday of the week)
                // Calculation: [today's date] - [number from 0 to 6 representing day of the week] + 1 (since Monday = 1 in getDay())
                // e.g. If today is Wednesday the 26th, then: 26 - 3 + 1 = 24 (last Monday's date)
                startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                
                since_date = startOfWeek.toISOString().split('T')[0];
                until_date = todayString;
                break;
            // Add default case. This tells TypeScript that if we reach this case, we always have valid dates.
            default:
                throw new Error(`Unknown time period: ${time_period}`);
        }

        // Execute git log command with Node's execSync() function
        const output = execSync(
            `git log --since="${since_date}" --until="${until_date}" --format="%H|%s|%ai"`,
            { cwd: repo_path }
        );
        // TODO: Implement git logic
        let formatted_output = output.toString();
        const commits = formatted_output
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [hash, message, date] = line.split('|');
                return { hash, message, date };
            });

        return {
            content: [{ type: "text", text: JSON.stringify(commits) }]
        };
    }
);

server.registerTool(
    "generate_standup_message",
    {
        title: "Generate Standup Message",
        description: "Takes raw commit history from get_commits() tool and formats it into a descriptive, professional standup message (e.g. 'Yesterday I fixed bug X, added feature Y')",
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