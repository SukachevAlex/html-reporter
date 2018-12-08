import React from 'react';
import {connect} from 'react-redux';
import {uniqueId, merge} from 'lodash';
import {Base, IBaseProps} from './section-base';
import SectionBrowser from './section-browser';
import {allSkipped, hasFails, hasRetries, getColorState} from '../../modules/utils';
import Title from './title/simple';
// import BrowserTitle from './title/browser';
import { Accordion } from 'semantic-ui-react';
import { cn } from '@bem-react/classname';

interface IBrowser{
    name: string;
    result: any;
    retries: any[];
}

interface IChild{
    name: string;
    suitePath: any[];
    browsers: IBrowser[];
    children: any[];
    status?: string;
    result?: any;
}

interface ISectionCommonProps extends IBaseProps{
    suiteId?: string;
    suite?: IChild;
    titile?: string;
    isRoot?: boolean;
    actions?: any;
    filter?: string[];
}

const cnSection = cn('Section');

export class SectionCommon extends Base<ISectionCommonProps>{
    constructor(props: ISectionCommonProps) {
        super(props);
    }

    render()  {
        const {suite, expand, isRoot, filter} = this.props;

        if (!suite) return null;

        const {name, suitePath, browsers = [], children = [], status} = suite;

        const cnStatus = this._resolveSectionStatus(status);
        const active = !this.state.collapsed;

        const args = {
            exclusive: false,
            styled: true,
            style: {
                width: '100%',
                marginTop: '5px'
            },
            className: cnStatus,
        };

        const title = (
            <Accordion.Title
                onClick={this._toggleState}
                active={active}
                style={{
                    color: getColorState(status),
                }}
                className={cnSection('Title')}
            >
                <Title name={name} suite={suite} />
            </Accordion.Title>
        );

        const content = (
            <Accordion.Content
                className={cnSection('Body')}
                active={active}
                style={{
                    paddingRight: '0',
                    paddingLeft: '10px'
                }}
            >
                <Accordion {...args}>
                    {merge(
                        children.map((child: IChild) => {
                            const key = uniqueId(`${suitePath}-${name}`);
                            return <SectionCommon key={key} suite={child} isRoot={false} expand={expand} />;
                        }),
                        browsers.map((browser: IBrowser) => {
                            if (filter && filter.indexOf(browser.name) > -1){
                                return <SectionBrowser key={browser.name} browser={browser} suite={suite}/>;
                            } else {
                                return null;
                            }
                        })
                    )}
                </Accordion>
            </Accordion.Content>
        );

        return isRoot
            ? <Accordion {...args}>
                {title}
                {content}
            </Accordion>
            : <>
                {title}
                {content}
            </>;

    }

    protected _getStateFromProps() {
        const {suite, expand} = this.props;

        return {
            failed: hasFails(suite),
            retried: hasRetries(suite),
            skipped: allSkipped(suite),
            expand
        };
    }
}

export default connect<{}, {}, ISectionCommonProps>(
    ({view: {expand, viewMode, filter}, suites}: any, ownProps: any) => {
        return {
            expand,
            viewMode,
            suite: suites[ownProps.suiteId],
            title: ownProps.suiteId,
            isRoot: true,
            filter
        };
    }
)(SectionCommon);
