import React from 'react';
import RunButton from '../../../../../lib/static/components/controls/run-button';
import proxyquire from 'proxyquire';
import {mkConnectedComponent} from '../utils';
import sinon from 'sinon';

declare const assert: any;

describe('<ControlButtons />', () => {
    const sandbox = sinon.createSandbox();

    let ControlButtons: any;
    let actionsStub: any;

    beforeEach(() => {
        actionsStub = {
            runAllTests: sandbox.stub().returns({type: 'some-type'}),
            runFailedTests: sandbox.stub().returns({type: 'some-type'}),
            acceptAll: sandbox.stub().returns({type: 'some-type'})
        };

        ControlButtons = proxyquire('lib/static/components/controls/gui-controls', {
            '../../modules/actions': actionsStub
        }).default;
    });

    afterEach(() => sandbox.restore());

    describe('"Run" button', () => {

        it('should pass "autoRun" prop', () => {
            const component = mkConnectedComponent(<ControlButtons />, {
                initialState: {autoRun: true}
            });

            assert.isTrue(component.find(RunButton).prop('autoRun'));
        });

        it('should call "runAllTests" action on click', () => {
            const component = mkConnectedComponent(<ControlButtons />, {
                initialState: {suiteIds: {all: ['some-suite']}, running: false}
            });

            component.find(RunButton).simulate('click');

            assert.calledOnceWith(actionsStub.runAllTests);
        });
    });

    [
        {name: 'Retry failed', handler: 'runFailedTests'},
        {name: 'Accept all', handler: 'acceptAll'}
    ].forEach((button) => {
        describe(`"${button.name}" button`, () => {

            it(`should call "${button.handler}" action on click`, () => {
                const failedSuite = {name: 'suite1', status: 'fail'};
                const component = mkConnectedComponent(<ControlButtons />, {
                    initialState: {
                        suites: {suite1: failedSuite},
                        suiteIds: {all: [], failed: ['suite1']},
                        running: false
                    }
                });

                component.find(`[label="${button.name}"]`).find('.item').simulate('click');

                assert.calledOnceWith(actionsStub[button.handler], [failedSuite]);
            });
        });
    });
});
