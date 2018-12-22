import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {cn} from '@bem-react/classname';
import StateError from './state-error';
import StateSuccess from './state-success';
import StateFail from './state-fail';
import {isSuccessStatus, isFailStatus, isErroredStatus, isUpdatedStatus, isIdleStatus} from '../../../common-utils';
import {Button} from 'semantic-ui-react';

const cnScreeenshotViewMode = cn('ScreeenshotViewMode');
const cnImageBox = cn('ImageBox');

interface IState {
    state: {
        status: string;
        image?: boolean;
        reason: any;
        expectedPath?: string;
        expectedImg?: {
            path: string;
        };
        actualPath?: string;
        actualImg?: {
            path: string;
        }
        diffPath?: string;
        diffImg?: {
            path: string;
        };
        stateName: string;
    };
    acceptHandler: (a: any) => any;
    gui?: boolean;
    scaleImages?: boolean;
    color?: string;
}

class State extends Component<IState, {viewMode?: string, circleDiff?: boolean}> {
    protected _getStateTitle(stateName: string, status: string) {
        return stateName
            ? (<div className={`state-title state-title_${status}`}>{stateName}</div>)
            : null;
    }

    protected _screenshotViewMode(modeName: string) {
        return (() => {
            this.setState({ viewMode: modeName });
        }).bind(this);
    }

    protected _circleSmallDiff(circleDiff: boolean) {
        return(() => {
            circleDiff ? this.setState({ circleDiff: false }) : this.setState({ circleDiff: true });
        });
    }

    render() {
        const {state} = this.props;
        const {status, reason, image, stateName} = state;

        // Actual part
        const {actualPath: actual, actualImg} = state;
        const actualPath = actual || (actualImg && actualImg.path) || '';

        // Expected part
        const {expectedPath: expected, expectedImg} = state;
        const expectedPath = expected || (expectedImg && expectedImg.path) || '';

        // Diff part
        const {diffPath: diff, diffImg} = state;
        const diffPath = diff || (diffImg && diffImg.path) || '';

        let viewMode;
        let circleDiff = false;

        if (this.state) {
            viewMode = this.state.viewMode;
            if (this.state.circleDiff) circleDiff = this.state.circleDiff;
        }

        let elem = null;
        const {color} = this.props;
        let viewModeMenu = null;

        if (isErroredStatus(status)) {
            elem = <StateError image={Boolean(image)} actual={actualPath} reason={reason}/>;
        } else if (isSuccessStatus(status) || isUpdatedStatus(status) || (isIdleStatus(status) && expectedPath)) {
            elem = <StateSuccess status={status} expected={expectedPath} />;
        } else if (isFailStatus(status)) {
            elem = reason
                ? <StateError image={Boolean(image)} actual={actualPath} reason={reason}/>
                : <StateFail expected={expectedPath} actual={actualPath} diff={diffPath} viewMode={viewMode as string} circleDiff={circleDiff}/>;

            viewModeMenu = <div className={cnScreeenshotViewMode()}>
                <Button.Group basic>
                    <Button onClick={this._screenshotViewMode('Default')}>Default</Button>
                    <Button onClick={this._screenshotViewMode('2-up')}>2-up</Button>
                    <Button onClick={this._screenshotViewMode('OnlyDiff')}>Only Diff</Button>
                    <Button onClick={this._screenshotViewMode('OnionSkin')}>Onion Skin</Button>
                    <Button onClick={this._circleSmallDiff(circleDiff)}>Pixel hunting</Button>
                </Button.Group>
            </div>;
        }

        return (
            <Fragment>
                {this._getStateTitle(stateName, status)}
                {viewModeMenu}
                <div className={cnImageBox('Container', {scale: this.props.scaleImages})} style={{backgroundColor: color}} >
                    {elem}
                </div>
            </Fragment>
        );
    }
}

export default connect(({gui, view: {scaleImages}}: {gui: boolean, view: IState}) => ({gui, scaleImages}))(State);
