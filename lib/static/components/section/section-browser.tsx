'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Base, IBaseProps} from './section-base';
import BrowserSkippedTitle from './title/browser-skipped';
import Body from './body';
import {isFailStatus, isErroredStatus, isSkippedStatus} from '../../../common-utils';
import { Accordion } from 'semantic-ui-react';

interface ISectionBrowserProps extends IBaseProps {
    browser: {
        name: string,
        result: any,
        retries: any[]
    };
    suite?: {};
}

export class SectionBrowser extends Base<ISectionBrowserProps>{

    constructor(props: ISectionBrowserProps) {
        super(props);
    }

    render() {
        const {name, result, retries, result: {status}} = this.props.browser;

        return (
            <Accordion.Content className={this._resolveSectionStatus(status)}>
                {
                    this.state.skipped
                        ? <BrowserSkippedTitle result={result}/>
                        : <Body result={result} suite={this.props.suite} retries={retries} browserName={name}/>
                }
            </Accordion.Content>
        );
    }

    protected _getStateFromProps() {
        const {expand, browser} = this.props;
        const {result: {status}, retries = []} = browser;
        const failed = isErroredStatus(status) || isFailStatus(status);
        const retried = retries.length > 0;
        const skipped = isSkippedStatus(status);

        return {failed, retried, skipped, expand};
    }
}

export default connect<{}, {}, ISectionBrowserProps>(
    ({view: {expand}}: any) => ({expand})
)(SectionBrowser);
