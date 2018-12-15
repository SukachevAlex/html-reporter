import React from 'react';
import proxyquire from 'proxyquire';
import {mkConnectedComponent, mkTestResult_} from '../utils';
// @ts-ignore
const {SUCCESS, FAIL, ERROR} = require('../../../../../lib/constants/test-statuses');

declare const sinon: any;
declare const assert: any;

describe('<Body />', () => {
    const sandbox = sinon.createSandbox();

    let Body: any;
    let actionsStub: any;
    let utilsStub: any;

    beforeEach(() => {
        actionsStub = {
            acceptTest: sandbox.stub().returns({type: 'some-type'}),
            retryTest: sandbox.stub().returns({type: 'some-type'})
        };

        utilsStub = {isAcceptable: sandbox.stub()};

        const State = proxyquire('lib/static/components/state', {
            '../../modules/utils': utilsStub
        });

        Body = proxyquire('lib/static/components/section/body', {
            '../../../modules/actions': actionsStub,
            '../../state': State
        }).default;
    });

    afterEach(() => sandbox.restore());

    it('should render retry button if "gui" is running', () => {
        const bodyComponent: any = <Body result={mkTestResult_()} />;
        const component = mkConnectedComponent(bodyComponent, {initialState: {gui: true}});
        assert.equal(component.find('.Section-Body').find('.button').text(), '↻ Retry');
    });

    it('should not render retry button if "gui" is not running', () => {
        const bodyComponent: any = <Body result={mkTestResult_()} />;
        const component = mkConnectedComponent(bodyComponent, {initialState: {gui: false}});

        assert.lengthOf(component.find('.Section-Body').find('.button'), 0);
    });

    it('should call "acceptTest" action on Accept button click', () => {
        const retries: any[] = [];
        const imagesInfo = [{status: ERROR, actualPath: 'some/path', reason: {}, image: true}];
        const testResult = mkTestResult_({name: 'bro', imagesInfo});
        utilsStub.isAcceptable.withArgs(imagesInfo[0]).returns(true);

        const bodyComponent: any = <Body result={testResult} suite={{name: 'some-suite'}} retries={retries}/>;
        const component = mkConnectedComponent(bodyComponent);

        component.find('[name="✔ Accept"]').find('.button').simulate('click');

        assert.calledOnceWith(actionsStub.acceptTest, {name: 'some-suite'}, 'bro', retries.length - 1);
    });

    it('should render state for each state image', () => {
        const imagesInfo = [
            {stateName: 'plain1', status: ERROR, actualPath: 'some/path', reason: {}},
            {stateName: 'plain2', status: ERROR, actualPath: 'some/path', reason: {}}
        ];
        const testResult = mkTestResult_({name: 'bro', imagesInfo});

        const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}}/>);

        assert.lengthOf(component.find('.Tab'), 2);
    });

    it('should not render state if state images does not exist and test passed succesfully', () => {
        const testResult = mkTestResult_({status: SUCCESS});

        const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

        assert.lengthOf(component.find('.Tab'), 0);
    });

    it('should render additional tab if test errored without screenshot', () => {
        const imagesInfo = [{stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path'}];
        const testResult = mkTestResult_({status: ERROR, multipleTabs: true, reason: {}, imagesInfo});

        const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

        assert.lengthOf(component.find('.Tab'), 2);
    });

    describe('errored additional tab', () => {
        it('should render if test errored without screenshot and tool can use multi tabs', () => {
            const imagesInfo = [{stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path'}];
            const testResult = mkTestResult_({status: ERROR, multipleTabs: true, reason: {}, imagesInfo});

            const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

            assert.lengthOf(component.find('.Tab'), 2);
        });

        it('should not render if tool does not use multi tabs', () => {
            const imagesInfo = [{stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path'}];
            const testResult = mkTestResult_({status: ERROR, multipleTabs: false, reason: {}, screenshot: 'some-screen', imagesInfo});

            const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

            assert.lengthOf(component.find('.Tab'), 1);
        });

        it('should not render if test errored with screenshot', () => {
            const imagesInfo = [{stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path'}];
            const testResult = mkTestResult_({status: ERROR, multipleTabs: true, reason: {}, screenshot: 'some-screen', imagesInfo});

            const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

            assert.lengthOf(component.find('.Tab'), 1);
        });

        [SUCCESS, FAIL].forEach((status) => {
            it(`should not render if test ${status}ed`, () => {
                const imagesInfo = [{stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path'}];
                const testResult = mkTestResult_({status, multipleTabs: true, reason: {}, imagesInfo});

                const component = mkConnectedComponent(<Body result={testResult} suite={{name: 'some-suite'}} />);

                assert.lengthOf(component.find('.Tab'), 1);
            });
        });
    });

    describe('"Retry" button', () => {
        it('should be disabled while tests running', () => {
            const testResult = mkTestResult_();

            const component = mkConnectedComponent(<Body result={testResult} />, {initialState: {running: true}});

            assert.isTrue(component.find('[name="↻ Retry"]').find('.button').prop('disabled'));
        });

        it('should be enabled if tests are not started yet', () => {
            const testResult = mkTestResult_();

            const component = mkConnectedComponent(<Body result={testResult} />, {initialState: {running: false}});

            assert.isUndefined(component.find('[name="↻ Retry"]').find('.button').prop('disabled'));
        });

        it('should call action "retryTest" on "handler" prop calling', () => {
            const bodyComponent: any = <Body
                result={mkTestResult_({name: 'bro'})}
                suite={{name: 'some-suite'}}
            />;
            const component = mkConnectedComponent(bodyComponent, {initialState: {running: false}});

            component.find('[name="↻ Retry"]').find('.button').simulate('click');

            assert.calledOnceWith(actionsStub.retryTest, {name: 'some-suite'}, 'bro');
        });
    });
});
