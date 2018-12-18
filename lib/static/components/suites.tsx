import React, {Component} from 'react';
import {connect} from 'react-redux';
import SectionCommon from './section/section-common';
import {bindActionCreators} from 'redux';
import {suiteBegin, testBegin, testResult, testsEnd} from '../modules/actions';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
const clientEvents = require('../../gui/constants/client-events');

interface ISuitesProps extends React.Props<any> {
    suiteIds?: string[];
    gui?: boolean;
    actions?: any;
}

class Suites extends Component<ISuitesProps> {
    private cache: CellMeasurerCache;
    protected list: List | null;
    protected measure: any;
    protected clearAll: () => void;

    constructor(props: ISuitesProps) {
        super(props);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 40
        });

        // binding
        this.clearAll = this.clearCacheAndUpd().bind(this);
        this.rowRender = this.rowRender.bind(this);
        this.clearCacheAndUpd = this.clearCacheAndUpd.bind(this);
    }

    componentDidMount() {
        this.props.gui && this._subscribeToEvents();
    }

    _subscribeToEvents() {
        const {actions}: any = this.props;
        const eventSource: EventSource = new EventSource('/events');
        eventSource.addEventListener(clientEvents.BEGIN_SUITE, (e: any) => {
            const data = JSON.parse(e.data);
            actions.suiteBegin(data);
        });

        eventSource.addEventListener(clientEvents.BEGIN_STATE, (e: any) => {
            const data = JSON.parse(e.data);
            actions.testBegin(data);
        });

        [clientEvents.TEST_RESULT, clientEvents.ERROR].forEach((eventName) => {
            eventSource.addEventListener(eventName, (e: any) => {
                const data = JSON.parse(e.data);
                actions.testResult(data);
            });
        });

        eventSource.addEventListener(clientEvents.END, () => {
            this.props.actions.testsEnd();
        });
    }

    protected clearCacheAndUpd(idx?: number) {
        let wrapper;

        if (idx === undefined || isNaN(+idx)) {
            wrapper = () => {
                this.cache.clearAll();
                this.list && this.list.recomputeRowHeights();
            };
        } else {
            wrapper = () => {
                this.cache.clear(idx, 0);
                this.list && this.list.recomputeRowHeights();
            };
        }

        return wrapper.bind(this);
    }

    rowRender({index, key, parent, style}: any) {
        const {suiteIds = []} = this.props;

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                {({measure}) => {
                    this.measure = measure.bind(this);

                    return <div style={style} onLoad={measure}>
                        <SectionCommon handler={this.clearAll} isRoot={true} suiteId={suiteIds[index]} />
                    </div>;
                }}
            </CellMeasurer>
        );
    }

    render() {
        const {suiteIds = []} = this.props;

        return (
            <AutoSizer className='sections' style={{height: 'calc(100vh - 240px)'}}>
                {({width, height}: any) =>
                    <List
                        deferredMeasurementCache={this.cache}
                        width={width}
                        height={height}
                        rowHeight={this.cache.rowHeight}
                        rowRenderer={this.rowRender}
                        rowCount={suiteIds.length}
                        ref={(elem) => { this.list = elem; }}
                        overscanRowCount={5}
                    />
                }
            </AutoSizer>
        );
    }

    componentDidUpdate() {
        this.clearAll();
    }
}

const actions = {testBegin, suiteBegin, testResult, testsEnd};

export default connect(
    (state: any) => ({
        suiteIds: state.suiteIds[state.view.viewMode],
        gui: state.gui,
    }),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(Suites);
