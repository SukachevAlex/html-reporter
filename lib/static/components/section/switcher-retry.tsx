import React, {Component, ComponentState} from 'react';
import PaginationExtended from './pagination-redefinition';
import { cn } from '@bem-react/classname';
const cnPagination = cn('Pswitcher');

interface ISwitcherRetryProps extends React.Props<any>{
    retries?: any[];
    result: any;
    siblingRange?: number;
    onChange(index: number): void;
}

interface ISwitcherRetryStates extends ComponentState{
    retry: number;
}

export default class SwitcherRetry extends Component<ISwitcherRetryProps, ISwitcherRetryStates> {

    public static defaultProps: Partial<ISwitcherRetryProps> = {
        retries: [],
        siblingRange: 3,
    };

    constructor(props: ISwitcherRetryProps, state: ISwitcherRetryStates) {
        super(props, state);
        this.state = {retry: !this.props.retries ? 0 : this.props.retries.length};
        this._onChange = this._onChange.bind(this);

        // TODO: remove that
        this.props.retries && this.props.retries.push(this.props.result);
    }

    render() {
        const {retries = [], siblingRange} = this.props;

        // TODO: if "TODO: remove that" did, rewrite "1" to "0"
        if (retries.length === 1) {
            return null;
        }

        return (
            <div className={cnPagination()} >
                <PaginationExtended
                    defaultActivePage={retries.length}
                    totalPages={retries.length}
                    firstItem={null}
                    lastItem={null}
                    onPageChange={(event, data: any) => data && this._onChange(data.activePage)}
                    siblingRange={siblingRange}
                    retries={retries}
                />
            </div>
        );
    }

    private _onChange(index: number) {
        this.setState({retry: index});
        this.props.onChange(index);
    }
}
