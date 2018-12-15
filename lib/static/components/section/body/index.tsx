import _ from 'lodash';
import React, {Component, ComponentState, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import ControlButton from '../../controls/button';
import State from '../../state/index';
import Description from './description';
import {isSuccessStatus, isErroredStatus} from '../../../../common-utils';
import { Segment, Tab, Button } from 'semantic-ui-react';
import SwitcherRetry from '../switcher-retry';
import { Code } from './states/code';
import { cn } from '@bem-react/classname';
import MetaInfo from './states/meta-info';
import { isAcceptable } from '../../../modules/utils';

const actions = require('../../../modules/actions');

interface IBodyProps extends React.Props<any>{
    result: any;
    retries?: any;
    suite?: {};
    gui?: boolean;
    running?: boolean;
    actions?: any;
    browserName?: string;
    state: {
        status: string;
        image?: boolean;
        reason: any;
        expectedPath: string;
        actualPath: string;
        diffPath: string;
        stateName: string;
    };
    acceptHandler: (a: any) => any;
}

interface IBodyStates extends ComponentState{
    color: number;
    retry: number;
}

interface IMenuItem {
    key: string;
    icon?: string;
    content: string;
}

type RenderType = () => JSX.Element;

interface ITab {
    menuItem?: IMenuItem;
    render?: RenderType;
}

export function tabCreate(menuItem: IMenuItem, render: RenderType, toExpect?: any): ITab | null {
    return toExpect
        ? {menuItem, render}
        : null;
}

const cnTab = cn('Tab');
const cnSection = cn('Section');

class Body extends Component<IBodyProps, IBodyStates> {

    static defaultProps: Partial<IBodyProps> = {
        retries: []
    };

    constructor(props: IBodyProps, state: IBodyStates) {
        super(props, state);

        this.state = {
            color: 1,
            retry: this.props.retries.length
        };
        this.onSwitcherRetryChange = this.onSwitcherRetryChange.bind(this);
        this.onTestRetry = this.onTestRetry.bind(this);
        this.onTestAccept = this.onTestAccept.bind(this);
    }

    onSwitcherRetryChange = (index: number) => {
        this.setState({retry: index});
    }

    onTestAccept = (stateName: any) => {
        const {result, suite} = this.props;

        this.props.actions.acceptTest(suite, result.name, this.state.retry, stateName);
    }

    onTestRetry = () => {
        const {result, suite} = this.props;

        this.props.actions.retryTest(suite, result.name);
    }

    private _addRetryButton = () => {
        const {gui, running} = this.props;

        return gui
            ? <ControlButton
                label='↻ Retry'
                isSuiteControl={true}
                isDisabled={running}
                handler={this.onTestRetry}
            />
            : null;
    }

    _getAcceptButton() {
        if (!this.props.gui) {
            return null;
        }

        const acceptHandler = this.onTestAccept;
        const activeResult = this._getActiveResult();
        if (activeResult.imagesInfo.length) {
            const {stateName, reason, status} = activeResult.imagesInfo[0];
            const acceptFn = () => acceptHandler(stateName);
            const isAcceptDisabled = !isAcceptable({status, reason});

            return (
                <ControlButton
                    label='✔ Accept'
                    isSuiteControl={true}
                    isDisabled={isAcceptDisabled}
                    handler={acceptFn}
                />
            );
        }
        return (
            <ControlButton
                label='✔ Accept'
                isDisabled={true}
                handler={() => {}}
            />
        );
    }

    private _getActiveResult = () => {
        const {result, retries} = this.props;

        return retries.concat(result)[this.state.retry];
    }

    get hasImage() {
        return !_.isEmpty(this._getActiveResult().imagesInfo);
    }

    private _getTabs() {
        const activeResult = this._getActiveResult();

        if (!this.hasImage) {
            return isSuccessStatus(activeResult.status) ? null : this._drawTab(activeResult);
        }

        const tabs = activeResult.imagesInfo.map((imageInfo: any, idx: number) => {
            const {stateName} = imageInfo;
            const reason = imageInfo.reason || activeResult.reason;
            const state = Object.assign({image: true, reason}, imageInfo);

            return this._drawTab(state, stateName || idx);
        });

        return this._shouldAddErrorTab(activeResult)
            ? tabs.concat(this._drawTab(activeResult))
            : tabs;
    }

    private _drawTab(state: any, key: string = '') {
        return (
            <div key={key} className={cnTab()}>
                <div className={cnTab('Item', { active: true })}>
                    <State state={state} acceptHandler={this.onTestAccept} />
                </div>
            </div>
        );
    }

    private _shouldAddErrorTab({multipleTabs, status, screenshot}: {multipleTabs: boolean, status: string, screenshot: boolean}) {
        return multipleTabs && isErroredStatus(status) && !screenshot;
    }

    render() {
        const activeResult = this._getActiveResult();
        const {metaInfo, suiteUrl, code, description} = activeResult;

        const {retries, result} = this.props;

        const Pane = (props: any) => <Tab.Pane >{props.children}</Tab.Pane>;
        const Image = () => <Fragment>{description && <Description content={description}/>} {this._getTabs()}</Fragment>;

        const ImagePane = () => <Pane><Image /></Pane>;
        const CodePane = () => <Pane><Code code={code} /></Pane>;
        const MetaInfoPane = () => <Pane><MetaInfo metaInfo={metaInfo} suiteUrl={suiteUrl} /></Pane>;
        const AllPane = () => <Pane>
            <MetaInfo metaInfo={metaInfo} suiteUrl={suiteUrl} />
            <Image />
            <Code code={code} />
        </Pane>;

        const tabs: ITab[] = [
            tabCreate({key: 'image', icon: 'file image', content: 'Image'}, ImagePane, this.hasImage),
            tabCreate({key: 'code', icon: 'code', content: 'Code'}, CodePane, code),
            tabCreate({key: 'multi-media', icon: 'file alternate outline', content: 'Meta-info'}, MetaInfoPane, metaInfo),
            tabCreate({key: 'all', icon: 'th', content: 'All'}, AllPane, true)
        ].filter((item: ITab) => item !== null) as ITab[];

        return (
            <Segment className={cnSection('Body')}>
                <div className={'Content-Header'}>
                    <Button.Group  floated='right'>
                        {this._addRetryButton()}
                        {this._getAcceptButton()}
                    </Button.Group>
                    <SwitcherRetry retries={retries} result={result} onChange={this.onSwitcherRetryChange} />
                </div>
                <Tab panes={tabs} />
            </Segment>
        );
    }
}

export default connect<{}, {}, IBodyProps>(
    (state: any) => ({gui: state.gui, running: state.running}),
    (dispatch: Dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(Body);
