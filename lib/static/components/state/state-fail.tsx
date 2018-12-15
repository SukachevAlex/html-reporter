import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Screenshot from './screenshot';
import { cn } from '@bem-react/classname';
const cnImageBox = cn('ImageBox');

interface IStateFail {
    expected: string;
    actual: string;
    diff: string;
    showOnlyDiff: boolean;
    viewMode: string;
    overlay?: boolean;
}
class StateFail extends Component<IStateFail> {

    render() {

        const { expected, actual, diff} = this.props;

        if (this.props.viewMode === '2-up'){

            return (
                <Fragment>
                    {this._drawExpectedAndActual(expected, actual)}
                </Fragment>
            );
        }
        if (this.props.viewMode === 'OnionSkin'){

            const {overlay = true} = this.props;

            return (
                <Fragment>
                    {this._drawExpectedAndActual(expected, actual, overlay)}
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
                    <Screenshot imagePath={path} />
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
