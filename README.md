# Better Git Standup >:)  
v1.0
> *A simple MCP server to remember the context of your work with a single LLM prompt!*  


### **"uhh Brandon, who in the flop is this for?"**
> - *For any technical (or *semi-technical)* folks who want to review their repo commits  
...or snoop into others' work, I won't judge ;)*
> - *For anyone exploring how to implement custom MCP servers*

### "Any prerequisites, big bro?"  
![MYBROTHA](https://github.com/user-attachments/assets/c5b4a0e8-bf76-4711-a7a4-f0faff735f0c)  
> - *Basic knowledge of using a code terminal and a AI-powered coding agent like Cursor or Claude Code*
> - *Have well-written `git commit` messages!*

### "How the flip do I use this?"
In this walkthrough, I'll be using **[Cursor](https://cursor.com/download)**. But feel free to use [Claude Code](https://code.claude.com/docs/en/overview) (*also see MCP for Claude guide [here](https://code.claude.com/docs/en/mcp#installing-mcp-servers)*) or any other AI agents that allow custom MCP integrations.  
## Walkthrough 
**Package Requirements:**
- If you haven't already, install latest version of Node [here](https://nodejs.org/en/download)
- Then verify installations for Node and its package manager (npm) on your terminal with these lines:
```shell
node --v
npm --v

# These lines should print the installed version nums of each (e.g. something like "v24.14.1", or "11.11.0" for npm)
```
**Steps:**
1. `git clone` this repo from your git terminal or thru GitHub Desktop. (URL ref: [Better Git Standup](https://github.com/bayquen/better-git-standup))
2. At the root of the project, run `npm run build` from your terminal

3. In your Cursor IDE, click 'Settings' > 'Tools & MCP'
4. Under "Installed MCP Servers", click 'New MCP Server' to add a custom server. Cursor's `mcp.json` local file in your machine will open
5. Inside `mcp.json`, add the MCP server's schema (using the ABSOLUTE path to `index.js`, the MCP server file copy generated in `/build`), wherever that is in your machine)  
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
6.  Restart Cursor (close it completely and relaunch).  
> *Relaunching is necessary for the MCP server to integrate.*
7.  Locate and open the folder of whatever repo you wish to review in Cursor
8.  Open Cursor chat and prompt it to give standup for your project


e.g: If you want standup summary for past 7 days, say `Get my standup from the past week for this project`  


9.  Watch it output clean standup based on your repo's git commits!  

---
**Accurate depiction of YOU after reading your sexy standups:**  

> **(I gotchu, king)**


<img width="367" height="250" alt="Rick from The Walking Dead" src="https://github.com/user-attachments/assets/38a9941f-be2e-46b7-a42e-1b1c43c28ac9" /><br>

> **(I gotchu, queen)**


<img width="368" height="367" alt="Rosita from The Walking Dead" src="https://github.com/user-attachments/assets/bbc0e577-69af-4270-8ffd-fc17d74e46dc" />  


---
