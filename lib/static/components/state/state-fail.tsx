import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Screenshot from './screenshot';

interface IStateFail {
    expected: string;
    actual: string;
    diff: string;
    showOnlyDiff: boolean;
    viewMode: string;
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

        return (
            <Fragment>
                {this._drawExpectedAndActual(expected, actual)}
                {this._drawImageBox('Diff', diff)}
            </Fragment>
        );
    }

    _drawExpectedAndActual(expected: string, actual: string) {
        if (this.props.showOnlyDiff || this.props.viewMode === 'OnlyDiff') {
            return null;
        }

        return (
            <Fragment>
                {this._drawImageBox('Expected', expected)}
                {this._drawImageBox('Actual', actual)}
            </Fragment>
        );
    }

    _drawImageBox(label: string, path: string) {
        return (
            <div className='image-box__image'>
                <div className='image-box__title'>{label}</div>
                <Screenshot imagePath={path} />
            </div>
        );
    }
}

export default connect(({ view: { showOnlyDiff} }: { view: IStateFail }) => ({ showOnlyDiff}))(StateFail);
