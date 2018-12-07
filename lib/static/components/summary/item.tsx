import React, { Component } from 'react';
import { Statistic } from 'semantic-ui-react';

interface ISummaryItemProps {
    label: string;
    value: number;
    isFailed?: boolean;
    state?: string;
}

export default class SummaryItem extends Component<ISummaryItemProps> {

    render() {
        const { label, value, isFailed = false } = this.props;
        
        if (isFailed && value === 0) return null;

        return <>
            <Statistic.Value>{value}</Statistic.Value>
            <Statistic.Label>{label}</Statistic.Label>
        </>;
    }
}
