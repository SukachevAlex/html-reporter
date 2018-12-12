import _ from 'lodash';
import React, {Component, ComponentState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import ControlButton from '../../controls/button';
import State from '../../state/index';
import Description from './description';
import {isSuccessStatus, isErroredStatus} from '../../../../common-utils';
import { Segment, Tab } from 'semantic-ui-react';
import SwitcherRetry from '../switcher-retry';
import { Code } from './states/code';
import { Scripts } from './states/scripts';
import { cn } from '@bem-react/classname';

const actions = require('../../../modules/actions');

interface IBodyProps extends React.Props<any>{
    result: any;
    retries?: any;
    suite?: {};
    gui?: boolean;
    running?: boolean;
    actions?: any;
    view?: any;
    browserName?: string;
    singleViewMode?: string;
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
const cnBrowserName = cn('Browser-Name');
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
        const {metaInfo, suiteUrl, code, description, scripts} = activeResult;
       
        const {retries, browserName, result: {status}} = this.props;
        const Pane = (props: any) => <Tab.Pane >{props.children}</Tab.Pane>;

        const ImagePane = () => <Pane>{description && <Description content={description}/>} {this._getTabs()}</Pane>;
        const CodePane = () => <Pane><Code code={code} suiteUrl={suiteUrl} metaInfo={metaInfo} /></Pane>;
        const ScriptsPane = () => <Pane><Scripts /></Pane>;

        const tabs: ITab[] = [
            tabCreate({key: 'image', icon: 'file image', content: 'Image'}, ImagePane, this.hasImage),
            tabCreate({key: 'code', icon: 'code', content: 'Code'}, CodePane, code || metaInfo),
            tabCreate({key: 'scripts', icon: 'tasks', content: 'Tasks'}, ScriptsPane, scripts)
        ].filter((item: ITab) => item !== null) as ITab[];

        return (
            <Segment className={cnSection('Body')}>
                <div className={cnBrowserName({status})}>{browserName}</div>
                {this._addRetryButton()}
                <SwitcherRetry retries={retries} onChange={this.onSwitcherRetryChange} />
                <Tab panes={tabs} />
            </Segment>
        );
    }
}

export default connect<{}, {}, IBodyProps>(
    (state: any) => ({gui: state.gui, running: state.running}),
    (dispatch: Dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(Body);
