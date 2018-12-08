import React, { Component } from 'react';
import { connect } from 'react-redux';
import SummaryKey from './item';
import { Statistic } from 'semantic-ui-react';

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
        const { total, passed, failed, skipped, retries } = this.props.stats;

        return <>
            <img src='logo.png'/>
            <dl className='SummaryWrapper'>
                <Statistic.Group widths='five' size={'mini'}>
                        <SummaryKey color='black' state='total' label='Total Tests' value={total} />
                        <SummaryKey color='olive' state='passed' label='Passed' value={passed} />
                        <SummaryKey color='red' state='failed' label='Failed' value={failed} isFailed={failed > 0} />
                        <SummaryKey color='grey' state='skipped' label='Skipped' value={skipped} />
                        <SummaryKey color='red' state='retries' label='Retries' value={retries} />
                </Statistic.Group>
            </dl>
        </>;
    }
}

export default connect<ISummaryProps>(({ stats }: ISummaryProps) => ({ stats }))(Summary);
