import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { cn } from '@bem-react/classname';
import StateError from './state-error';
import StateSuccess from './state-success';
import StateFail from './state-fail';
import ControlButton from '../controls/button';
import { isAcceptable } from '../../modules/utils';
import { isSuccessStatus, isFailStatus, isErroredStatus, isUpdatedStatus, isIdleStatus } from '../../../common-utils';
import { Button } from 'semantic-ui-react';
const cnScreeenshotViewMode = cn('ScreeenshotViewMode');
const cnImageBox = cn('ImageBox');

interface IState {
    state: {
        status: string;
        image?: boolean;
        reason: any;
        expectedPath: string;
        actualPath: string;
        diffPath: string;
        stateName: string;
    };
    acceptHandler: (a: any) => any;
    gui?: boolean;
    scaleImages?: boolean;
}

class State extends Component<IState, {viewMode?: string}> {

    _getAcceptButton() {
        if (!this.props.gui) {
            return null;
        }

        const { state, state: { stateName }, acceptHandler } = this.props;
        const isAcceptDisabled = !isAcceptable(state);
        const acceptFn = () => acceptHandler(stateName);

        return (
            <ControlButton
                label='✔ Accept'
                isSuiteControl={true}
                isDisabled={isAcceptDisabled}
                handler={acceptFn}
            />
        );
    }

    _getStateTitle(stateName: string, status: string) {
        return stateName
            ? (<div className={`state-title state-title_${status}`}>{stateName}</div>)
            : null;
    }

    _screenshotViewMode(modeName: string) {
        return (() => {
            this.setState({ viewMode: modeName });
        }).bind(this);
    }

    render() {
        const { status, reason, image, expectedPath, actualPath, diffPath, stateName } = this.props.state;
        let viewMode;

        if (this.state) {
            viewMode = this.state.viewMode;
        }

        let elem = null;

        if (isErroredStatus(status)) {
            elem = <StateError image={Boolean(image)} actual={actualPath} reason={reason} />;
        } else if (isSuccessStatus(status) || isUpdatedStatus(status) || (isIdleStatus(status) && expectedPath)) {
            elem = <StateSuccess status={status} expected={expectedPath} />;
        } else if (isFailStatus(status)) {
            elem = reason
                ? <StateError image={Boolean(image)} actual={actualPath} reason={reason} />
                : <StateFail expected={expectedPath} actual={actualPath} diff={diffPath} viewMode={viewMode as string} />;
        }

        return (
            <Fragment>
                {this._getStateTitle(stateName, status)}
                {this._getAcceptButton()}
                <div className={cnScreeenshotViewMode()}>
                    <Button.Group basic>
                        <Button onClick={this._screenshotViewMode('Default')}>Default</Button>
                        <Button onClick={this._screenshotViewMode('2-up')}>2-up</Button>
                        <Button onClick={this._screenshotViewMode('OnlyDiff')}>Only Diff</Button>
                        <Button>Loupe</Button>
                        <Button>Swipe</Button>
                        <Button>Onion Skin</Button>
                    </Button.Group>
                </div>
                <div className={cnImageBox('Container', { scale: this.props.scaleImages })} >
                    {elem}
                </div>
            </Fragment>
        );
    }
}

export default connect(
    ({ gui, view: { scaleImages } }: { gui: boolean, view: IState }) => ({ gui, scaleImages }))
    (State);
