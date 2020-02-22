// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';

import CardSection from './CardSection';
import * as axios from "axios";

import {apiEndpoints} from "../../api/config";

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

        console.log("BOOKING BODY IS HERE from children -> ", this.props.bookingBody);
        console.log("TKS", this.props.accessToken);


        this.props.stripe
            .createToken({name: this.state.cardHolder, email: this.state.cardHolderEmail})
            .then(async (dataStripe) => {
                try {
                    const booking = await axios
                        .post(`${apiEndpoints.bookingsProxy}`, {
                        "bookingTotalPrice": parseFloat(this.props.bookingBody.bookingTotalPrice),
                        "bookingStartAt": "2016-01-25T21:34:55",
                        "bookingEndAt": "2016-01-26T21:34:55",
                        "userId": this.props.bookingBody.userId,
                        "announceId": this.props.bookingBody.announceId,
                        "serviceId": this.props.bookingBody.serviceId,
                        "animalsTypeId": this.props.bookingBody.animalsTypeId,
                        "paid": 1,
                        "confirmed": 0
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.props.accessToken
                            }
                        });
                    console.log(">>>> b-booking ", booking);
                    console.log(booking.data.id);

                    const {data} = await axios
                        .post(`${apiEndpoints.chargeProxy}`,
                            {
                                amount: this.props.currentPrice * 100,
                                token: dataStripe.token.id,
                                email: dataStripe.token.email
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.props.accessToken
                                }
                            });
                    console.log("------>", data);
                    console.log(">>>>>", dataStripe);
                    const bills = await axios
                        .post(`http://localhost:4200/api/v1/bills`,
                            {
                                "chargeId": dataStripe.token.id,
                                "urlReceipt": "TODO",
                                "amount": this.props.currentPrice * 100,
                                "currency": "Eur",
                                "created": dataStripe.token.created,
                                "type": dataStripe.token.type,
                                "expMonth": dataStripe.token.card.exp_month,
                                "expYear": dataStripe.token.card.exp_year,
                                "lastCardNumbers": dataStripe.token.card.last4,
                                "network": dataStripe.token.card.brand,
                                "paymentType": dataStripe.token.type,
                                "country": dataStripe.token.card.country,
                                "isPaid": 1,
                                "userId": this.props.bookingBody.userId, // from props
                                "bookingId": booking.data.id
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.props.accessToken
                                }
                            });
                    console.log("t : >>>>>", bills);
                } catch (e) {
                    if (e) {
                        // TODO
                        console.log("ERROR stripe api : ", e);
                    }
                }

            })
            .catch(err => console.log("TOKEN é", err))


    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                        </div>
                        <div className="col-md-6">
                            <div className="card container">
                                <div className="card-block">
                                    <div className="form-group">
                                        <input type="email" name="cardHolderEmail" placeholder="Addresse mail de facturation" className="form-control mt-3"
                                               onChange={this.cardHolderEmailChange} disabled={this.props.currentPrice === "00.00"}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" name="cardHolder" placeholder="Détenteur de la carte" onChange={this.cardHolderChange} className="form-control mt-2" disabled={this.props.currentPrice === "00.00"}/>
                                    </div>

                                    <CardSection  disabled={this.props.currentPrice === "00.00"}/>
                                    <button className="btn btn-primary" disabled={this.props.currentPrice === "00.00"}>Payer {this.props.currentPrice}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default injectStripe(CheckoutForm);
