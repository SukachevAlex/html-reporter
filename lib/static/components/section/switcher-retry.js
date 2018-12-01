'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Pagination } from 'semantic-ui-react'

export default class SwitcherRetry extends Component {
    static propTypes = {
        retries: PropTypes.array,
        onChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        retries: []
    }

    constructor(props) {
        super(props);
        this.state = {retry: this.props.retries.length};
    }

    render() {
        const retries = this.props.retries;
        console.log(retries, 'retries')

        if (retries.length === 0) {
            return null;
        }

        return (
            <Pagination defaultActivePage={1} totalPages={retries.length} onPageChange={(event, data)=>this._onChange(data.activePage - 1)} />
        );
    }
    
    _onChange(index) {
        console.log(index, 'index')
        this.setState({retry: index});
        this.props.onChange(index);
    }
}

