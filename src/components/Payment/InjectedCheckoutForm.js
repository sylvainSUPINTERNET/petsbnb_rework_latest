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

        this.props.stripe
            .createToken({name: this.state.cardHolder, email: this.state.cardHolderEmail})
            .then(async (dataStripe) => {
                console.log(dataStripe.token)
                try {
                    const chargeAnnounceCreateResponse = await axios // thats also generate automaticaly the bills and set the correct status for the announce
                        .post(`${apiEndpoints.chargeAnnounceProxy}`, {
                            "email": dataStripe.token.email,
                            "token": dataStripe.token.id,
                            "amount": 299, // (just for info, actually in DB is inserted via the charge created)
                            "announceUuid": this.props.announce.uuid,
                            "expMonth": dataStripe.token.card.exp_month,
                            "expYear": dataStripe.token.card.exp_year,
                            "lastCardNumbers": dataStripe.token.card.last4,
                            "network": dataStripe.token.card.brand,
                            "paymentType": dataStripe.token.type,
                            "country": dataStripe.token.card.country
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.props.accessToken
                            }
                        });

                    console.log(chargeAnnounceCreateResponse);

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
                        <div className="col-md-12">
                            <div className="card container">
                                <div className="card-block">
                                    <div className="form-group">
                                        <input type="email" name="cardHolderEmail"
                                               placeholder="Addresse mail de facturation" className="form-control mt-3"
                                               onChange={this.cardHolderEmailChange}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" name="cardHolder" placeholder="Détenteur de la carte"
                                               onChange={this.cardHolderChange} className="form-control mt-2"/>
                                    </div>

                                    <CardSection/>
                                    <div className="text-center">
                                        <button className="btn btn-primary btn-lg mt-5 mb-3">Payer</button>
                                    </div>
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
