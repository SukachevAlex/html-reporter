import React, {Component, ComponentState} from 'react';
import { Button, Icon } from 'semantic-ui-react';
import {cn} from '@bem-react/classname';
const cnCswitcher = cn('Cswitcher');

interface ISwitcherStyleProps extends React.Props<any>{
    gui?: boolean;
    onChange(color: string): void;
}

interface ISwitcherStyleStates extends ComponentState{
    color: string;
}

export default class SwitcherStyle extends Component<ISwitcherStyleProps, ISwitcherStyleStates> {

    constructor(props: ISwitcherStyleProps, state: ISwitcherStyleStates) {
        super(props, state);
        this.state = {color: 'white'};
    }

    render() {

        if (!this.props.gui) {
            return null;
        }

        return (
            <div className={cnCswitcher()}>
            <Button.Group size='mini' basic>
                {this._drawButton('white')}
                {this._drawButton('grey')}
                {this._drawButton('black')}
                {this._drawButton('red')}
                {this._drawButton('#d5ff09')}
            </Button.Group>
            </div>
        );
    }

    private _drawButton(color: string) {
        return (
            <Button size='mini' icon onClick={() => this._onChange(color)}>
                <Icon name='tint' style={{color}} />
            </Button>
        );
    }

    private _onChange(color: string) {
        this.setState({color});
        this.props.onChange(color);
    }
}
