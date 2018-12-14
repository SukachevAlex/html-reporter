import _ from 'lodash';
import { ITestTool, TestAdapterType, ITestResult } from 'typings/test-adapter';
import { IOptions } from 'typings/options';

const ToolRunnerFactory = require('./tool-runner-factory');

module.exports = class App {
    protected _tool: TestAdapterType;
    protected _browserConfigs: any[];
    protected _retryCache: any;

    static create(paths: string[], tool: ITestTool, configs: IOptions) {
        return new this(paths, tool, configs);
    }

    constructor(paths: string[], tool: ITestTool, configs: IOptions) {
        const {program} = configs;

        this._tool = ToolRunnerFactory.create(program.name(), paths, tool, configs);

        this._browserConfigs = [];
        this._retryCache = {};
    }

    initialize() {
        return this._tool.initialize();
    }

    finalize() {
        this._tool.finalize();
    }

    run(tests: ITestResult[]) {
        return _.isEmpty(tests)
            ? this._tool.run()
            : this._runWithoutRetries(tests);
    }

    clearRetries() {
        this._tool.clearRetries();
    }

    _runWithoutRetries(tests: ITestResult[]) {
        if (_.isEmpty(this._browserConfigs)) {
            this._browserConfigs = _.map(this._tool.config.getBrowserIds(), (id) => this._tool.config.forBrowser(id));
        }

        this._disableRetries();

        return this._tool.run(tests)
            .finally(() => this._restoreRetries());
    }

    updateReferenceImage(failedTests = []) {
        return this._tool.updateReferenceImage(failedTests);
    }

    addClient(connection: any) {
        this._tool.addClient(connection);
    }

    get data() {
        return this._tool.tree;
    }

    _disableRetries() {
        this._browserConfigs.forEach((broConfig) => {
            this._retryCache[broConfig.id] = broConfig.retry;
            broConfig.retry = 0;
        });
    }

    _restoreRetries() {
        this._browserConfigs.forEach((broConfig) => {
            broConfig.retry = this._retryCache[broConfig.id];
        });
    }
};
