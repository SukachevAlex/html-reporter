import React, { Component } from 'react';
import { Statistic } from 'semantic-ui-react';

interface ISummaryItemProps {
    label: string;
    value: number;
    isFailed?: boolean;
    state?: string;
    color?: 'red' | 'orange' | 'yellow' | 'olive' | 'green' | 'teal' | 'blue' | 'violet' | 'purple' | 'pink' | 'brown' | 'grey' | 'black' | undefined;
}

export default class SummaryItem extends Component<ISummaryItemProps> {

    render() {
        const { label, value, isFailed = false, color } = this.props;

        if (isFailed && value === 0) return null;

        return (
            <Statistic color={color || 'black'}>
                <Statistic.Value>{value}</Statistic.Value>
                <Statistic.Label>{label}</Statistic.Label>
            </Statistic>
        );
    }
}
