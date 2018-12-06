'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {retrySuite} from '../../../modules/actions';
import { Icon } from 'semantic-ui-react';
import { cn } from '@bem-react/classname';
import {classnames} from '@bem-react/classname';
const CopyToClipboard = require('react-copy-to-clipboard');

const cnSect = cn('Section');
<<<<<<< HEAD
const cnButton = cn('button');
=======
const cnButton = cn('button')
>>>>>>> refactor: migration to bem-react-classname

interface ISectionTitleProp extends React.Props<any>{
    name: string;
    suite: {
        suitePath: any[]
    };
    handler: (...args: any[]) => any;
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
        const {name, handler, gui} = this.props;

        return (
            <div className={cnSect('Title')} onClick={handler}>
                {name}
                {this._drawCopyButton()}
                {gui && this._drawRetryButton()}
            </div>
        );
    }

   private _drawCopyButton() {
        return (
            <CopyToClipboard
                title='Copy to clipboard'
                className={classnames(cnButton(), cnSect('Icon'))}
                text={this.props.suite.suitePath.join('/')}
                
            >
                <Icon name='copy' onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}></Icon>

            </CopyToClipboard>
        );
    }

    private _drawRetryButton() {
        return (
            <button
                className={classnames(cnButton(), cnSect('Icon', {retry: true}))}
                title='retry suite'
                onClick={this.onSuiteRetry}>
            </button>
        );
    }
}

export default connect<{}, {}, ISectionTitleProp>(({gui}: any) => ({gui}), {retrySuite})(SectionTitle);
