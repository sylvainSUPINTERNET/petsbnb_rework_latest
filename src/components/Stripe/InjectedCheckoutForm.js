// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';

import CardSection from './CardSection';
import * as axios from "axios";

class CheckoutForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardHolder: "",
            cardHolderEmail: ""
        };

        this.cardHolderChange = this.cardHolderChange.bind(this);
        this.cardHolderEmailChange = this.cardHolderEmailChange.bind(this);

    }

    cardHolderChange = (ev) => {
        this.setState({
            cardHolder: ev.target.value
        });
    };
    cardHolderEmailChange = (ev) => {
        this.setState({
            cardHolderEmail: ev.target.value
        });
    };

    handleSubmit = (ev) => {
        // We don't want to let default form submission happen here, which would refresh the page.
        ev.preventDefault();

        // Use Elements to get a reference to the Card Element mounted somewhere
        // in your <Elements> tree. Elements will know how to find your Card Element
        // because only one is allowed.
        // See our getElement documentation for more:
        // https://stripe.com/docs/stripe-js/reference#elements-get-element
        const cardElement = this.props.elements.getElement('card');

        // From here we can call createPaymentMethod to create a PaymentMethod
        // See our createPaymentMethod documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
        /*
        this.props.stripe
            .createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {name: this.state.cardHolder},
            })
            .then(({paymentMethod}) => {
                console.log('Received Stripe PaymentMethod:', paymentMethod);
            });
*/
        // You can also use confirmCardPayment with the PaymentIntents API automatic confirmation flow.
        // See our confirmCardPayment documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-confirm-card-payment

        /*
        this.props.stripe.confirmCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
            payment_method: {
                card: cardElement,
            },
        });
        */

        // You can also use confirmCardSetup with the SetupIntents API.
        // See our confirmCardSetup documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-confirm-card-setup

        /*
        this.props.stripe.confirmCardSetup('{PAYMENT_INTENT_CLIENT_SECRET}', {
            payment_method: {
                card: cardElement,
            },
        });
        */

        // You can also use createToken to create tokens.
        // See our tokens documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-token
        // With createToken, you will not need to pass in the reference to
        // the Element. It will be inferred automatically.
        /*this.props.stripe.createToken({type: 'card', name: this.state.cardHolder});*/
        // token type can optionally be inferred if there is only one Element
        // with which to create tokens
        //let tok = this.props.stripe.createToken({name: this.state.cardHolder});

        // You can also use createSource to create Sources.
        // See our Sources documentation for more:
        // https://stripe.com/docs/stripe-js/reference#stripe-create-source
        // With createSource, you will not need to pass in the reference to
        // the Element. It will be inferred automatically.

        //console.log(tok);

        console.log("TKS", this.props.accessToken);


        this.props.stripe
            .createToken({name: this.state.cardHolder, email: this.state.cardHolderEmail})
            .then((data) => {
                axios
                    .post(`http://localhost:4200/api/v1/payment/charge`,
                        {
                            amount: this.props.currentPrice * 100,
                            token: data.token.id,
                            email: data.token.email
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.props.accessToken
                            }
                        })
            })
            .catch(err => console.log("TOKEN é", err))


    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="email" name="cardHolderEmail" placeholder="Billing Email"
                           onChange={this.cardHolderEmailChange}/>
                    <input type="text" name="cardHolder" placeholder="Card holder" onChange={this.cardHolderChange}/>
                    <CardSection/>
                    <button className="btn btn-primary" disabled={this.props.currentPrice === "00.00"}>Confirm
                        order {this.props.currentPrice}</button>
                </form>
            </div>
        );
    }
}

export default injectStripe(CheckoutForm);
