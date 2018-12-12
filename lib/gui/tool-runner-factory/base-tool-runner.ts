import Promise from 'bluebird';
import { ITestResult, ITestTool } from 'typings/test-adapter';
import { ISuite } from 'typings/suite-adapter';
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const ReportBuilderFactory = require('../../report-builder-factory');
const EventSource = require('../event-source');
const utils = require('../../server-utils');
const {findTestResult} = require('./utils');
const {findNode} = require('../../../lib/static/modules/utils');
const reporterHelper = require('../../reporter-helpers');

module.exports = class ToolRunner {
    protected _toolName: string;
    protected _testFiles: string[];
    protected _tree: any;
    protected _collection: { [key: string]: any} | null;
    protected _globalOpts: { [key: string]: any};
    protected _guiOpts: { [key: string]: any};
    protected _reportPath: string;
    protected _eventSource: { [key: string]: any};
    protected _reportBuilder: { [key: string]: any};
    protected _handleRunnableCollection: any;
    protected _subscribeOnEvents: any;
    protected _prepareUpdateResult: any;

    static create(paths: string[], tool: ITestTool, configs: any) {
        return new this(paths, tool, configs);
    }

    constructor(
        paths: string[],
        protected _tool: ITestTool,
        {program: globalOpts, pluginConfig, options: guiOpts}: { [key: string]: any }
    ) {
        this._toolName = globalOpts.name();
        this._testFiles = (new Array<string>()).concat(paths);
        this._tree = null;
        this._collection = null;

        this._globalOpts = globalOpts;
        this._guiOpts = guiOpts;
        this._reportPath = pluginConfig.path;

        this._eventSource = new EventSource();
        this._reportBuilder = ReportBuilderFactory.create(this._toolName, _tool, pluginConfig);
    }

    get config() {
        return this._tool.config;
    }

    get tree() {
        return this._tree;
    }

    initialize() {
        return this._readTests()
            .then((collection: { [key: string]: any}) => {
                this._collection = collection;

                this._handleRunnableCollection();
                this._subscribeOnEvents();
            });
    }

    _readTests() {
        const {grep, set: sets, browser: browsers} = this._globalOpts;

        return this._tool.readTests(this._testFiles, {grep, sets, browsers});
    }

    finalize() {
        this._reportBuilder.saveDataFileSync();
    }

    addClient(connection: {[key: string]: any}) {
        this._eventSource.addConnection(connection);
    }

    sendClientEvent(event: Event, data: any) {
        this._eventSource.emit(event, data);
    }

    updateReferenceImage(tests: string[]) {
        const reportBuilder = this._reportBuilder;

        return Promise.map(tests, (test) => {
            const updateResult = this._prepareUpdateResult(test);
            const formattedResult = reportBuilder.format(updateResult);

            return Promise.map(updateResult.imagesInfo, (imageInfo: ITestResult) => {
                const {stateName}: any = imageInfo;

                return reporterHelper.updateReferenceImage(formattedResult, this._reportPath, stateName)
                    .then(() => {
                        this._tool.emit(
                            this._tool.events.UPDATE_RESULT,
                            _.extend(updateResult, {imagePath: imageInfo.imagePath})
                        );
                    });
            }).then(() => {
                reportBuilder.addUpdated(updateResult);

                return findTestResult(reportBuilder.getSuites(), formattedResult.prepareTestResult());
            });
        });
    }

    clearRetries() {
       this._reportBuilder.clearRetries();

       const {autoRun} = this._guiOpts;

       this._tree = Object.assign(this._reportBuilder.getResult(), {gui: true, autoRun});
    }

    _fillTestsTree() {
        const {autoRun} = this._guiOpts;

        this._tree = Object.assign(this._reportBuilder.getResult(), {gui: true, autoRun});
        this._tree.suites = this._applyReuseData(this._tree.suites);
    }

    _applyReuseData(testSuites: ISuite[]) {
        if (!testSuites) {
            return;
        }

        const reuseData = this._loadReuseData();

        if (_.isEmpty(reuseData.suites)) {
            return testSuites;
        }

        return testSuites.map((suite) => applyReuse(reuseData)(suite));
    }

    _loadReuseData() {
        try {
            return utils.require(path.resolve(this._reportPath, 'data'));
        } catch (e) {
            utils.logger.warn(chalk.yellow(`Nothing to reuse in ${this._reportPath}`));
            return {};
        }
    }
};

function applyReuse(reuseData: {[key: string]: any}) {
    let isBrowserResultReused = false;

    const reuseBrowserResult = (suite: any) => {
        if (suite.children) {
            suite.children = suite.children.map(reuseBrowserResult);

            return isBrowserResultReused
                ? _.set(suite, 'status', getReuseStatus(reuseData.suites, suite))
                : suite;
        }

        return _.set(suite, 'browsers', suite.browsers.map((bro: {[key: string]: any}) => {
            const browserResult = getReuseBrowserResult(reuseData.suites, suite.suitePath, bro.name);

            if (browserResult) {
                isBrowserResultReused = true;
                suite.status = getReuseStatus(reuseData.suites, suite);
            }

            return _.extend(bro, browserResult);
        }));
    };

    return reuseBrowserResult;
}

function getReuseStatus(reuseSuites: ISuite[], {suitePath, status: defaultStatus}: any) {
    const reuseNode = findNode(reuseSuites, suitePath);
    return _.get(reuseNode, 'status', defaultStatus);
}

function getReuseBrowserResult(reuseSuites: ISuite[], suitePath: string[], browserId: string) {
    const reuseNode = findNode(reuseSuites, suitePath);
    return _.find(_.get(reuseNode, 'browsers'), {name: browserId});
}
