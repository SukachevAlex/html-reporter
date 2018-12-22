"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var proxyquire_1 = require("proxyquire");
var utils_1 = require("../utils");
describe('<State/>', function () {
    var sandbox = sinon.createSandbox();
    var State;
    var utilsStub;
    beforeEach(function () {
        utilsStub = { isAcceptable: sandbox.stub() };
        State = proxyquire_1.default('lib/static/components/state', {
            '../../modules/utils': utilsStub
        }).default;
    });
    // TODO: rewrite
    // it('should render accept button if "gui" is running', () => {
    //     const stateComponent = mkConnectedComponent(
    //         // @ts-ignore
    //         <State state={mkTestResult_()} acceptHandler={() => {}} />,
    //         {initialState: {gui: true}}
    //     );
    //     assert.equal(stateComponent.find('.button_type_suite-controls').first().text(), '✔ Accept');
    // });
    it('should not render accept button if "gui" is not running', function () {
        var stateComponent = utils_1.mkConnectedComponent(
        // @ts-ignore
        <State state={utils_1.mkTestResult_()} gui={false} acceptHandler={function () { }}/>, { initialState: { gui: false } });
        assert.lengthOf(stateComponent.find('.button_type_suite-controls'), 0);
    });
    describe('"Accept" button', function () {
        it('should be disabled if test result is not acceptable', function () {
            var testResult = utils_1.mkTestResult_({ status: 'idle' });
            utilsStub.isAcceptable.withArgs(testResult).returns(false);
            var stateComponent = utils_1.mkConnectedComponent(<State state={testResult} acceptHandler={function () { }}/>, { initialState: { gui: true } });
            assert.isTrue(stateComponent.find('[label="✔ Accept"]').prop('isDisabled'));
        });
        it('should be enabled if test result is acceptable', function () {
            var testResult = utils_1.mkTestResult_();
            utilsStub.isAcceptable.withArgs(testResult).returns(true);
            var stateComponent = utils_1.mkConnectedComponent(<State state={testResult} acceptHandler={function () { }}/>, { initialState: { gui: true } });
            assert.isFalse(stateComponent.find('[label="✔ Accept"]').prop('isDisabled'));
        });
        it('should run accept handler on click', function () {
            var testResult = utils_1.mkTestResult_({ name: 'bro' });
            var acceptHandler = sinon.stub();
            utilsStub.isAcceptable.withArgs(testResult).returns(true);
            var stateComponent = utils_1.mkConnectedComponent(<State state={testResult} acceptHandler={acceptHandler}/>, { initialState: { gui: true } });
            stateComponent.find('[label="✔ Accept"]').simulate('click');
            assert.calledOnce(acceptHandler);
        });
    });
    describe('scaleImages', function () {
        // TODO: rewrite
        // it('should not scale images by default', () => {
        //     const testResult = mkTestResult_();
        //     const stateComponent = mkConnectedComponent(<State state={testResult} acceptHandler={() => {}} />);
        //     const imageContainer = stateComponent.find('.image-box__container');
        //     assert.isFalse(imageContainer.hasClass('image-box__container_scale'));
        // });
        // TODO: rewrite
        // it('should scale images if "scaleImages" option is enabled', () => {
        //     const testResult = mkTestResult_();
        //     const stateComponent = mkConnectedComponent(
        //         <State state={testResult} acceptHandler={() => {}} />,
        //         {initialState: {view: {scaleImages: true}}}
        //     );
        //     const imageContainer = stateComponent.find('.image-box__container');
        //     assert.isTrue(imageContainer.hasClass('image-box__container_scale'));
        // });
    });
    describe('lazyLoad', function () {
        // TODO: rewrite
        // it('should load images lazy if lazy load offset is specified', () => {
        //     const stateComponent = mkConnectedComponent(
        //         <State state={mkTestResult_({status: 'success'})} acceptHandler={() => {}} />,
        //         {initialState: {view: {lazyLoadOffset: 800}}}
        //     );
        //     const lazyLoadContainer = stateComponent.find('.LazyLoad');
        //     assert.lengthOf(lazyLoadContainer, 1);
        // });
        it('should not load images lazy if lazy load offset is 0', function () {
            var stateComponent = utils_1.mkConnectedComponent(<State state={utils_1.mkTestResult_({ status: 'success' })} acceptHandler={function () { }}/>, { initialState: { view: { lazyLoadOffset: 0 } } });
            var lazyLoadContainer = stateComponent.find('.LazyLoad');
            assert.lengthOf(lazyLoadContainer, 0);
        });
        it('should not load images lazy of lazy load offset is not specified', function () {
            var stateComponent = utils_1.mkConnectedComponent(<State state={utils_1.mkTestResult_({ status: 'success' })} acceptHandler={function () { }}/>);
            var lazyLoadContainer = stateComponent.find('.LazyLoad');
            assert.lengthOf(lazyLoadContainer, 0);
        });
    });
});
