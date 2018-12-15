import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Screenshot from './screenshot';
import { cn } from '@bem-react/classname';
import {Icon, Button} from 'semantic-ui-react';

const cnImageBox = cn('ImageBox');

interface IStateFail {
    expected: string;
    actual: string;
    diff: string;
    showOnlyDiff: boolean;
    viewMode: string;
    overlay?: boolean;
}

function createMovementHandler(side: string, diff: number, ctx: any) {
    return () => ctx.setState((state: any) => ({[side]: state[side] + diff}));
}

class StateFail extends Component<IStateFail, any> {
    state = {
        left: 0,
        top: 0
    };

    render() {
        const { expected, actual, diff, viewMode, overlay = true} = this.props;

        switch (viewMode) {
            case '2-up': {
                return this._drawExpectedAndActual(expected, actual);
            }
            case 'OnionSkin': {
                return (
                    <Fragment>
                        <Button.Group basic>
                            <Button onClick={createMovementHandler('top', -1, this)}><Icon name='angle up'/></Button>
                            <Button onClick={createMovementHandler('left', -1, this)}><Icon name='angle left' /></Button>
                            <Button onClick={createMovementHandler('left', 1, this)}><Icon name='angle right' /></Button>
                            <Button onClick={createMovementHandler('top', 1, this)}><Icon name='angle down' /></Button>
                        </Button.Group>
                        <div>
                            {this._drawExpectedAndActual(expected, actual, overlay)}
                        </div>
                    </Fragment>
                );
            }
            default: {
                return (
                    <Fragment>
                        {this._drawExpectedAndActual(expected, actual)}
                        {this._drawImageBox('Diff', diff)}
                    </Fragment>
                );
            }
        }
    }

    protected _drawExpectedAndActual(expected: string, actual: string, overlay?: boolean) {
        if (this.props.showOnlyDiff || this.props.viewMode === 'OnlyDiff') {
            return null;
        }

        return (
            <Fragment>
                {this._drawImageBox('Expected', expected, overlay)}
                {this._drawImageBox('Actual', actual)}
            </Fragment>
        );
    }

    protected _drawImageBox(label: string, path: string, overlay?: boolean) {
        if (!overlay){
            return (
                <div className={cnImageBox('Image')}>
                    <div className={cnImageBox('Title')}>{label}</div>
                    <Screenshot imagePath={path} />
                </div>
            );
        } else {
            return (
                <div className={cnImageBox('Image', {overlay: true})} >
                    <Screenshot imagePath={path} style={{transform: `translateX(${this.state.left}px) translateY(${this.state.top}px)`}} />
                </div>
            );
        }
    }
}

export default connect(({ view: { showOnlyDiff} }: { view: IStateFail }) => ({ showOnlyDiff}))(StateFail);
