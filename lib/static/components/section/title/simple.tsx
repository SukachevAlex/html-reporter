import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {retrySuite} from '../../../modules/actions';
import { Icon } from 'semantic-ui-react';
import { cn, classnames } from '@bem-react/classname';

const cnButton = cn('button');
const cnSection = cn('Section');

const CopyToClipboard = require('react-copy-to-clipboard');

interface ISectionTitleProp extends React.Props<any>{
    name: string;
    suite: {
        suitePath: any[]
    };
    gui?: boolean;
    retrySuite?: any;
}

class SectionTitle extends Component<ISectionTitleProp> {

    constructor(props: ISectionTitleProp){
        super(props);

        // binding
        this.onSuiteRetry = this.onSuiteRetry.bind(this);
        this._drawCopyButton = this._drawCopyButton.bind(this);
        this._drawRetryButton = this._drawRetryButton.bind(this);
    }

    onSuiteRetry(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        this.props.retrySuite(this.props.suite);
    }

    render() {
        const {name, gui} = this.props;

        return <Fragment>
            {name}
            {this._drawCopyButton()}
            {gui && this._drawRetryButton()}
        </Fragment>;
    }

   private _drawCopyButton() {
        return (
            <CopyToClipboard
                title='Copy to clipboard'
                className={classnames(cnButton(), cnSection('Icon'))}
                text={this.props.suite.suitePath.join('/')}
            >
                <Icon name='copy outline' onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}></Icon>
            </CopyToClipboard>
        );
    }

    private _drawRetryButton() {
        return (
            <Icon
                name='redo'
                className={classnames(cnButton(), cnSection('Icon', {retry: true}))}
                title='retry suite'
                onClick={this.onSuiteRetry}>
            </Icon>
        );
    }
}

export default connect<{}, {}, ISectionTitleProp>(({gui}: any) => ({gui}), {retrySuite})(SectionTitle);
