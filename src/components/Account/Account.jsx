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
import Menu from "../Menu/Menu";
import Footer from "../Partials/Footer";
import Resizer from "react-image-file-resizer";
import image_annonce from "../../images/announce/default-image-announce_1.png";


class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            announceTextCredit: "",
            usernameEntity: "",
            email: "",
            createdAt: "",
            updatedAt: "",
            announcesSize: 0,
            announcesPaid: 0,
            announcesActive: 0,
            userDetails: {
                userId: null,
                username: null
            },
            userBookings: [],

            // API
            userAnnounces: [],

            uploadLabel: "",
            displayBtnSubmitPicture: false,
            isUploading: false,
            displayUploadErrorModal: false,
            errorUploadModalMessage: "",
            picturePreview: "",
            currentUserPicture: null
        };

        this.submitPicture = this.submitPicture.bind(this);
    }

    submitPicture() {
        this.setState({
            isUploading: true,
            displayBtnSubmitPicture: false
        });

        const formData = new FormData();
        formData.append('picture', this.state.pictureData.file);
        formData.append('userId', this.state.userDetails.userId);


        setTimeout(() => {
            Api
                .Media
                .addPictureUser(formData)
                .then(response => {
                    if (response.status === 200) {
                        window.location.reload();
                        /*
                        this.setState({
                            isUploading: false,
                            displayBtnSubmitPicture: true,
                            displayUploadErrorModal: false,
                            errorUploadModalMessage: "",
                            uploadLabel: ""
                        });
                        */
                    } else {
                        this.setState({
                            isUploading: false,
                            displayBtnSubmitPicture: true,
                            displayUploadErrorModal: true,
                            errorUploadModalMessage: "Une erreur est survenue, veuillez réessayer plus tard.",
                            uploadLabel: ""
                        });
                    }
                })
                .catch(err => this.setState({
                    isUploading: false,
                    displayBtnSubmitPicture: true,
                    displayUploadErrorModal: true,
                    errorUploadModalMessage: "Une erreur est survenue, veuillez réessayer plus tard.",
                    uploadLabel: ""
                }))

        }, 3000)
    }

    displayBase64(pictureBytesArray) {
        return `data:image/png;base64, ${pictureBytesArray}`
    }

    componentDidMount() {
        this.getMeAndMyBookings();
        this.getUserAnnounces();
    }

    displayUploadLabel(ev) {
        this.setState(
            {
                errorUploadModalMessage: "",
            }
        );

        let file = ev.target.files[0];
        let passBlob;
        const extension = file['type'];
        const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (!extension) {
            alert("error display");
            this.setState({
                displayBtnSubmitPicture: false,
                isUploading: false,
                displayUploadErrorModal: true,
                errorUploadModalMessage: "Image incorrect, le format autorisé est : jpg / png",
            })
        } else {
            if (!acceptedImageTypes.includes(extension)) {
                this.setState({
                    displayBtnSubmitPicture: false,
                    isUploading: false,
                    displayUploadErrorModal: true,
                    errorUploadModalMessage: "Image incorrect, le format autorisé est : jpg / png",
                })
            } else {
                Resizer.imageFileResizer(
                    file,
                    200,
                    200,
                    'JPEG',
                    100,
                    0,
                    blob => {
                        passBlob = blob;

                        if (file.name.length > 10) {
                            this.setState({
                                uploadLabel: `${file.name.substring(0, file.name.indexOf(file.name[15]) - 1)}...`
                            });

                        } else {
                            this.setState({
                                uploadLabel: `${file.name}`
                            });
                        }

                        let t = new File([passBlob], file.name);

                        this.setPreview(t)
                    },
                    'blob'
                );

            }
        }
    }

    setPreview(file) {
        this.setState({
            picturePreview: URL.createObjectURL(file),
            displayBtnSubmitPicture: true,
            pictureData: {
                file: file
            }
        });
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
                const rp = await Api.User.getById(this.state.userDetails.userId);
                if(rp.status === 200 || rp.status === 204){
                    const annPaid = rp.data.data.announces.filter( ann => ann.activeMultiple === true);
                    const annActive = rp.data.data.announces.filter( ann => ann.active === true);

                    this.setState({
                        email: rp.data.data.email,
                        usernameEntity: rp.data.data.usernameEntity,
                        currentUserPicture: rp.data.data.picture,
                        announcesSize: rp.data.data.announces.length,
                        announcesPaid: annPaid,
                        announcesActive: annActive
                    });

                    const response = await Api.Bookings.getUserBookings(this.state.userDetails.userId);
                    if (response.status === 200 || response.status === 204) {
                        this.setState({
                            userBookings: response.data.data
                        })
                    }
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
                this.setState({
                    userAnnounces: data.data
                });
            } else {
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
            <div>
                <div className="container-fluid mt-4 mb-4 card py-3">
                    <Menu/>
                    <div className="container-fluid mb-5">
                        <h3 className="text-dark">Information de compte</h3>
                        <div className="container-fluid mt-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="text-dark ml-1" style={{fontSize: '18px'}}>Nom d'utilisateur : <span className="text-black-50"> {this.state.usernameEntity}</span> </p>
                                            <p className="text-dark" style={{fontSize: '18px'}}> <i className="fa fa-envelope"></i>  <span className="text-black-50"> {this.state.email}</span></p>
                                            <hr></hr>
                                            <p className="text-dark" style={{fontSize: '18px'}}>Annonces : <span className="text-black-50">{this.state.announcesSize}</span></p>
                                            <p className="text-dark" style={{fontSize: '18px'}}>Annonces actives : <span className="text-black-50">{this.state.announcesActive.length}</span></p>
                                            <p className="text-dark" style={{fontSize: '18px'}}>Annonces premium : <span className="text-black-50">{this.state.announcesPaid.length}</span></p>
                                        </div>
                                        <div className="col-md-6">
                                            <img src={this.state.currentUserPicture === null ? 'https://image.flaticon.com/icons/svg/892/892781.svg' : this.displayBase64(this.state.currentUserPicture)} className="img-fluid rounded-top rounded-bottom" style={{width: '120px'}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="view overlay mb-4 mt-5">
                                        <img src={this.state.picturePreview} className="card-img-top img-fluid"
                                             style={{width:'250px', display: 'block',
                                                 'margin-left': 'auto',
                                                 'margin-right': 'auto' }}
                                        />
                                    </div>
                                    <form>
                                        <p className="text-dark text-center mt-2">Changer votre image de profil</p>
                                        <div className="form-group">
                                            <div className="custom-file mt-2">
                                                <input type="file" className="custom-file-input"
                                                       id="validatedCustomFile" required
                                                       onChange={(ev) => this.displayUploadLabel(ev)}/>
                                                <label className="custom-file-label"
                                                       htmlFor="validatedCustomFile">
                                                    {this.state.uploadLabel}
                                                </label>
                                                <div className="invalid-feedback">Example invalid custom file
                                                    feedback
                                                </div>
                                                <div
                                                    className={this.state.displayUploadErrorModal ? "small red-text" : "small red-text invisible"}
                                                    role="alert">
                                                    <p className="text-center">
                                                        {this.state.errorUploadModalMessage}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    <button className="btn btn-md btn-success mb-4"
                                                disabled={!this.state.displayBtnSubmitPicture}
                                                onClick={this.submitPicture}>
                                            Télécharger
                                            <span
                                                className={this.state.isUploading ? "ml-2 spinner-border spinner-border-sm mr-2 inline-block" : 'd-none'}
                                                role="status">
                                                </span>
                                        </button>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="row m-2">
                        <div className="col-md-6 mb-4">
                            <h4 className="card-header primary-color-dark white-text text-center">Mes annonces</h4>
                            <div className="">
                                <div className="mt-3">
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
                            <div className="">
                                <div className="mb-3 mt-3">
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
                                                                className="text-sm">Réf :{booking.bookingUuid.split('-')[0]}</span>
                                                            </p>

                                                            <div className="row mt-1">
                                                                <div className="col-md-12">

                                                                    <ul className="stepper stepper-vertical">

                                                                        <li className="completed">
                                                                            <a>
                                                                                <img
                                                                                    src="https://image.flaticon.com/icons/svg/59/59252.svg"
                                                                                    className="img-fluid mr-2"
                                                                                    style={{width: '20px'}}/> <span
                                                                                className="label">{moment(booking.bookingStartAt).format("DD-MM-YYYY HH:MM")} (début)</span>
                                                                            </a>
                                                                        </li>


                                                                        <li>
                                                                            <a>
                                                                                <img
                                                                                    src="https://image.flaticon.com/icons/svg/66/66403.svg"
                                                                                    className="img-fluid mr-2"
                                                                                    style={{width: '20px'}}/>
                                                                                <span
                                                                                    className="label">{moment(booking.bookingEndAt).format("DD-MM-YYYY HH:MM")} (fin)</span>
                                                                            </a>
                                                                        </li>

                                                                    </ul>

                                                                </div>
                                                            </div>

                                                            <div className="text-center mb-3">
                                                                <img
                                                                    src="https://image.flaticon.com/icons/svg/2867/2867617.svg"
                                                                    className="img-fluid mr-2" style={{width: '20px'}}/>
                                                                Estimation gain : {booking.bookingTotalPrice} €
                                                            </div>

                                                            <p className={booking.confirmed === true && booking.active === false ? '' : 'd-none'}>
                                                                <div className="mt-2 text-center">
                                                                    <a className=""
                                                                       href={`mailto:${booking.announceContactEmail}`}><i
                                                                        className="fa fa-envelope"></i> {booking.announceContactEmail}
                                                                    </a>
                                                                </div>
                                                            </p>

                                                            <div className="text-center">
                                                                <button className="btn btn-sm btn-primary mt-3"
                                                                        onClick={() => this.props.history.push(`/annonce/${booking.announceUuid}`)}> Voir
                                                                    l'annonce
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
                <Footer></Footer>
            </div>
        )
    }

}

export default withRouter(Account);
