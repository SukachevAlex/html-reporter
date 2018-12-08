import React from 'react';
import {connect} from 'react-redux';
import {uniqueId, merge} from 'lodash';
import {Base, IBaseProps} from './section-base';
import SectionBrowser from './section-browser';
import {allSkipped, hasFails, hasRetries, getColorState} from '../../modules/utils';
import Title from './title/simple';
import BrowserTitle from './title/browser';
import { Accordion, Icon } from 'semantic-ui-react';
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
}

const cnSection = cn('Section');

export class SectionCommon extends Base<ISectionCommonProps>{
    constructor(props: ISectionCommonProps) {
        super(props);
    }

    render()  {
        const {suite, expand, isRoot} = this.props;

        if (!suite)
            return null;

        const {name, suitePath, browsers = [], children = [], status} = suite;

        const cnStatus = this._resolveSectionStatus(status);

        if (isRoot) {
            return (
                <Accordion
                    exclusive={false}
                    styled
                    style={{width: '100%'}}
                    className={cnStatus}
                >
                    <Accordion.Title
                        active={!this.state.collapsed}
                        className={cnSection('Title', {status: cnStatus})}
                        onClick={this._toggleState}
                        style={{color: getColorState(status)}}
                    >
                        <Icon name='dropdown' />
                        <Title name={name} suite={suite} />
                    </Accordion.Title>
                    <Accordion.Content
                        className={cnSection('Body')}
                        active={!this.state.collapsed}
                    >
                        <SectionCommon
                            isRoot={false}
                            suite={suite}
                            expand={expand}
                        />
                    </Accordion.Content>
                </Accordion>
            );
        }

        return <Accordion
            exclusive={false}
            styled
            style={{width: '100%'}}
            className={cnStatus}
            panels={merge(
                    children.map((child: IChild) => {
                        const key = uniqueId(`${suitePath}-${name}`);
                        return {
                            key,
                            title: {
                                content: <Title name={child.name} suite={child} />,
                                className: cnSection('Title'),
                                onClick: this._toggleState,
                                style: {color: getColorState(child.status)}
                            },
                            content: {
                                content: <SectionCommon key={key} suite={child} expand={expand} />,
                                className: cnSection('Body', {guided: true})
                            }
                        };
                    }),
                    browsers.map((browser: IBrowser) => {
                        return {
                            key: browser.name,
                            title: {
                                content: <BrowserTitle name={browser.name} result={browser.result} />,
                                className: cnSection('Title', {skipped: browser.result.skipped}),
                                onClick: this._toggleState,
                                style: {color: getColorState(browser.result.status)},
                            },
                            content: {
                                content: <SectionBrowser key={browser.name} browser={browser} expand={expand} suite={suite} />,
                            }
                        };
                    })
                )}
        />;
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
    ({view: {expand, viewMode}, suites}: any, ownProps: any) => {
        return {
            expand,
            viewMode,
            suite: suites[ownProps.suiteId],
            title: ownProps.suiteId,
            isRoot: true
        };
    }
)(SectionCommon);
