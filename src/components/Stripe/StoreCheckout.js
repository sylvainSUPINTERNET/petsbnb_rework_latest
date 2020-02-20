import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCheckoutForm from './InjectedCheckoutForm';

class StoreCheckout extends React.Component {
    render() {
        return (
            <div>
                <Elements>
                    <InjectedCheckoutForm currentPrice={this.props.currentPrice} accessToken={this.props.accessToken} bookingBody={this.props.bookingBody}/>
                </Elements>
            </div>
        );
    }
}

export default StoreCheckout;
