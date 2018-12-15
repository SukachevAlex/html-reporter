import React from 'react';
import proxyquire from 'proxyquire';
import {mkConnectedComponent, mkTestResult_} from '../utils';

declare const sinon: any;
declare const assert: any;

describe('<State/>', () => {
    const sandbox = sinon.createSandbox();

    let State: any;
    let utilsStub: any;

    beforeEach(() => {
        utilsStub = {isAcceptable: sandbox.stub()};

        State = proxyquire('lib/static/components/state', {
            '../../modules/utils': utilsStub
        }).default;
    });

    // TODO: rewrite when Accept will moved
    // it('should render accept button if "gui" is running', () => {
    //     const stateComponent = mkConnectedComponent(
    //         // @ts-ignore
    //         <State state={mkTestResult_()} acceptHandler={() => {}} />,
    //         {initialState: {gui: true}}
    //     );

    //     assert.equal(stateComponent.find('.button_type_suite-controls').first().text(), '✔ Accept');
    // });
    // TODO: rewrite when Accept will moved
    // it('should not render accept button if "gui" is not running', () => {
    //     const stateComponent = mkConnectedComponent(
    //         // @ts-ignore
    //         <State state={mkTestResult_()} gui={false} acceptHandler={() => {}} />,
    //         {initialState: {gui: false}}
    //     );
    //
    //     assert.lengthOf(stateComponent.find('.button_type_suite-controls'), 0);
    // });

    // describe('"Accept" button', () => {
    //     it('should be disabled if test result is not acceptable', () => {
    //         const testResult = mkTestResult_({status: 'idle'});
    //         utilsStub.isAcceptable.withArgs(testResult).returns(false);

    //         const stateComponent = mkConnectedComponent(
    //             <State state={testResult} acceptHandler={() => {}} />,
    //             {initialState: {gui: true}}
    //         );

    //         assert.isTrue(stateComponent.find('[name="✔ Accept"]').find('.button').prop('disabled'));
    //     });

    //     it('should be enabled if test result is acceptable', () => {
    //         const testResult = mkTestResult_();
    //         utilsStub.isAcceptable.withArgs(testResult).returns(true);

    //         const stateComponent = mkConnectedComponent(
    //             <State state={testResult} acceptHandler={() => {}} />,
    //             {initialState: {gui: true}}
    //         );

    //         assert.isUndefined(stateComponent.find('[name="✔ Accept"]').find('.button').prop('disabled'));
    //     });

    //     it('should run accept handler on click', () => {
    //         const testResult = mkTestResult_({name: 'bro'});
    //         const acceptHandler = sinon.stub();

    //         utilsStub.isAcceptable.withArgs(testResult).returns(true);

    //         const stateComponent = mkConnectedComponent(
    //             <State state={testResult} acceptHandler={acceptHandler} />,
    //             {initialState: {gui: true}}
    //         );

    //         stateComponent.find('[name="✔ Accept"]').find('.button').simulate('click');

    //         assert.calledOnce(acceptHandler);
    //     });
    // });

    describe('scaleImages', () => {
        it('should not scale images by default', () => {
            const testResult = mkTestResult_();

            const stateComponent = mkConnectedComponent(<State state={testResult} acceptHandler={() => {}} />);
            const imageContainer = stateComponent.find('.ImageBox-Container');

            assert.isFalse(imageContainer.hasClass('ImageBox-Container_scale'));
        });

        it('should scale images if "scaleImages" option is enabled', () => {
            const testResult = mkTestResult_();

            const stateComponent = mkConnectedComponent(
                <State state={testResult} acceptHandler={() => {}} />,
                {initialState: {view: {scaleImages: true}}}
            );
            const imageContainer = stateComponent.find('.ImageBox-Container');

            assert.isTrue(imageContainer.hasClass('ImageBox-Container_scale'));
        });
    });

    describe('lazyLoad', () => {
        it('should load images lazy if lazy load offset is specified', () => {
            const stateComponent = mkConnectedComponent(
                <State state={mkTestResult_({status: 'success'})} acceptHandler={() => {}} />,
                {initialState: {view: {lazyLoadOffset: 800}}}
            );
            const lazyLoadContainer = stateComponent.find('.lazyload-placeholder');

            assert.lengthOf(lazyLoadContainer, 1);
        });

        it('should not load images lazy if lazy load offset is 0', () => {
            const stateComponent = mkConnectedComponent(
                <State state={mkTestResult_({status: 'success'})} acceptHandler={() => {}} />,
                {initialState: {view: {lazyLoadOffset: 0}}}
            );
            const lazyLoadContainer = stateComponent.find('.lazyload-placeholder');

            assert.lengthOf(lazyLoadContainer, 0);
        });

        it('should not load images lazy of lazy load offset is not specified', () => {
            const stateComponent = mkConnectedComponent(
                <State state={mkTestResult_({status: 'success'})} acceptHandler={() => {}} />
            );
            const lazyLoadContainer = stateComponent.find('.lazyload-placeholder');

            assert.lengthOf(lazyLoadContainer, 0);
        });
    });
});
