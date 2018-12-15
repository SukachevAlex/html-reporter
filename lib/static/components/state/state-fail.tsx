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

class StateFail extends Component<IStateFail, any> {
    state = {
        left: 0,
        top: 0
    };

    render() {
        const { expected, actual, diff} = this.props;

        if (this.props.viewMode === '2-up'){

            return (
                <Fragment>
                    {this._drawExpectedAndActual(expected, actual)}
                </Fragment>
            );
        }

        const self = this;

        function some(side: string, diff: number) {
            return () => {
                self.setState((state: any) => ({[side]: state[side] + diff}));
            };
        }

        if (this.props.viewMode === 'OnionSkin'){

            const {overlay = true} = this.props;

            return (
                <Fragment>
                    <Button.Group basic>
                        <Button onClick={some('top', -1)}><Icon name='angle down'/></Button>
                        <Button onClick={some('left', -1)}><Icon name='angle left' /></Button>
                        <Button onClick={some('left', 1)}><Icon name='angle right' /></Button>
                        <Button onClick={some('top', 1)}><Icon name='angle up' /></Button>
                    </Button.Group>
                    <div>
                        {this._drawExpectedAndActual(expected, actual, overlay)}
                    </div>
                </Fragment>
            );
        }

        return (
            <Fragment>
                {this._drawExpectedAndActual(expected, actual)}
                {this._drawImageBox('Diff', diff)}
            </Fragment>
        );
    }

    _drawExpectedAndActual(expected: string, actual: string, overlay?: boolean) {

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

    _drawImageBox(label: string, path: string, overlay?: boolean) {
        if (!overlay){
            return (
                <div className={cnImageBox('Image')}>
                    <div className={cnImageBox('Title')}>{label}</div>
                    <Screenshot imagePath={path} style={{marginLeft: `${this.state.left}px`, marginTop: `${this.state.top}px`}} />
                </div>
            );
        } else {
            return (
                <div className={cnImageBox('Image', {overlay: true})} >
                    <Screenshot imagePath={path} />
                </div>
            );
        }
    }
}

export default connect(({ view: { showOnlyDiff} }: { view: IStateFail }) => ({ showOnlyDiff}))(StateFail);
