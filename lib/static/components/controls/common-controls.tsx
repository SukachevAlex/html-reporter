import React, {Component, Fragment} from 'react';
import {Menu} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../modules/actions';
import ViewSelect from './view-select';
import BaseHostInput from './base-host';
import ExpandSelect from './expand-select';
import BrowserSelect from './browser-select';

interface IControlButtons {
    view: any;
    actions: any;
    browsers: string[];
}

class CommonControlButtons extends Component<IControlButtons> {
    constructor(props: IControlButtons){
        super(props);
    }

    render() {
        const {view, actions, browsers} = this.props;

        const browsersArray = [{value: 'all', text: 'All browsers'}];
        browsers.forEach((elem: string)  => {
            browsersArray.push({
                value: elem,
                text: elem
            });
        });

        return (
            <Fragment>
                <ViewSelect options = {[
                    {value: 'all', text: 'Show all'},
                    {value: 'failed', text: 'Show only failed'}
                ]}/>
                <ExpandSelect options = {[
                    {value: 'all', text: 'Expand all'},
                    {value: 'none', text: 'Collapse all'},
                    {value: 'errors', text: 'Expand errors'},
                    {value: 'retries', text: 'Expand retries'}
                ]}/>
                <BrowserSelect options = {browsersArray}/>
                <Menu.Item
                    name='show_skipped'
                    active={view.showSkipped}
                    onClick={actions.toggleSkipped}
                >
                    Show skipped
                </Menu.Item>
                <Menu.Item
                    name='show_diff'
                    active={view.showOnlyDiff}
                    onClick={actions.toggleOnlyDiff}
                >
                    Show only diff
                </Menu.Item>
                <Menu.Item
                    name='show_images'
                    active={view.scaleImages}
                    onClick={actions.toggleScaleImages}
                >
                    Scale images
                </Menu.Item>
                <Menu.Item
                    name='lazy_load'
                    active={Boolean(view.lazyLoadOffset)}
                    onClick={actions.toggleLazyLoad}
                >
                    Lazy load
                </Menu.Item>
                <BaseHostInput/>
            </Fragment>
        );
    }
}

export default connect(
    (state: any) => ({
        view: state.view,
        browsers: state.browsers
    }),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(CommonControlButtons);
