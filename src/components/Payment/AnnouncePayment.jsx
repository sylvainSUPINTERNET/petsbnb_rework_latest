import React, {useState, useEffect} from "react";
import Announces from "../../api/Announces/Announces";


import {withRouter} from "react-router-dom";
import axios from 'axios';
import {stripeConfig} from "../../api/config";
import {CardElement} from "@stripe/react-stripe-js";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {StripeProvider} from "react-stripe-elements";
import StoreCheckout from "../Payment/StoreCheckout";
import Menu from "../Menu/Menu";
import Footer from "../Partials/Footer";

class AnnouncePayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            announce: null,
            price: 299 // 2.99
        };
    }

    componentDidMount() {
        this.getAnnounce();
    }

    getAnnounce = async () => {
        const {match: {params}} = this.props;
        try {
            const resp = await Announces.getOne(params.uuid);
            if (resp.status === 200 || resp.status === 204) {
                this.setState({announce: resp.data})
            }
        } catch (e) {
            alert(e)
            //console.log(e)
        }
    };

    createCharge(){
    }

    // TODO
    // TODO : finir le form de paiement (custom voir l'exemple dans Stripe)
    // TODO : + faire le creation de la charge + update activeMultiple / active (ajouter dans l'api l'ajout de la facture announceBill dans le service directement...)
    // TODO : redirect sur compte a la fin

    render() {
        return (
            <div>
                <Menu/>
            <div className="container py-3">
            <div className="card-header blue darken-4 m-0 p-0">
                <div className="text-center mt-2 p-1 white-text">
                    <h5><i className="fa fa-bullhorn"></i> Annonce importante</h5>
                </div>
            </div>
                <div className="card">
                    <div className="card-body">
                        <div className="text-center">
                            <h5 className="card-title">Une seule annonce gratuite peut être active sur votre compte</h5>
                            <p className="card-text">Pour gagner en visiblité, activé plusieurs annonces à la fois,
                                passer
                                votre annonce en mode premium</p>
                        </div>
                        <div className="row m-4">
                            <div className="col-md-12 text-center">
                                <i className="fab fa-cc-visa m-2" style={ { fontSize: '65px'}}></i>
                                <i className="fab fa-cc-mastercard m-2" style={ { fontSize: '65px'}}></i>
                                <i className="fab fa-cc-jcb m-2" style={ { fontSize: '65px'}}></i>
                                <i className="fab fa-cc-discover m-2" style={ { fontSize: '65px'}}></i>
                            </div>
                        </div>
                        <div>
                            <StripeProvider apiKey={stripeConfig.PK}>
                                <StoreCheckout currentPrice={this.state.price}
                                               accessToken={localStorage.getItem('accessToken')}
                                               announce={this.state.announce}/>
                            </StripeProvider>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
            </div>

        )
    }

}

export default withRouter(AnnouncePayment);
