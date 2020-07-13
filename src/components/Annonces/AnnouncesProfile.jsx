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
import Menu from "../Menu/Menu";
import moment from "moment";
import image_annonce from "../../images/announce/default-image-announce_1.png"


class AnnouncesProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            delay: 10,
            isAlreadyDemande: false,
            announceOwnerData: {
              picture: "",
              usernameEntity: ""
            },
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
            isDisabledBtnDemande: false,


            // if already one demande from logged user on this announce
            confirmed : null,
            active: null,

            isVisitor: true
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
                        userId: res.data.userId,
                        isVisitor: false
                    });
                })
                .catch(e => {
                   //console.log("ERRORRRR", e);
                    this.setState({
                        isVisitor: true
                    })
                })
        } else {
            this.setState({
                isAdminAnnounce: false
            })
        }

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
        }
    }

    async getUserBookingForTheAnnounceByUuid(announceUuid){
        try {
            const {data, status} = await Api.Bookings.getUserBookingsForAnnounce(announceUuid);
            if(status === 200) {
                if(data.data.length > 0) {
                    this.setState({
                        isAlreadyDemande: true,
                        confirmed: data.data[0].confirmed,
                        active:data.data[0].active
                    });
                }

            }
        } catch (e) {
            alert(e)
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
            this.setState({
                isLoading: false
            });
        }
    }

    async getAnnounce(uuid) {
        try {
            const {data, status} = await Api.Announces.getOne(uuid);
            if (status === 200) {

                this.setState({
                    announce: data,
                    isLoading: false
                });
                const rp = await Api.User.getById(this.state.announce.user.id);

                this.setState({
                    announceOwnerData: {
                        usernameEntity: rp.data.data.usernameEntity,
                        picture: rp.data.data.picture
                    }
                });

            } else {
                this.setState({
                    isLoading: false
                })
            }

        } catch (e) {
            // todo -> error
            this.setState({
                isLoading: false
            });
            alert(e)
        }
    }


    render() {
        let service = this.state.servicesChoice;
        let animalType = this.state.animalTypeChoice;
        return (
            <div>
                <Menu/>
                <LoadingOverlay
                    active={this.state.isLoading}
                    spinner
                    text={getLoadingText()}>

                    <div className="container-fluid darken-4 rounded-1 p-4 mt-2">
                        <div className="card-header blue darken-4 m-0 p-0">
                            <div className="text-center mt-2 p-1 white-text">
                                <h3>{this.state.announce.title}</h3>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-dark"><i
                                    className="fa fa-map-marker-alt text-primary"></i> {this.state.announce.dept} - {capitalize(this.state.announce.city)}, {this.state.announce.streetAddress}
                                </h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="">
                                            <span data-title="Tarif par heure" className="badge badge-info"><i
                                                className="fas fa-clock"></i> {this.state.announce.farePerHour} €</span>
                                            <span data-title="Tarif journalier" className="badge badge-info ml-2"><i
                                                className="fas fa-calendar-day"></i> {this.state.announce.farePerDay} €</span>
                                            <span data-title="Tarif mensuel" className="badge badge-info ml-2"><i
                                                className="fa fa-calendar-alt"></i> {this.state.announce.farePerMonth} €</span>
                                        </div>
                                        <p className="mt-4 text-justify">{this.state.announce.description}</p>
                                        <div className="row text-center">
                                            <hr></hr>
                                            <img src={this.state.announceOwnerData.picture === null ? 'https://image.flaticon.com/icons/svg/892/892781.svg' : this.displayBase64(this.state.announceOwnerData.picture)} className="img-fluid rounded-top rounded-bottom" style={{width: '70px'}}/>
                                            <p className="ml-2 text-black-50"> Posté par {this.state.announceOwnerData.usernameEntity} le {moment(this.state.announce.createdAt).format("DD-MM-YYYY HH:MM")}</p>
                                        </div>
                                        {this.state.announce.equipments.length > 0 &&
                                        <div className="mt-4">
                                            <div>
                                                <p className="title_equipement">Équipements que vous disposez :</p>
                                                {this.state.announce.equipments.map(equipment => {
                                                    return <div className="row mb-5" key={equipment.id}>
                                                        <div className="col">
                                                            <i className="fa fa-arrow-right green-text"></i> {equipment.name}
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

                                            {/*
                                            <div className={this.state.isAlreadyDemande === true && this.state.confirmed === true && this.state.active === true ? '' : 'd-none'}>
                                                <p className="alert alert-success text-center">Déjà une demande en cours.<br/><a href="/compte"><span className="font-weight-bold">Voir mes réservations</span></a></p>
                                            </div>
                                            */}
                                            <div className={this.state.isVisitor === true ? 'd-none': ''}>
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


                                            <div className="">
                                                <div
                                                    className={this.state.bookingBtnDisabled ? "small red-text" : "small red-text invisible"}
                                                    role="alert">
                                                    <div className={this.state.isVisitor === true ? 'd-none': ''}>
                                                        <p className="text-center">
                                                            Choisissez votre type d'animal et le service souhaité
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className={this.state.isVisitor === true ? "d-none": ""}>
                                                        <button type="button" className="btn btn-info" data-toggle="modal"
                                                                data-target="#modalBooking"
                                                                disabled={this.state.bookingBtnDisabled}>
                                                            Réserver votre créneau
                                                        </button>
                                                        <hr/>
                                                    </div>

                                                    <div className={this.state.isVisitor === true ? "": "d-none"}>
                                                        <button className="btn btn-md btn-primary" onClick={ () => {this.props.history.push('/auth/login')}}><i className="fa fa-lock"></i> Connectez-vous pour réserver</button>
                                                    </div>

                                                    <div className={this.state.childBookingBody !== "" ? 'card' : 'd-none'}>

                                                        <div className="row mt-1">
                                                            <div className="col-md-12">
                                                                <p>Préstation</p>
                                                                <ul className="stepper stepper-vertical">

                                                                    <li className="completed">
                                                                        <a>
                                                                            <img
                                                                                src="https://image.flaticon.com/icons/svg/59/59252.svg"
                                                                                className="img-fluid mr-2"
                                                                                style={{width: '20px'}}/> <span>

                                                                            {moment(this.state.childBookingBody.bookingStartAt).format("DD-MM-YYYY HH:MM")} (début)

                                                                        </span>
                                                                        </a>
                                                                    </li>


                                                                    <li>
                                                                        <a>
                                                                            <img
                                                                                src="https://image.flaticon.com/icons/svg/66/66403.svg"
                                                                                className="img-fluid mr-2"
                                                                                style={{width: '20px'}}/>
                                                                            <span>
                                                                                {moment(this.state.childBookingBody.bookingEndAt).format("DD-MM-YYYY HH:MM")} (fin)
                                                                            </span>

                                                                        </a>
                                                                    </li>

                                                                </ul>


                                                            </div>
                                                        </div>

                                                        <div className="text-center mb-3">
                                                            <img
                                                                src="https://image.flaticon.com/icons/svg/2867/2867617.svg"
                                                                className="img-fluid mr-2" style={{width: '20px'}}/>
                                                            Estimation gain : {this.state.totalPrice}  €
                                                        </div>

                                                        <div className="m-3">
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
                                        <div className="view overlay mt-3">
                                            <img src={this.state.picturePreview} className="card-img-top img-fluid" style={{width:'400px', display: 'block',
                                                'margin-left': 'auto',
                                                'margin-right': 'auto' }}/>
                                            <img src={this.displayBase64(this.state.announce.picture)}
                                                 className={this.state.announce.picture !== null && this.state.picturePreview === null ? 'card-img-top img-fluid' : 'd-none'} style={{width:'400px', display: 'block',
                                                'margin-left': 'auto',
                                                'margin-right': 'auto' }}/>
                                            <img
                                                src={image_annonce}
                                                alt="image annonce"
                                                className={this.state.announce.picture === null && this.state.picturePreview === null ? 'card-img-top img-fluid' : 'd-none'} style={{width:'400px', display: 'block',
                                                'margin-left': 'auto',
                                                'margin-right': 'auto' }}/>
                                            <a>
                                                <div className="mask rgba-white-slight"></div>
                                            </a>
                                        </div>

                                        <div
                                            className={this.state.announce.user.id === this.state.userId ? 'container' : 'd-none'}>
                                            <form>
                                                <p className="text-center text-dark mt-2">Changer la photo de l'annonce</p>
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
