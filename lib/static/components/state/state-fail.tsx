import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import {cn} from '@bem-react/classname';
import {Icon, Button} from 'semantic-ui-react';

import Screenshot from './screenshot';

const cnImageBox = cn('ImageBox');

interface IStateFail {
    expected: string;
    actual: string;
    diff: string;
    showOnlyDiff: boolean;
    viewMode: string;
    overlay?: boolean;
    circleDiff: boolean;
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
        const {expected, actual, diff, viewMode, circleDiff, overlay = true} = this.props;

        switch (viewMode) {
            case '2-up': {
                return this._drawExpectedAndActual(expected, actual, circleDiff);
            }
            case 'OnionSkin': {
                return (
                    <Fragment>
                        <Button.Group basic>
                            <Button onPointerDown={createMovementHandler('top', -1, this)}>
                                <Icon name='angle up'/>
                            </Button>
                            <Button onPointerDown={createMovementHandler('left', -1, this)}>
                                <Icon name='angle left' />
                            </Button>
                            <Button onPointerDown={createMovementHandler('left', 1, this)}>
                                <Icon name='angle right' />
                            </Button>
                            <Button onPointerDown={createMovementHandler('top', 1, this)}>
                                <Icon name='angle down' />
                            </Button>
                        </Button.Group>
                        <div className='OnionWrapper'>
                            {this._drawExpectedAndActual(expected, actual, circleDiff, overlay)}
                        </div>
                    </Fragment>
                );
            }
            default: {
                return (
                    <Fragment>
                        {this._drawExpectedAndActual(expected, actual, circleDiff)}
                        {this._drawImageBox('Diff', diff, circleDiff)}
                    </Fragment>
                );
            }
        }
    }

    protected _drawExpectedAndActual(expected: string, actual: string, circleDiff: boolean, overlay?: boolean) {
        if (this.props.showOnlyDiff || this.props.viewMode === 'OnlyDiff') {
            return null;
        }

        return (
            <Fragment>
                {this._drawImageBox('Expected', expected, circleDiff, overlay)}
                {this._drawImageBox('Actual', actual, circleDiff)}
            </Fragment>
        );
    }

    protected _drawImageBox(label: string, path: string, circleDiff: boolean, overlay?: boolean) {
        if (!overlay){
            return (
                <div className={cnImageBox('Image')}>
                    <div className={cnImageBox('Title')}>{label}</div>
                    <Screenshot imagePath={path} circleDiff={circleDiff}/>
                </div>
            );
        } else {
            return (
                <div className={cnImageBox('Image', {overlay: true})} >
                    <Screenshot imagePath={path} circleDiff={circleDiff} style={{transform: `translateX(${this.state.left}px) translateY(${this.state.top}px)`}} />
                </div>
            );
        }
    }
}

export default connect(({view: {showOnlyDiff}}: {view: IStateFail}) => ({showOnlyDiff}))(StateFail);
