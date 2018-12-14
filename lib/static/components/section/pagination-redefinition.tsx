import { Pagination } from 'semantic-ui-react';
export default class PaginationExtended extends Pagination{

    handleItemClick: (e: any, { value: nextActivePage }: {
        value: any;
    }) => void;

    handleItemOverrides = (active: any, type: any, value: any) => (predefinedProps: any) => {
        const { retries } = this.props;
        return {
            active,
            type,
            className: retries[value] && type === 'pageItem' && retries[value].status ? retries[value].status : null ,
            key: `${type}-${value}`,
            onClick: (e: any, itemProps: any) => {
                _.invoke(predefinedProps, 'onClick', e, itemProps);
                this.handleItemClick(e, itemProps);
            },
        };
    }
}
