import React, {Component} from 'react';
import ToggleOpen from './toggle-open';
const ReactMarkdown = require('react-markdown');

interface IDescriptionChildProps extends React.Props<any> {
    content: string;
}

export default class Description extends Component<IDescriptionChildProps> {
    render() {
        const mdContent = <ReactMarkdown source={this.props.content}/>;

        return (
            <>
                <ToggleOpen title='Description' content={mdContent}/>
            </>
        );
    }
}
