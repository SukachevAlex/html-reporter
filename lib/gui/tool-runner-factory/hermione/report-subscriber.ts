const clientEvents = require('../../constants/client-events');
const {RUNNING} = require('../../../constants/test-statuses');
const {getSuitePath} = require('../../../plugin-utils').getHermioneUtils();
const {findTestResult} = require('../utils');
import {saveTestImages, saveBase64Screenshot} from '../../../reporter-helpers';
import {ISuite} from 'typings/suite-adapter';
import {ITestResult, TestAdapterType} from 'typings/test-adapter';
import {IHermione} from 'typings/hermione';

interface IData {
    sessionId: string;
    browserId: string;
    assertViewResults: [{stateName: string; refImagePath: string}] | [];
    meta: {url: string};
    hermioneCtx: {assertViewResults: any};
    duration: number;
}

interface IClient extends EventSource {
    emit: any;
}

module.exports = (hermione: IHermione, reportBuilder: TestAdapterType, client: IClient, reportPath: string) => {

    function failHandler(testResult: ITestResult) {
        const formattedResult = reportBuilder.format(testResult);
        const actions = [saveTestImages(formattedResult, reportPath)];

        if (formattedResult.screenshot) {
            actions.push(saveBase64Screenshot(formattedResult, reportPath));
        }

        return Promise.all(actions);
    }

    hermione.on(hermione.events.SUITE_BEGIN, (suite: ISuite) => {
        if (suite.pending) {
            return;
        }

        client.emit(clientEvents.BEGIN_SUITE, {
            name: suite.title,
            suitePath: getSuitePath(suite),
            status: RUNNING
        });
    });

    hermione.on(hermione.events.TEST_BEGIN, (data: IData) => {
        const {browserId} = data;

        client.emit(clientEvents.BEGIN_STATE, {
            suitePath: getSuitePath(data),
            browserId,
            status: RUNNING
        });
    });

    hermione.on(hermione.events.TEST_PASS, (data: IData) => {
        const formattedTest = reportBuilder.addSuccess(data);
        const testResult = findTestResult(reportBuilder.getSuites(), formattedTest.prepareTestResult());

        saveTestImages(formattedTest, reportPath)
            .then(() => client.emit(clientEvents.TEST_RESULT, testResult));
    });

    hermione.on(hermione.events.TEST_FAIL, (data: IData) => {
        const formattedResult = reportBuilder.format(data);

        formattedResult.hasDiff()
            ? reportBuilder.addFail(data)
            : reportBuilder.addError(data);

        const testResult = findTestResult(reportBuilder.getSuites(), formattedResult.prepareTestResult());
        failHandler(data)
            .then(() => client.emit(clientEvents.TEST_RESULT, testResult));
    });

    hermione.on(hermione.events.RETRY, (data: IData) => {
        reportBuilder.addRetry(data);

        failHandler(data);
    });

    hermione.on(hermione.events.RUNNER_END, () => {
        return reportBuilder.save()
            .then(() => client.emit(clientEvents.END));
    });
};
