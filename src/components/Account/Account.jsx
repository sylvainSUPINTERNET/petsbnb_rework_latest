import React, {useState, useEffect} from "react";

import {displayCurrency, displayDate, truncate} from "../Utils";

import {withRouter} from "react-router-dom";


import axios from 'axios';
import Api from '../../api/index';


// D3.js
import * as d3 from 'd3';
import Announces from "../../api/Announces/Announces";
import AnnouncesCard from "../Annonces/AnnouncesCard";
import AnnouncesCardAccount from "../Annonces/AnnouncesCardAccount";
import moment from "moment";


class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            announceTextCredit: "",
            userDetails: {
                userId: null,
                username: null
            },
            userBookings: [],

            // API
            userAnnounces: []
        };

    }

    componentDidMount() {
        this.getMeAndMyBookings();
        this.getUserAnnounces();
    }


    async getMeAndMyBookings() {
        try {
            const {status, data} = await Api.User.getMe();
            if (status === 200 || status === 204) {
                this.setState({
                    userDetails: {
                        userId: data.userId,
                        username: data.username
                    }
                });
                console.log("ok");
                const response = await Api.Bookings.getUserBookings(this.state.userDetails.userId);
                if (response.status === 200 || response.status === 204) {
                    console.log(response.data.data);
                    this.setState({
                        userBookings: response.data.data
                    })
                }
            }
        } catch (e) {
            // todo
            alert(e);
            return e;
        }
    }

    async getUserAnnounces() {
        try {
            const {status, data} = await Announces.getByUser();
            if (status === 200) {
                console.log(data.data);
                this.setState({
                    userAnnounces: data.data
                });
            } else {
                console.log("ERROR")
                alert("announces API")
            }

        } catch (e) {
            // TODO display error
            alert(e);
            return e;
        }
    }


    render() {
        return (
            <div className="container">
                <div className="row m-2">
                    <div className="col-md-6 mb-4">
                        <h4 className="card-header primary-color-dark white-text text-center">Mes annonces</h4>
                        <div className="card">
                            <div className="card-body">
                                {/*
                                  <div className={this.state.userAnnounces.length === 0 ? "d-none" : ""}>

                                          <span className="badge badge-pill badge-danger mb-1">
                                   <i className="fa fa-eye-slash" aria-hidden="true"></i> Non visible pour les utilisateurs
                                </span>
                                    <br/>
                                    <span className="badge badge-pill badge-success mb-4">
                                   <i className="fa fa-eye" aria-hidden="true"></i> Visible par tous les utilisateurs
                                </span>
                                </div>

                                */}


                                <div className={this.state.userAnnounces.length === 0 ? "" : "d-none"}>
                                    <div className="alert alert-warning text-center" role="alert">
                                        Pas d'annonces pour le moment
                                    </div>
                                </div>

                                <div className={this.state.userAnnounces.length === 0 ? "d-none" : ""}>
                                    {
                                        this.state.userAnnounces.map(announce => {
                                            return <AnnouncesCardAccount userAnnounces={this.state.userAnnounces}
                                                                         announce={announce}
                                                                         modifPictureBtn={true}></AnnouncesCardAccount>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4 className="card-header primary-color-dark white-text text-center">Mes demande de
                            réservation</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className={this.state.userBookings.length === 0 ? "" : "d-none"}>
                                    <div className="alert alert-warning text-center" role="alert">
                                        Pas de réservation pour le moment
                                    </div>
                                </div>

                                <div className={this.state.userBookings.length === 0 ? "d-none" : ""}>
                                    {
                                        this.state.userBookings.map(booking => {
                                            return <div className="container mb-3">

                                                <div className="card">
                                                    <div className="card-body">
                                                        <p className={booking.confirmed === true ? '' : 'd-none'}>
                                                            <span className="badge badge-success">Confirmé</span>
                                                        </p>
                                                        <p className={booking.confirmed === false && booking.active === true ? '' : 'd-none'}>
                                                            <span className="badge badge-warning">En cours</span>
                                                        </p>
                                                        <p className={booking.confirmed === true && booking.active === false ? '' : 'd-none'}>
                                                            <span className="badge badge-success">Accepté</span>
                                                        </p>
                                                        <p className={booking.confirmed === false && booking.active === false ? '' : 'd-none'}>
                                                            <span className="badge badge-danger">Refusé</span>
                                                        </p>
                                                        <p className="text-center mt-2">
                                                            <i className="fa fa-tag"></i> <span
                                                            className="text-sm">{booking.bookingUuid}</span>
                                                        </p>
                                                        <p className="text-center mt-3">Début
                                                            : {moment(booking.bookingStartAt).format("DD-MM-YYYY HH:MM")}</p>
                                                        <p className="text-center mt-3">Fin
                                                            : {moment(booking.bookingEndAt).format("DD-MM-YYYY HH:MM")}</p>

                                                        <p className={booking.confirmed === true && booking.active === false ? '' : 'd-none'}>
                                                            <div className="mt-2 text-center">
                                                                <a className=""
                                                                   href={`mailto:${booking.announceContactEmail}`}><i
                                                                    className="fa fa-envelope"></i> {booking.announceContactEmail}
                                                                </a>
                                                            </div>
                                                        </p>

                                                        <div className="text-center">
                                                            <button className="btn btn-sm btn-info mt-3"
                                                                    onClick={() => this.props.history.push(`/annonce/${booking.announceUuid}`)}> Voir l'annonce
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>



                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

export default withRouter(Account);
