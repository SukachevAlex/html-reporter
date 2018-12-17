import React from 'react';
import {connect} from 'react-redux';
import {Base, IBaseProps} from './section-base';
import BrowserSkippedTitle from './title/browser-skipped';
import Body from './body';
import {isFailStatus, isErroredStatus, isSkippedStatus} from '../../../common-utils';
import { Accordion, Icon } from 'semantic-ui-react';
import { cn } from '@bem-react/classname';
import url from 'url';
import {getColorState} from '../../modules/utils';

interface ISectionBrowserProps extends IBaseProps {
    browser: {
        name: string,
        result: any,
        retries: any[]
    };
    parsedHost?: string;
    suite?: {};
}

const cnSection = cn('Section');
const cnBrowserName = cn('Browser-Name');

export class SectionBrowser extends Base<ISectionBrowserProps>{

    constructor(props: ISectionBrowserProps) {
        super(props);
    }

    private _buildUrl(href: string, host: any) {
        return !host.hostname ? href : url.format({...url.parse(href), host});
    }

    render() {
        const {parsedHost} = this.props;
        const {name, result, retries, result: {status}} = this.props.browser;
        const active = !this.state.collapsed;

        return (
            <Accordion className={this._resolveSectionStatus(status)}>
                <Accordion.Title
                    onClick={this._toggleState}
                    active={active}
                    className={cnSection('Title')}
                >
                    <div className={cnBrowserName({status})}>
                        {name}
                        <a
                            style={{color: getColorState(status), textDecoration: 'none', marginLeft: '10px'}}
                            href={this._buildUrl(result.suiteUrl, parsedHost)}
                            onClick={(e) => e.stopPropagation()}
                            title='view in browser'
                            target='_blank'
                        >
                            <Icon name='eye' />
                        </a>
                    </div>
                </Accordion.Title>
                <Accordion.Content
                    className={cnSection('Body')}
                    active={active}
                >
                    {
                        this.state.skipped
                            ? <BrowserSkippedTitle result={result}/>
                            : <Body result={result} suite={this.props.suite} retries={retries} />
                    }
                </Accordion.Content>
            </Accordion>
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
    ({view: {expand, parsedHost}}: any) => ({expand, parsedHost}),
)(SectionBrowser);
