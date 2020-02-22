// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {
    render() {
        return (
            <div>
                <CardElement disabled={this.props.disabled} style={{base: {fontSize: '18px'}}} />
            </div>

        );
    }
}

export default CardSection;
