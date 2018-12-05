import React, {Component} from 'react';
import {connect} from 'react-redux';
import SummaryKey from './item';

interface ISummaryProps {
    stats: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        retries: number;
    };
}

class Summary extends Component<ISummaryProps> {

    render() {
        const {total, passed, failed, skipped, retries} = this.props.stats;

        return <>
            <h1>Html-reporter</h1>
            <dl className='SummaryWrapper'>
                <SummaryKey state='total' label='Total Tests' value={total}/>
                <SummaryKey state='passed' label='Passed' value={passed}/>
                <SummaryKey state='failed' label='Failed' value={failed} isFailed={failed > 0}/>
                <SummaryKey state='skipped' label='Skipped' value={skipped}/>
                <SummaryKey state='retries' label='Retries' value={retries}/>
            </dl>
        </>;
    }
}

export default connect<ISummaryProps>(({stats}: ISummaryProps) => ({stats}))(Summary);
