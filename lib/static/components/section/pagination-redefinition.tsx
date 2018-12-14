import { Pagination } from 'semantic-ui-react';
export default class PaginationExtended extends Pagination{

    handleItemClick: (e: Event, { value: nextActivePage }: {
        value: any;
    }) => void;

    handleItemOverrides = (active: boolean, type: string, value: any) => (predefinedProps: any) => {
        const { retries } = this.props;
        return {
            active,
            type,
            className: retries[value] && type === 'pageItem' && retries[value].status ? retries[value].status : null ,
            key: `${type}-${value}`,
            onClick: (e: Event, itemProps: any) => {
                _.invoke(predefinedProps, 'onClick', e, itemProps);
                this.handleItemClick(e, itemProps);
            },
        };
    }
}
