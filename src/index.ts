import path from "path";
import ChatOpenAI from "./ChatOpenAI.js";
import MCPClient from "./MCPClient.js";
import Agent from "./Agent.js";
import EmbeddingRetriever from "./EmbeddingRetriever.js";
import fs from 'fs';
import { logTitle } from "./utils.js";

/* async function main(){
    const llm = new ChatOpenAI("gpt-4o-mini");
    const {content, toolCalls} = await llm.chat('hello');

    console.log(content);
    console.log(toolCalls);
}

main() */

const URL = 'https://news.ycombinator.com/'
const outPath = path.join(process.cwd(), 'output');
const TASK = `
tell me information about Antonette,find the information first from the context I provide, summarise and then create a story about her and save the
story to ${outPath}/antonette.md, output is the md file
`

const fetchMCP = new MCPClient("mcp-server-fetch", "uvx", ['mcp-server-fetch']);
const fileMCP = new MCPClient("mcp-server-file", "npx", ['-y', '@modelcontextprotocol/server-filesystem', outPath]);

async function main(){
    // RAG
    const context = await retrieveContext();

    // Agent
    const agent = new Agent('openai/gpt-4o-mini', [fetchMCP, fileMCP], '', context);
    await agent.init();
    await agent.invoke(TASK);
    await agent.close();


/*     const response = await agent.invoke(`get users information from https://jsonplaceholder.typicode.com/users, and create for each user a md file to keep the basic information under ${currentDir}/knowledge`);
    console.log(response); */
}

main();


async function retrieveContext() {
    // RAG
    const embeddingRetriever = new EmbeddingRetriever("Qwen/Qwen3-Embedding-8B");
    const knowledgeDir = path.join(process.cwd(), 'knowledge');
    const files = fs.readdirSync(knowledgeDir);
    for await (const file of files) {
        const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
        await embeddingRetriever.embedDocument(content);
    }
    const context = (await embeddingRetriever.retrieve(TASK, 3)).join('\n');
    logTitle('CONTEXT');
    console.log(context);
    return context
}