import React, {useState, useEffect} from "react";
import {displayCurrency, displayDate, truncate} from "../Utils";
import {withRouter} from "react-router-dom";

import axios from 'axios';
import Api from '../../api/index';

import Announces from "../../api/Announces/Announces";
import AnnouncesCardAccount from "../Annonces/AnnouncesCardAccount";
import moment from "moment";


class MyDemande extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: []
        };

    }

    componentDidMount() {
        const {announceUuid} = this.props.match.params;
        console.log(announceUuid);
        this.getBookingsForAnnounce(announceUuid)
    }

    async getBookingsForAnnounce(announceUuid){
        try {
            const {data, status} = await Api.Bookings.getBookingsForAnnounce(announceUuid);
            if(status === 200 || status === 204) {
                console.log(data.data);
                this.setState({
                    bookings : data.data
                })
            }
        } catch (e) {
            alert(e)
            // TODO
        }
    }



    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-body">

                        <div className={this.state.bookings.length !== 0 ? '': 'd-none'}>
                            {this.state.bookings.filter(el => el.active === true).map(booking => {
                                return <div>
                                    <h4 className="card-title m-3 text-primary"><i className="fa fa-tag"></i> {booking.uuid}</h4>
                                    <p><i className="fa fa-stopwatch text-danger m-3"></i> {moment(booking.startAt).format("DD/MM/YYYY HH:MM")}</p>
                                    <p><i className="fa fa-clock text-danger m-3"></i>  {moment(booking.endAt).format("DD/MM/YYYY HH:MM")}</p>
                                    <p> <i className="fa fa-check green-text m-3"></i> {booking.services[0].name}</p>
                                    <p> <i className="fa fa-check green-text m-3"></i> {booking.animalsTypes[0].name}</p>



                                    <p><i className="fa fa-hand-holding-usd text-success m-3"></i>{booking.totalPrice} €</p>



                                    <div className="text-center">
                                        <button className="btn btn-md btn-success">Accepter</button>
                                        <button className="btn btn-md btn-danger">Refuser</button>
                                    </div>
                                    <hr></hr>
                                </div>
                            })}
                        </div>

                        <div className={this.state.bookings.length !== 0 ? 'd-none': ''}>
                            <p className="alert alert-warning text-center">Déjà une demande en cours</p>
                        </div>

                    </div>
                </div>
            </div>

        )
    }

}

export default withRouter(MyDemande);
