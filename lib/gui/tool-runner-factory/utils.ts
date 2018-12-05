import { ITestTool } from 'typings/test-adapter';

const _ = require('lodash');
const {findNode} = require('../../static/modules/utils');

const formatTestHandler = (browser: { [key: string]: any}, test: ITestTool) => {
    const {suitePath, name} = test;

    return {
        suite: {path: suitePath.slice(0, -1)},
        state: {name},
        browserId: browser.name
    };
};

exports.formatTests = (test: ITestTool) => {
    if (test.children) {
        return _.flatMap(test.children, (child: ITestTool) => exports.formatTests(child));
    }

    if (test.browserId) {
        test.browsers = _.filter(test.browsers, {name: test.browserId});
    }

    return _.flatMap(test.browsers, (browser: { [key: string]: any}) => formatTestHandler(browser, test));
};

exports.findTestResult = (suites = [], test: ITestTool) => {
    const {name, suitePath, browserId} = test;
    const nodeResult = findNode(suites, suitePath);
    const browserResult = _.find(nodeResult.browsers, {name: browserId});

    return {name, suitePath, browserId, browserResult};
};
