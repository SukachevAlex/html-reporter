import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../modules/actions';
import {Dropdown} from 'semantic-ui-react';

interface IExpandSelect {
    view: any;
    actions: any;
    options: any;
}

class BrowserSelect extends Component<IExpandSelect> {

    constructor(props: any) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    render() {
        const {view, options} = this.props;
        return (
            <Dropdown item search selection options={options} value={view.filter} onChange={this._onChange}/>
        );
    }

    _onChange(event: any, {value}: any) {
        this.props.actions.filterBrowser(value);
    }
}

export default connect(
    (state: any) => ({view: state.view}),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(BrowserSelect);
