import { ITestTool } from 'typings/test-adapter';
const toolAdapters = {
    gemini: require('./gemini'),
    hermione: require('./hermione')
};

module.exports = {
    create: (toolName: string, paths: string[], tool: ITestTool, configs: { [key: string]: any }) => {
        return toolAdapters[toolName].create(paths, tool, configs);
    }
};
