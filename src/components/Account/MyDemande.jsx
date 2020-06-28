import React, {useState, useEffect} from "react";
import {displayCurrency, displayDate, truncate} from "../Utils";
import {withRouter} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";

import axios from 'axios';
import Api from '../../api/index';

import Announces from "../../api/Announces/Announces";
import AnnouncesCardAccount from "../Annonces/AnnouncesCardAccount";
import moment from "moment";
import Menu from "../Menu/Menu";


class MyDemande extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            showDeleteModal: false,
            showAcceptedModal: false,
            announceTarget: {},


            confirmDeleteBtnLoading: false,
            confirmDeleteBtnDisabled: false,
            cancelDeleteBtnLoading: false,
            cancelDeleteBtnDisabled: false,

            confirmAcceptBtnLoading: false,
            confirmAcceptBtnDisabled: false,
            cancelAcceptBtnLoading: false,
            cancelAcceptBtnDisabled: false,


        };

    }

    componentDidMount() {
        const {announceUuid} = this.props.match.params;
        console.log(announceUuid);
        this.getBookingsForAnnounce(announceUuid)
    }

    async getBookingsForAnnounce(announceUuid) {
        try {
            const {data, status} = await Api.Bookings.getBookingsForAnnounce(announceUuid);
            if (status === 200 || status === 204) {
                console.log(data.data);
                this.setState({
                    bookings: data.data
                })
            }
        } catch (e) {
            alert(e)
            // TODO
        }
    }

    async onClickConfirmAccept() {
        console.log("confirm ça : ", this.state.announceTarget);

        this.setState({
            confirmAcceptBtnLoading: true,
            confirmAcceptBtnDisabled: true,
            cancelAcceptBtnDisabled: true
        });

        try {
            const {status, data} = await Api.Bookings.updateConfirm(this.state.announceTarget.uuid);
            if(status === 200 || status === 204){
                window.location.href=`/compte/${this.props.match.params.announceUuid}/demandes`
            }  else {
                // TODO
                console.log(data);
                this.setState({
                    confirmAcceptBtnLoading: false,
                    confirmAcceptBtnDisabled: false,
                    cancelAcceptBtnDisabled: false
                });
                alert("Error");
            }
        } catch (e) {
            // TODO
            this.setState({
                confirmAcceptBtnLoading: false,
                confirmAcceptBtnDisabled: false,
                cancelAcceptBtnDisabled: false
            });
            alert(e)
        }


    }

    async onClickConfirmDelete() {
        console.log("DELETE BOOKING TARGET : ", this.state.announceTarget);

        this.setState({
            confirmDeleteBtnLoading: true,
            confirmDeleteBtnDisabled: true,
            cancelDeleteBtnDisabled: true
        });


        try {
            const {status, data} = await Api.Bookings.reject(this.state.announceTarget.uuid);
            if(status === 200 || status === 204){
                window.location.href=`/compte/${this.props.match.params.announceUuid}/demandes`

                /*
            this.setState({
                showDeleteModal: false,
                announceTarget: {},
                confirmDeleteBtnLoading: false,
                confirmDeleteBtnDisabled: false,
                cancelDeleteBtnDisabled: false,
            });
                 */
            }  else {
                // TODO
                console.log(data);
                this.setState({
                    confirmDeleteBtnLoading: false,
                    confirmDeleteBtnDisabled: false,
                    cancelDeleteBtnDisabled: false
                });
                alert("Error");
            }
        } catch (e) {
            // TODO
            this.setState({
                confirmDeleteBtnLoading: false,
                confirmDeleteBtnDisabled: false,
                cancelDeleteBtnDisabled: false
            });
            alert(e)
        }

    }


    render() {
        return (
            <div className="container">
                <Menu/>
                <div className="row m-2">
                    <div className="col-md-6 mb-4">
                            <h4 className="card-header primary-color-dark white-text text-center">Nouvelles demandes</h4>
                        <div className="card">
                            <div className="card-body">

                                <div className={this.state.bookings.filter(el => el.active === true && el.confirmed === false).length !== 0 ? '' : 'd-none'}>
                                    {this.state.bookings.filter(el => el.active === true  && el.confirmed === false).map(booking => {
                                        return <div>                                        
                                            <h4 className="card-title m-3 text-primary"><i
                                                className="fa fa-tag"></i> {booking.uuid}</h4>
                                            <p><i
                                                className="fa fa-stopwatch text-danger m-3"></i> {moment(booking.startAt).format("DD/MM/YYYY HH:MM")}
                                            </p>
                                            <p><i
                                                className="fa fa-clock text-danger m-3"></i> {moment(booking.endAt).format("DD/MM/YYYY HH:MM")}
                                            </p>
                                            <p><i className="fa fa-check green-text m-3"></i> {booking.services[0].name}</p>
                                            <p><i className="fa fa-check green-text m-3"></i> {booking.animalsTypes[0].name}</p>


                                            <p><i className="fa fa-hand-holding-usd text-success m-3"></i>{booking.totalPrice} €
                                            </p>

                                            <Modal
                                                className="modal-container"
                                                show={this.state.showDeleteModal}
                                                onHide={() => this.setState({
                                                    showDeleteModal: false
                                                })}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title><i
                                                        className="fa fa-exclamation-triangle text-danger"></i> Suppression</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>Êtes-vous sûr de vouloir supprimer cette demande ?</Modal.Body>
                                                <Modal.Footer>
                                                    <Button className="btn btn-md btn-danger"
                                                            disabled={this.state.cancelDeleteBtnDisabled}
                                                            onClick={() => this.setState({showDeleteModal: false})}>Refuser</Button>

                                                    <Button className="btn btn-md btn-success"
                                                            disabled={this.state.confirmDeleteBtnDisabled}
                                                            onClick={() => this.onClickConfirmDelete()}>
                                                        Confirmer
                                                        <div
                                                            className={this.state.confirmDeleteBtnLoading === true ? "spinner-border spinner-border-sm ml-1" : "d-none"}
                                                            role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>


                                            <Modal
                                                className="modal-container"
                                                show={this.state.showAcceptedModal}
                                                onHide={() => this.setState({
                                                    showAcceptedModal: false
                                                })}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title><i
                                                        className="fa fa-exclamation-triangle text-danger"></i> Confirmation</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body>Êtes-vous sûr de vouloir confirmer cette demande ?</Modal.Body>
                                                <Modal.Footer>
                                                    <Button className="btn btn-md btn-danger"
                                                            disabled={this.state.cancelAcceptBtnDisabled}
                                                            onClick={() => this.setState({showAcceptedModal: false})}>Annuler</Button>

                                                    <Button className="btn btn-md btn-success"
                                                            disabled={this.state.confirmAcceptBtnDisabled}
                                                            onClick={() => this.onClickConfirmAccept()}>
                                                        Confirmer
                                                        <div
                                                            className={this.state.confirmAcceptBtnDisabled === true ? "spinner-border spinner-border-sm ml-1" : "d-none"}
                                                            role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                            <div className="text-center">
                                                <button className="btn btn-md btn-success" onClick={() => this.setState({
                                                    showAcceptedModal: true,
                                                    announceTarget: booking
                                                })}>Accepter</button>
                                                <button className="btn btn-md btn-danger" onClick={() => this.setState({
                                                    showDeleteModal: true,
                                                    announceTarget: booking
                                                })}>Refuser
                                                </button>
                                            </div>
                                            <hr></hr>


                                        </div>
                                    })}
                                </div>

                                <div className={this.state.bookings.filter(el => el.active === true && el.confirmed === false).length !== 0 ? 'd-none' : ''}>
                                    <p className="alert alert-warning text-center">Pas de demande pour le moment</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                            <h4 className="card-header primary-color-dark white-text text-center">Historique des demandes</h4>
                        <div className="card">
                            <div className="card-body">
                                
                                <div className={this.state.bookings.filter(el => el.confirmed === true || el.active === false).length !== 0 ? '' : 'd-none'}>
                                    {this.state.bookings.filter(el => el.confirmed === true || el.active === false).map(booking => {
                                        return <div>
                                            <h5 className="card-title m-3 text-primary"><i
                                                className="fa fa-tag"></i> {booking.uuid}</h5>

                                            <span className={booking.confirmed === true ?  "badge badge-pill badge-success" : 'd-none'}>
                                                accepté - {moment(booking.updatedAt).format("DD/MM/YYYY HH:MM")}
                                            </span>
                                            <span className={booking.active === false ?  "badge badge-pill badge-danger" : 'd-none'}>
                                                refusé - {moment(booking.updatedAt).format("DD/MM/YYYY HH:MM")}
                                            </span>

                                            <p><i
                                                className="fa fa-stopwatch text-danger m-3"></i> {moment(booking.startAt).format("DD/MM/YYYY HH:MM")}
                                            </p>
                                            <p><i
                                                className="fa fa-clock text-danger m-3"></i> {moment(booking.endAt).format("DD/MM/YYYY HH:MM")}
                                            </p>
                                            <p><i className="fa fa-check green-text m-3"></i> {booking.services[0].name}</p>
                                            <p><i className="fa fa-check green-text m-3"></i> {booking.animalsTypes[0].name}</p>


                                            <p><i className="fa fa-hand-holding-usd text-success m-3"></i>{booking.totalPrice} €
                                            </p>
                                            <hr></hr>


                                        </div>
                                    })}
                                </div>

                                <div className={this.state.bookings.length !== 0 ? 'd-none' : ''}>
                                    <p className="alert alert-warning text-center">Aucun historique</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>



            </div>

        )
    }

}

export default withRouter(MyDemande);
