'use strict';

import React, {Component} from 'react';
import { cn } from '@bem-react/classname';

interface ISummaryItemProps {
    label: string;
    value: number;
    isFailed?: boolean;
    state?: string;
}

const cnSum = cn('Summary');

export default class SummaryItem extends Component<ISummaryItemProps> {

    render() {
        const {label, value, isFailed = false, state} = this.props;

        if (isFailed && value === 0) return null;

        return <>
            <div className={cnSum({state})}>
                <dt className={cnSum('Key', {'has-fails': isFailed})}>{label}</dt>
                <dd className={cnSum('Value')}>{value}</dd>
            </div>
        </>;
    }
}
