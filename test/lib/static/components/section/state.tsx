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
