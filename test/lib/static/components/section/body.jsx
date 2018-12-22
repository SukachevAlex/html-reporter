"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var proxyquire_1 = require("proxyquire");
var utils_1 = require("../utils");
// @ts-ignore
var _a = require('../../../../../lib/constants/test-statuses'), SUCCESS = _a.SUCCESS, FAIL = _a.FAIL, ERROR = _a.ERROR, IDLE = _a.IDLE;
describe('<Body />', function () {
    var sandbox = sinon.createSandbox();
    var Body;
    var actionsStub;
    var utilsStub;
    beforeEach(function () {
        actionsStub = {
            acceptTest: sandbox.stub().returns({ type: 'some-type' }),
            retryTest: sandbox.stub().returns({ type: 'some-type' })
        };
        utilsStub = { isAcceptable: sandbox.stub() };
        Body = proxyquire_1.default('lib/static/components/section/body', {
            '../../../modules/utils': utilsStub,
            '../../../modules/actions': actionsStub
        }).default;
    });
    afterEach(function () { return sandbox.restore(); });
    it('should render accept button if "gui" is running', function () {
        var imagesInfo = [{ status: ERROR, actualPath: 'some/path', reason: '', image: true }];
        var testResult = utils_1.mkTestResult_({ imagesInfo: imagesInfo });
        var bodyComponent = <Body result={testResult}/>;
        var component = utils_1.mkConnectedComponent(bodyComponent, { initialState: { gui: true } });
        assert.equal(component.find('.Content-Header').find('[name="Accept"]').find('.button').text(), 'Accept');
    });
    describe('"Accept" button', function () {
        it('should be disabled if test result is not acceptable', function () {
            var imagesInfo = [{ status: ERROR, actualPath: 'some/path', reason: '', image: true }];
            var testResult = utils_1.mkTestResult_({ imagesInfo: imagesInfo });
            utilsStub.isAcceptable.withArgs(testResult).returns(false);
            var bodyComponent = <Body result={testResult}/>;
            var component = utils_1.mkConnectedComponent(bodyComponent, { initialState: { gui: true } });
            assert.isTrue(component.find('[name="Accept"]').find('.button').prop('disabled'));
        });
        // it('should be enabled if test result is acceptable', () => {
        //     const imagesInfo = [{status: ERROR, actualPath: 'some/path', reason: '', image: true}];
        //     const {reason, status} = imagesInfo[0];
        //     const testResult = mkTestResult_({imagesInfo});
        //     utilsStub.isAcceptable.withArgs({status, reason}).returns(true);
        //
        //     const bodyComponent: any = <Body result={testResult} />;
        //     const component = mkConnectedComponent(bodyComponent, {initialState: {gui: true}});
        //
        //     assert.isUndefined(component.find('[name="Accept"]').find('.button').prop('disabled'));
        // });
        // it('should run accept handler on click', () => {
        //     const imagesInfo = [{status: ERROR, actualPath: 'some/path', reason: '', image: true}];
        //     const {reason, status} = imagesInfo[0];
        //     const testResult = mkTestResult_({name: 'bro', imagesInfo});
        //     utilsStub.isAcceptable.withArgs({status, reason}).returns(true);
        //
        //     const bodyComponent: any = <Body result={testResult}/>;
        //     const component = mkConnectedComponent(bodyComponent, {initialState: {gui: true}});
        //
        //     component.find('[name="Accept"]').find('.button').simulate('click');
        //
        //     assert.calledOnce(actionsStub.acceptTest);
        // });
    });
    it('should render retry button if "gui" is running', function () {
        var bodyComponent = <Body result={utils_1.mkTestResult_()}/>;
        var component = utils_1.mkConnectedComponent(bodyComponent, { initialState: { gui: true } });
        assert.equal(component.find('.Content-Header').find('[name="Retry"]').find('.button').text(), 'Retry');
    });
    it('should not render retry and accept button if "gui" is not running', function () {
        var bodyComponent = <Body result={utils_1.mkTestResult_()}/>;
        var component = utils_1.mkConnectedComponent(bodyComponent, { initialState: { gui: false } });
        assert.lengthOf(component.find('.Content-Header').find('.button'), 0);
    });
    it('should call "acceptTest" action on Accept button click', function () {
        var retries = [];
        var imagesInfo = [{ status: ERROR, actualPath: 'some/path', reason: '', image: true }];
        var _a = imagesInfo[0], reason = _a.reason, status = _a.status;
        var testResult = utils_1.mkTestResult_({ name: 'bro', imagesInfo: imagesInfo });
        utilsStub.isAcceptable.withArgs({ status: status, reason: reason }).returns(true);
        var bodyComponent = <Body result={testResult} suite={{ name: 'some-suite' }} retries={retries}/>;
        var component = utils_1.mkConnectedComponent(bodyComponent);
        component.find('[name="Accept"]').find('.button').simulate('click');
        assert.calledOnceWith(actionsStub.acceptTest, { name: 'some-suite' }, 'bro', retries.length);
    });
    it('should render state for each state image', function () {
        var imagesInfo = [
            { stateName: 'plain1', status: ERROR, actualPath: 'some/path', reason: '' },
            { stateName: 'plain2', status: ERROR, actualPath: 'some/path', reason: '' }
        ];
        var testResult = utils_1.mkTestResult_({ name: 'bro', imagesInfo: imagesInfo });
        var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
        assert.lengthOf(component.find('.Tab'), 2);
    });
    it('should not render state if state images does not exist and test passed succesfully', function () {
        var testResult = utils_1.mkTestResult_({ status: SUCCESS });
        var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
        assert.lengthOf(component.find('.Tab'), 0);
    });
    it('should render additional tab if test errored without screenshot', function () {
        var imagesInfo = [{ stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path' }];
        var testResult = utils_1.mkTestResult_({ status: ERROR, multipleTabs: true, reason: {}, imagesInfo: imagesInfo });
        var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
        assert.lengthOf(component.find('.Tab'), 2);
    });
    describe('errored additional tab', function () {
        it('should render if test errored without screenshot and tool can use multi tabs', function () {
            var imagesInfo = [{ stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path' }];
            var testResult = utils_1.mkTestResult_({ status: ERROR, multipleTabs: true, reason: {}, imagesInfo: imagesInfo });
            var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
            assert.lengthOf(component.find('.Tab'), 2);
        });
        it('should not render if tool does not use multi tabs', function () {
            var imagesInfo = [{ stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path' }];
            var testResult = utils_1.mkTestResult_({ status: ERROR, multipleTabs: false, reason: {}, screenshot: 'some-screen', imagesInfo: imagesInfo });
            var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
            assert.lengthOf(component.find('.Tab'), 1);
        });
        it('should not render if test errored with screenshot', function () {
            var imagesInfo = [{ stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path' }];
            var testResult = utils_1.mkTestResult_({ status: ERROR, multipleTabs: true, reason: {}, screenshot: 'some-screen', imagesInfo: imagesInfo });
            var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
            assert.lengthOf(component.find('.Tab'), 1);
        });
        [SUCCESS, FAIL].forEach(function (status) {
            it("should not render if test " + status + "ed", function () {
                var imagesInfo = [{ stateName: 'plain1', status: SUCCESS, expectedPath: 'some/path' }];
                var testResult = utils_1.mkTestResult_({ status: status, multipleTabs: true, reason: {}, imagesInfo: imagesInfo });
                var component = utils_1.mkConnectedComponent(<Body result={testResult} suite={{ name: 'some-suite' }}/>);
                assert.lengthOf(component.find('.Tab'), 1);
            });
        });
    });
    describe('"Retry" button', function () {
        it('should be disabled while tests running', function () {
            var testResult = utils_1.mkTestResult_();
            var component = utils_1.mkConnectedComponent(<Body result={testResult}/>, { initialState: { running: true } });
            assert.isTrue(component.find('[name="Retry"]').find('.button').prop('disabled'));
        });
        it('should be enabled if tests are not started yet', function () {
            var testResult = utils_1.mkTestResult_();
            var component = utils_1.mkConnectedComponent(<Body result={testResult}/>, { initialState: { running: false } });
            assert.isUndefined(component.find('[name="Retry"]').find('.button').prop('disabled'));
        });
        it('should call action "retryTest" on "handler" prop calling', function () {
            var bodyComponent = <Body result={utils_1.mkTestResult_({ name: 'bro' })} suite={{ name: 'some-suite' }}/>;
            var component = utils_1.mkConnectedComponent(bodyComponent, { initialState: { running: false } });
            component.find('[name="Retry"]').find('.button').simulate('click');
            assert.calledOnceWith(actionsStub.retryTest, { name: 'some-suite' }, 'bro');
        });
    });
});
