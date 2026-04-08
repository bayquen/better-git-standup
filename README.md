# Better Git Standup >:)  
v1.0
> *A simple MCP server to remember the context of your work with a single LLM prompt!* 

### **"uhh Brandon, who in the flop is this for?"**
> - *For any technical (or *semi-technical)* folks who want to review their repo commits  
...or snoop into others' work, I won't judge ;)*
> - *For anyone exploring how to implement custom MCP servers*

### "Any requirements, big bro?"
> - *Basic knowledge of using a code terminal and a AI-powered coding agent like Cursor or Claude Code*
> - *Have well-written `git commit` messages!*

### "How the flip do I use this?"
In this walkthrough, I'll be using **[Cursor](https://cursor.com/download)**. But feel free to use [Claude Code](https://code.claude.com/docs/en/overview) (*also see MCP for Claude guide [here](https://code.claude.com/docs/en/mcp#installing-mcp-servers)*) or any other AI agents that allow custom MCP integrations.  
## Walkthrough 
1. `git clone` this repo from your git terminal or thru GitHub Desktop. (URL ref: [Better Git Standup](https://github.com/bayquen/better-git-standup))


> ### If using Cursor: 
2. Click 'Settings' > 'Tools & MCP'
3. Under "Installed MCP Servers", click 'New MCP Server' to add a custom server. Cursor's `mcp.json` local file in your machine will open
4. Inside `mcp.json`, add the MCP server's schema (using the ABSOLUTE path to `mcp.json`, wherever that is in your machine)  
something like this:
```
{
  "mcpServers": {
    "git-standup-generation": {
      "command": "node",
      "args": ["C:/[Your Username]/[blah blah]/.../GitHub/better-git-standup/build/index.js"]
    }
  }
}
```
> **IMPORTANT NOTES**:  
> - To avoid confusion (for both you and AI), the standup MCP server itself is called `git-standup-generation`. I chose this name to give AI more context on the MCP server's purpose. This is standard practice :)
> - If you've previously configured other MCP servers for Cursor in `mcp.json`, there's no need to remove them. Just add the 'git-standup-generation' server schema within the "mcpServers" list of objects.  
5.  Restart Cursor (close it completely and relaunch)
6.  Locate and open the folder of whatever repo you wish to review in Cursor
7.  Open Cursor chat and prompt it to give standup for your project


e.g: If you want standup summary for past 7 days, say `Get my standup from the past week for this project`  


8.  Watch it output clean standup based on your repo's git commits!
---
