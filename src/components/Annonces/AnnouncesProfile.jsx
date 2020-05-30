import React from 'react';
import Api from '../../api/index';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import {getLoadingText} from '../LoaderSettings';
import LoadingOverlay from 'react-loading-overlay';
import BookingCalendar from '../../components/Calendar/BookingCalendar';
import Resizer from 'react-image-file-resizer';


import {capitalize, displayCurrency} from "../Utils";

import {apiEndpoints, stripeConfig} from "../../api/config";

import {StripeProvider, CardCVCElement} from "react-stripe-elements";
import StoreCheckout from "../Stripe/StoreCheckout";
import * as axios from "axios";


class AnnouncesProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            delay: 10,
            isAlreadyDemande: false,
            announce: {
                id: "",
                city: "", // to avoid undefined when we using method for display
                equipments: [],
                services: [],
                animalsType: [],
                user: {
                    id: null
                },
                picture: null
            },
            bookingBtnDisabled: true,
            services: [],
            animalsType: [],
            animalTypeChoice: "",
            serviceChoice: "",
            totalPrice: "00.00", // from children BookingCalendar,
            currency: "EUR",
            childBookingBody: "", // bookingBody made in children calendar and retrieve here for the billing system

            userId: null,

            uploadLabel: "",
            picturePreview: null,
            displayBtnSubmitPicture: false,
            pictureData: {
                file: null,
            },
            isUploading: false,
            displayUploadErrorModal: false,
            errorUploadModalMessage: "",

            isLoadingDemande: false,
            isDisabledBtnDemande: false
        };

        this.handleChangeAnimalTypeChoiceId = this.handleChangeAnimalTypeChoiceId.bind(this);
        this.handleChangeServiceChoiceId = this.handleChangeServiceChoiceId.bind(this);
        this.bookingBtnEnabled = this.bookingBtnEnabled.bind(this);
        this.submitPicture = this.submitPicture.bind(this);
    }


    componentDidMount() {
        let tk = localStorage.getItem("accessToken");
        if (tk) {
            Api
                .User
                .getMe()
                .then(res => {
                    this.setState({
                        userId: res.data.userId
                    });
                })
                .catch(e => {
                    alert(e)
                })
        } else {
            this.setState({
                isAdminAnnounce: false
            })
        }

        console.log("Stripe pK : ", stripeConfig.PK);

        // url
        const {uuid} = this.props.match.params;


        // call APIs
        setTimeout(() => {
            this.getAnnounce(uuid);
            this.getServices();
            this.getAnimalsType();
            this.getUserBookingForTheAnnounceByUuid(uuid)
        }, this.state.delay)
    }

    displayBase64(pictureBytesArray) {
        return `data:image/png;base64, ${pictureBytesArray}`
    }

    submitPicture() {
        this.setState({
            isUploading: true,
            displayBtnSubmitPicture: false
        });

        const formData = new FormData();
        formData.append('picture', this.state.pictureData.file);
        formData.append('announceId', this.state.announce.id);


        setTimeout(() => {
            Api
                .Media
                .mediaAddPicture(formData)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            isUploading: false,
                            displayBtnSubmitPicture: true,
                            displayUploadErrorModal: false,
                            errorUploadModalMessage: "",
                            uploadLabel: ""
                        });
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
        }, 2000)

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
        })


        ;
    }

    // get price from children use as props
    cbPrice = (childDataPrice) => {
        this.setState({totalPrice: childDataPrice})
    };

    handleChangeAnimalTypeChoiceId(event) {
        this.setState({
            animalTypeChoice: event.target.value
        }, async () => {
            this.bookingBtnEnabled();
        });
    }

    handleChangeServiceChoiceId(event) {
        console.log('service changed', event.target.value);
        this.setState({
            servicesChoice: event.target.value
        }, async () => {
            this.bookingBtnEnabled();
        });
    }

    bookingBtnEnabled() {

        if (this.state.animalTypeChoice !== "" && this.state.servicesChoice !== "") {
            this.setState({
                bookingBtnDisabled: false
            });
        }

        console.log("c", this.state.servicesChoice)
        console.log("b", this.state.animalTypeChoice)
    }

    cbBookingBody = (bookingBody) => {
        this.setState({
            childBookingBody: bookingBody
        })
    };

    /**
     * Get all animalsType to generate list
     * @returns {Promise<void>}
     */
    async getAnimalsType() {
        try {

            const {data, status} = await Api.AnimalsType.list();
            if (status === 200) {
                console.log("animalsType data ");
                console.log(data);
                this.setState({
                    animalsType: data,
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        } catch (e) {
            this.setState({
                isLoading: false
            });
            console.log("error api animalsType-> ", e)
        }
    }

    async getUserBookingForTheAnnounceByUuid(announceUuid){
        try {
            const {data, status} = await Api.Bookings.getUserBookingsForAnnounce(announceUuid);
            if(status === 200) {
                console.log("getUserBookingForTheAnnounceByUuid");
                console.log(data.data);
                if(data.data.length > 0) {
                    console.log("set is already demande")
                    this.setState({
                        isAlreadyDemande: true
                    })
                    console.log("ALREADY DEMNADE : ", this.state.isAlreadyDemande)
                }

            }
        } catch (e) {
            alert(e)
            // TODO
        }
    }


    async makeDemande() {
        this.setState({
            isLoadingDemande: true,
            isDisabledBtnDemande: true
        });
        try {
            const booking = await axios
                .post(`${apiEndpoints.bookingsProxy}`, {
                    "bookingTotalPrice": parseFloat(this.state.childBookingBody.bookingTotalPrice),
                    "bookingStartAt": new Date(this.state.childBookingBody.bookingStartAt).toISOString(),
                    "bookingEndAt": new Date(this.state.childBookingBody.bookingEndAt).toISOString(),
                    "userId": this.state.childBookingBody.userId,
                    "announceId": this.state.childBookingBody.announceId,
                    "serviceId": this.state.childBookingBody.serviceId,
                    "animalsTypeId": this.state.childBookingBody.animalsTypeId,
                    "paid": 1,
                    "confirmed": 0
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });

            if (booking.status === 200 || booking.status === 204) {
                window.location.href = '/compte';

            } else {
                // TODO error
                alert(booking.status);
                this.setState({
                    isLoadingDemande: false,
                    isDisabledBtnDemande: false
                });
            }
        } catch (e) {
            alert(e);
            // todo
            this.setState({
                isLoadingDemande: false,
                isDisabledBtnDemande: false
            });

        }

    }

    /**
     * Get all services for the list generation
     * @returns {Promise<void>}
     */
    async getServices() {
        try {
            const {data, status} = await Api.Services.list();
            if (status === 200) {
                console.log("SERVICES data ")
                console.log(data);
                this.setState({
                    services: data,
                    isLoading: false
                })
            } else {
                this.setState({
                    isLoading: false
                })
            }
        } catch (e) {
            console.log("get services error : ", e);
            this.setState({
                isLoading: false
            });
        }
    }

    async getAnnounce(uuid) {
        try {
            const {data, status} = await Api.Announces.getOne(uuid);

            if (status === 200) {
                console.log("DATA")
                console.log(data);
                this.setState({
                    announce: data,
                    isLoading: false
                });
            } else {
                // todo -> error
                this.setState({
                    isLoading: false
                })
            }

        } catch (e) {
            // todo -> error
            this.setState({
                isLoading: false
            });
            console.log("error -> ", e)
        }
    }


    render() {
        let service = this.state.servicesChoice;
        let animalType = this.state.animalTypeChoice;
        return (
            <div>
                <LoadingOverlay
                    active={this.state.isLoading}
                    spinner
                    text={getLoadingText()}>

                    <div className="container white darken-4 rounded-1 p-4 mt-2">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">{this.state.announce.title}</h3>
                                <h4 className=""><i
                                    className="fa fa-map-marker-alt"></i> {this.state.announce.dept} - {capitalize(this.state.announce.city)} , {this.state.announce.streetAddress}
                                </h4>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="">
                                            <span className="badge badge-info ml-2"><i
                                                className="fas fa-clock"></i> {this.state.announce.farePerHour}{displayCurrency(this.state.announce.currency)}</span>
                                            <span className="badge badge-info ml-2"><i
                                                className="fas fa-calendar-day"></i> {this.state.announce.farePerDay}{displayCurrency(this.state.announce.currency)}</span>
                                            <span className="badge badge-info ml-2"><i
                                                className="fa fa-calendar-alt"></i> {this.state.announce.farePerMonth}{displayCurrency(this.state.announce.currency)}</span>
                                        </div>
                                        <p className="card-text mt-4">{this.state.announce.description}</p>

                                        {this.state.announce.equipments.length > 0 &&
                                        <div className="mt-4">
                                            <div>
                                                {this.state.announce.equipments.map(equipment => {
                                                    return <div className="row" key={equipment.id}>
                                                        <div className="col">
                                                            <i className="fa fa-check green-text"></i> {equipment.name}
                                                        </div>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                        }
                                        {/*
                                        tthis.state.isAlreadyDemande === true -> hide the reservation and show message
                                        */}
                                        <div
                                            className={this.state.announce.user.id === this.state.userId ? 'd-none' : ''}>

                                            <hr></hr>

                                            <div className={this.state.isAlreadyDemande === true ? '' : 'd-none'}>
                                                <p className="alert alert-success text-center">Déjà une demande en cours.<br/><a href="/compte"><span className="font-weight-bold">Voir mes réservations</span></a></p>
                                            </div>
                                            <div className={this.state.isAlreadyDemande !== true ? '' : 'd-none'}>
                                                <div className="row m-3">
                                                    <div className="col-md-6">
                                                        <h5>Service</h5>
                                                        <label>
                                                            <select value={this.state.servicesChoiceId}
                                                                    className="browser-default custom-select"
                                                                    onChange={this.handleChangeServiceChoiceId}>
                                                                <option value="" disabled selected>Choisissez votre service
                                                                </option>
                                                                {this.state.announce.services.map((e, key) => {
                                                                    return <option key={key} value={e.id}>{e.name}</option>;
                                                                })}
                                                            </select>
                                                        </label>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5>Animal</h5>
                                                        <label>
                                                            <select value={this.state.animalsTypeChoiceId}
                                                                    className="browser-default custom-select"
                                                                    onChange={this.handleChangeAnimalTypeChoiceId}>
                                                                <option value="" disabled selected>Choisissez votre type
                                                                    d'animal
                                                                </option>
                                                                {this.state.announce.animalsType.map((e, key) => {
                                                                    return <option key={key} value={e.id}>{e.name}</option>;
                                                                })}
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="row m3">
                                                {this.state.announce.equipments.name}
                                            </div>


                                            <div className={this.state.isAlreadyDemande !== true ? '' : 'd-none'}>
                                                <div
                                                    className={this.state.bookingBtnDisabled ? "small red-text" : "small red-text invisible"}
                                                    role="alert">
                                                    <p className="text-center">
                                                        Choisissez votre type d'animal et le service souhaité
                                                    </p>
                                                </div>

                                                <div className="text-center">
                                                    <button type="button" className="btn btn-info" data-toggle="modal"
                                                            data-target="#modalBooking"
                                                            disabled={this.state.bookingBtnDisabled}>
                                                        Réserver votre créneau
                                                    </button>
                                                    <hr/>
                                                    <div className={this.state.childBookingBody !== "" ? 'card' : 'd-none'}>
                                                        <div className="card-body">
                                                            <p className="card-title">Prestation</p>
                                                            <p className="card-text">Début
                                                                : {this.state.childBookingBody.bookingStartAt}</p>
                                                            <p className="card-text">Fini
                                                                : {this.state.childBookingBody.bookingEndAt}</p>
                                                            <p className="card-text">Total estimé
                                                                : {this.state.totalPrice} {this.state.currency}</p>
                                                            <button className="btn btn-primary"
                                                                    disabled={this.state.isDisabledBtnDemande}
                                                                    onClick={() => this.makeDemande()}>Faire la demande
                                                                <div
                                                                    className={this.state.isLoadingDemande === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                                                    role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="modal fade" id="modalBooking" tabIndex="-1" role="dialog"
                                             aria-labelledby="modalBooking"
                                             aria-hidden="true">

                                            <div className="modal-dialog modal-dialog-centered" role="document">


                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title"
                                                            id="bookingModalLongTitle">Réservation</h5>
                                                        <button type="button" className="close" data-dismiss="modal"
                                                                aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body m-2">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <BookingCalendar
                                                                    service={this.state.servicesChoice}
                                                                    announce={this.state.announce}
                                                                    animalTypeChoice={animalType}
                                                                    cbPrice={this.cbPrice}
                                                                    price={this.state.totalPrice}
                                                                    cbBookingBody={this.cbBookingBody}
                                                                    serviceChoice={service}/>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div
                                            className={this.state.announce.user.id === this.state.userId ? 'container' : 'd-none'}>
                                            <form onSubmit={(el) => console.log("SUBMIT")}>
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
                                        <div className="view overlay">
                                            <img src={this.state.picturePreview} className="card-img-top"/>
                                            <img src={this.displayBase64(this.state.announce.picture)}
                                                 className={this.state.announce.picture !== null && this.state.picturePreview === null ? 'card-img-top' : 'd-none'}/>
                                            <img
                                                src="https://www.mba-lyon.fr/sites/mba/files/medias/images/2019-07/default-image_0.png"
                                                alt="image annonce"
                                                className={this.state.announce.picture === null && this.state.picturePreview === null ? 'card-img-top' : 'd-none'}/>
                                            <a href="#!">
                                                <div className="mask rgba-white-slight"></div>
                                            </a>
                                        </div>
                                    </div>
                                </div>


                                {/*
                                <StripeProvider apiKey={stripeConfig.PK}>
                                    <StoreCheckout currentPrice={this.state.totalPrice}
                                                   accessToken={localStorage.getItem('accessToken')}
                                                   bookingBody={this.state.childBookingBody}/>
                                </StripeProvider>
                               */}

                                {/*
                                <a href="#" className="btn btn-primary">Retour</a>
                                <a href="#" className="btn btn-primary">Suivante</a>
  */}

                            </div>

                        </div>

                    </div>

                </LoadingOverlay>


                <Footer></Footer>


            </div>
        )

    }
}


export default withRouter(AnnouncesProfile);
