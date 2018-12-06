import React, {Component, ComponentState} from 'react';
import { Pagination } from 'semantic-ui-react';
import { cn } from '@bem-react/classname';
const cnPagination = cn('Pswitcher');

interface ISwitcherRetryProps extends React.Props<any>{
    retries?: any[];
    onChange(index: number): void;
}

interface ISwitcherRetryStates extends ComponentState{
    retry: number;
}

export default class SwitcherRetry extends Component<ISwitcherRetryProps, ISwitcherRetryStates> {

    public static defaultProps: Partial<ISwitcherRetryProps> = {
        retries: []
    };

    constructor(props: ISwitcherRetryProps, state: ISwitcherRetryStates) {
        super(props, state);
        this.state = {retry: !this.props.retries ? 0 : this.props.retries.length};
        this._onChange = this._onChange.bind(this);
    }

    render() {
        const retries = this.props.retries;

        if (!retries || retries.length === 0) {
            return null;
        }

        return (
            <div className={cnPagination()} >
                <Pagination
                    defaultActivePage={retries.length}
                    totalPages={retries.length}
                    firstItem={null}
                    lastItem={null}
                    onPageChange={(event, data: any) => data && this._onChange(data.activePage - 1)}
                />
            </div>
        );
    }

    private _onChange(index: number) {
        this.setState({retry: index});
        this.props.onChange(index);
    }
}
