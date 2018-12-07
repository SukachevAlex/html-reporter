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
            <h1>Html-reporter</h1>
            <dl className='SummaryWrapper'>
                <Statistic.Group widths='five' size={'mini'}>
                    <Statistic color='black'>
                        <SummaryKey state='total' label='Total Tests' value={total} />
                    </Statistic>
                    <Statistic color='olive'>
                        <SummaryKey state='passed' label='Passed' value={passed} />
                    </Statistic>
                    <Statistic color='red'>
                        <SummaryKey state='failed' label='Failed' value={failed} isFailed={failed > 0} />
                    </Statistic>
                    <Statistic color='grey'>
                        <SummaryKey state='skipped' label='Skipped' value={skipped} />
                    </Statistic>
                    <Statistic color='orange'>
                        <SummaryKey state='retries' label='Retries' value={retries} />
                    </Statistic>
                </Statistic.Group>
            </dl>
        </>;
    }
}

export default connect<ISummaryProps>(({ stats }: ISummaryProps) => ({ stats }))(Summary);
