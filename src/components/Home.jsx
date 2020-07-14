import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";

import Moment from 'react-moment';

import Api from '../api/index';


import Footer from '../components/Partials/Footer';

import {withRouter} from "react-router-dom";
import AnnouncesCard from "./Annonces/AnnouncesCard";
import Menu from "./Menu/Menu";
import header_dog from "../images/header/dog.png"
import Sylvain from "../images/team/JOLY_Sylvain.png";
import Thomas from "../images/team/MALLET_Thomas.png";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentChoiceName: "",
            department: "",

            animalsType: [],
            animalsTypeChoiceId: "",

            services: [],
            servicesChoiceId: "",

            searchBtnLoaderDisplay: false,
            searchBtnDisabled: false,
            timerRedirectionSearchBtn: 800,

            latestAnnounces: []

        };
        // Open Map API
        //https://nominatim.openstreetmap.org/search?q=3+allee+des+platanes+draveil&format=json&polygon=1&addressdetails=1

        this.handleChangeAnimalsType = this.handleChangeAnimalsType.bind(this);
        this.handleChangeServices = this.handleChangeServices.bind(this);
        this.handleChangeDepartment = this.handleChangeDepartment.bind(this);

        this.onClickSearchBtn = this.onClickSearchBtn.bind(this);

        this.generateQueryParamsUrlForRedirection = this.generateQueryParamsUrlForRedirection.bind(this);

    }

    componentDidMount() {
        this.getLatestAnnounces();

        Api
            .AnimalsType
            .list()
            .then((res) => {

                const {data, status} = res;

                if (status === 200) {
                    this.setAnimalsType(data)
                }

            })
            .catch(err => {
                alert(err)
            });

        Api
            .Services
            .list()
            .then((res) => {
                this.setServices(res.data);
            })
            .catch(err => alert(err))

    }


    async getLatestAnnounces() {
        try {
            const res = await Api.Public.getLatestAnnounces();

            if (res.status === 200) {
                this.setState({
                    latestAnnounces: res.data.body.data
                });
            }

            return res

        } catch (e) {
            return e
        }
    }

    handleChangeAnimalsType(event) {
        this.setState({animalsTypeChoiceId: event.target.value});
    }

    handleChangeServices(event) {
        this.setState({servicesChoiceId: event.target.value});
    }

    handleChangeDepartment(event) {
        this.setState({departmentChoiceName: event.target.value});
    }

    setAnimalsType(data) {
        this.setState({animalsType: data});
    }

    setServices(data) {
        this.setState({services: data})
    }

    generateQueryParamsUrlForRedirection() {

        if (this.state.servicesChoiceId === "" && this.state.animalsTypeChoiceId === "" && this.state.departmentChoiceName === "") {
            return "/annonces?page=0"; // only pagination and full list
        } else {
            let url = "/annonces?page=0";

            if (this.state.servicesChoiceId) {
                url += `&services=${this.state.servicesChoiceId}`
            }

            if (this.state.animalsTypeChoiceId) {
                url += `&animals=${this.state.animalsTypeChoiceId}`
            }

            if (this.state.departmentChoiceName) {
                url += `&department=${this.state.departmentChoiceName}`
            }

            return url;
        }
    }

    onClickSearchBtn() {
        this.setState({
            searchBtnLoaderDisplay: true,
            searchBtnDisabled: true
        });
        setTimeout(() => {
            this.props.history.push(this.generateQueryParamsUrlForRedirection())
        }, this.state.timerRedirectionSearchBtn);
    }


    generateListAnimalsType() {
        let animalsTypeChoices = this.state.animalsType.map((type) => {
            return <option value={type.id}>{type.name}</option>
        });

        return <div className="input-group mb-3 col-md-4">
            <select value={this.state.animalsTypeChoiceId} onChange={this.handleChangeAnimalsType}
                    className="custom-select" id="inputGroupSelect02" defaultValue={"animalsType_none"}>
                <option selected>Votre animal ...</option>
                {animalsTypeChoices}
            </select>
            <div className="input-group-append">
                <label className="input-group-text blue darken-4 text-white"
                       htmlFor="inputGroupSelect02"><i className="fa fa-paw"></i></label>
            </div>
        </div>
    }


    generateListServices() {
        let serviesChoice = this.state.services.map((type) => {
            return <option value={type.id}>{type.name}</option>
        });

        return <div className="input-group mb-3 col-md-4">
            <select value={this.state.servicesChoiceId} onChange={this.handleChangeServices}
                    className="custom-select" id="inputGroupSelect03" defaultValue={"services_none"}>
                <option selected>Votre service ...</option>
                {serviesChoice}
            </select>
            <div className="input-group-append">
                <label className="input-group-text blue darken-4 text-white"
                       htmlFor="inputGroupSelect03"><i className="fa fa-ring"></i></label>
            </div>
        </div>
    }


    render() {
        return (
            <div>
                <Menu/>
                <div className="mask d-flex justify-content-center align-items-center">
                    <div className="container-fluid card" id="content">
                        <div className="row d-flex h-100 justify-content-center align-items-center wow fadeIn">
                            <div className="col-md-6 mb-4 white-text text-center text-md-left">
                                <h1 id="title_home" className="display-4 font-weight-bold mt-4">Vous ne savez pas comment faire
                                    garder vos compagnons ? PetsBNB !</h1>
                                <hr className="hr-title-home"></hr>
                                <p>
                                    <strong className="text-dark">PetsBNB est à votre service !</strong>
                                </p>
                                <p className="mb-4 d-none d-md-block">
                                    <strong className="text-dark">Ici, trouvez le petsitter qui vous correspond, selon vos
                                        propres critères <i className="far fa-smile-wink"></i>
                                    </strong>
                                </p>
                                {/*
                                <a href="/explication-du-site" id="button_site" class="btn waves-effect waves-light">Explication
                                    de notre site
                                    <i class="fas fa-exclamation-circle ml-2"></i>
                                </a>
                                <a href="/equipes" id="button_team" class="btn waves-effect waves-light">Notre équipe
                                    <i class="fas fa-users ml-2"></i>
                                </a>
                                */}

                            </div>
                            <div className="col-md-6 col-xl-5 mb-4 mt-4">
                                <img
                                    src="https://www.thesprucepets.com/thmb/1HQxXRVRCA2_CHJaZAlTk0Ype3g=/2304x1728/filters:fill(auto,1)/close-up-of-cat-lying-on-floor-at-home-908763830-1d61bee6961b45ee8a55bdfa5da1ebb3.jpg"
                                    alt="header dog" class="img-fluid"></img>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid py-3">
                    <div>
                        <div className="card">
                            <div className="card-title mt-4">
                                <p id="search_announce" className="text-center"><i
                                    className="fa fa-search blue-text"></i> Rechercher une annonce</p>
                            </div>
                            <div className="card-body">
                                <p className="justify-content-center text-center m-1 mb-4 p-2 font-weight-lighter">Trouvez votre petsitter, selon vos critères !</p>
                                <div className="text-center mt-4">
                                </div>
                                <hr className="m-3 p-3"/>
                                <Form>
                                    <Row>

                                        <div className="input-group mb-3 col-md-4">
                                            <select value={this.state.departmentChoiceName}
                                                    onChange={this.handleChangeDepartment}
                                                    defaultValue={"default_dept"} className="custom-select"
                                                    id="inputGroupSelect01">
                                                <option value="default_dept">Département</option>
                                                <option value="01">01 - Ain</option>
                                                <option value="02">02 - Aisne</option>
                                                <option value="03">03 - Allier</option>
                                                <option value="04">04 - Alpes de Haute Provence</option>
                                                <option value="05">05 - Hautes Alpes</option>
                                                <option value="06">06 - Alpes Maritimes</option>
                                                <option value="07">07 - Ardèche</option>
                                                <option value="08">08 - Ardennes</option>
                                                <option value="09">09 - Ariège</option>
                                                <option value="10">10 - Aube</option>
                                                <option value="11">11 - Aude</option>
                                                <option value="12">12 - Aveyron</option>
                                                <option value="13">13 - Bouches du Rhône</option>
                                                <option value="14">14 - Calvados</option>
                                                <option value="15">15 - Cantal</option>
                                                <option value="16">16 - Charente</option>
                                                <option value="17">17 - Charente Maritime</option>
                                                <option value="18">18 - Cher</option>
                                                <option value="19">19 - Corrèze</option>
                                                <option value="2A">2A - Corse du Sud</option>
                                                <option value="2B">2B - Haute-Corse</option>
                                                <option value="21">21 - Côte d'Or</option>
                                                <option value="22">22 - Côtes d'Armor</option>
                                                <option value="23">23 - Creuse</option>
                                                <option value="24">24 - Dordogne</option>
                                                <option value="25">25 - Doubs</option>
                                                <option value="26">26 - Drôme</option>
                                                <option value="27">27 - Eure</option>
                                                <option value="28">28 - Eure et Loir</option>
                                                <option value="29">29 - Finistère</option>
                                                <option value="30">30 - Gard</option>
                                                <option value="31">31 - Haute Garonne</option>
                                                <option value="32">32 - Gers</option>
                                                <option value="33">33 - Gironde</option>
                                                <option value="34">34 - Hérault</option>
                                                <option value="35">35 - Ille et Vilaine</option>
                                                <option value="36">36 - Indre</option>
                                                <option value="37">37 - Indre et Loire</option>
                                                <option value="38">38 - Isère</option>
                                                <option value="39">39 - Jura</option>
                                                <option value="40">40 - Landes</option>
                                                <option value="41">41 - Loir et Cher</option>
                                                <option value="42">42 - Loire</option>
                                                <option value="43">43 - Haute Loire</option>
                                                <option value="44">44 - Loire Atlantique</option>
                                                <option value="45">45 - Loiret</option>
                                                <option value="46">46 - Lot</option>
                                                <option value="47">47 - Lot et Garonne</option>
                                                <option value="48">48 - Lozère</option>
                                                <option value="49">49 - Maine et Loire</option>
                                                <option value="50">50 - Manche</option>
                                                <option value="51">51 - Marne</option>
                                                <option value="52">52 - Haute Marne</option>
                                                <option value="53">53 - Mayenne</option>
                                                <option value="54">54 - Meurthe et Moselle</option>
                                                <option value="55">55 - Meuse</option>
                                                <option value="56">56 - Morbihan</option>
                                                <option value="57">57 - Moselle</option>
                                                <option value="58">58 - Nièvre</option>
                                                <option value="59">59 - Nord</option>
                                                <option value="60">60 - Oise</option>
                                                <option value="61">61 - Orne</option>
                                                <option value="62">62 - Pas de Calais</option>
                                                <option value="63">63 - Puy de Dôme</option>
                                                <option value="64">64 - Pyrénées Atlantiques</option>
                                                <option value="65">65 - Hautes Pyrénées</option>
                                                <option value="66">66 - Pyrénées Orientales</option>
                                                <option value="67">67 - Bas Rhin</option>
                                                <option value="68">68 - Haut Rhin</option>
                                                <option value="69">69 - Rhône</option>
                                                <option value="70">70 - Haute Saône</option>
                                                <option value="71">71 - Saône et Loire</option>
                                                <option value="72">72 - Sarthe</option>
                                                <option value="73">73 - Savoie</option>
                                                <option value="74">74 - Haute Savoie</option>
                                                <option value="75">75 - Paris</option>
                                                <option value="76">76 - Seine Maritime</option>
                                                <option value="77">77 - Seine et Marne</option>
                                                <option value="78">78 - Yvelines</option>
                                                <option value="79">79 - Deux Sèvres</option>
                                                <option value="80">80 - Somme</option>
                                                <option value="81">81 - Tarn</option>
                                                <option value="82">82 - Tarn et Garonne</option>
                                                <option value="83">83 - Var</option>
                                                <option value="84">84 - Vaucluse</option>
                                                <option value="85">85 - Vendée</option>
                                                <option value="86">86 - Vienne</option>
                                                <option value="87">87 - Haute Vienne</option>
                                                <option value="88">88 - Vosges</option>
                                                <option value="89">89 - Yonne</option>
                                                <option value="90">90 - Territoire de Belfort</option>
                                                <option value="91">91 - Essonne</option>
                                                <option value="92">92 - Hauts de Seine</option>
                                                <option value="93">93 - Seine Saint Denis</option>
                                                <option value="94">94 - Val de Marne</option>
                                                <option value="95">95 - Val d'Oise</option>
                                                <option value="971">971 - Guadeloupe</option>
                                                <option value="972">972 - Martinique</option>
                                                <option value="973">973 - Guyane</option>
                                                <option value="974">974 - Réunion</option>
                                                <option value="975">975 - Saint Pierre et Miquelon</option>
                                                <option value="976">976 - Mayotte</option>
                                            </select>
                                            <div className="input-group-append">
                                                <label className="input-group-text blue darken-4 text-white"
                                                       htmlFor="inputGroupSelect02"><i
                                                    className="fa fa-map-marker-alt"></i></label>
                                            </div>
                                        </div>

                                        {this.generateListAnimalsType()}


                                        {this.generateListServices()}

                                    </Row>
                                </Form>
                                <div className="row">
                                    <div className="col text-center mt-3 py-2">
                                        <button className="btn btn-primary btn-lg btn-success" type="button"
                                                onClick={this.onClickSearchBtn}
                                                disabled={this.state.searchBtnDisabled}>
                                            <span
                                                style={{display: this.state.searchBtnLoaderDisplay ? 'inline-block' : 'none'}}
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"></span>
                                            Rechercher
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p id="last_announce" className="text-center"><i className="fa fa-arrow-right blue-text"></i> Annonces récentes</p>

                                    <div className="container py-3">
                                        <div className="row">
                                            {
                                                this.state.latestAnnounces.map(announce => {
                                                    return <div className="col-md-3">
                                                        <AnnouncesCard announce={announce} modifPictureBtn={false}/>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>

                <div className="mask d-flex justify-content-center align-items-center mt-5">
                    <div className="container-fluid card">
                        <div className="row">
                            <div className="col-md-12 m-3" id="works">
                                <p className="text-center"
                                   style={{fontSize: '32px', color: 'rgba(23, 106, 196, 0.95)'}}>Comment ça marche ?</p>

                                <p className=" container text-dark text-justify">PetsBNB assure la relation entre les petsitters et
                                    les personnes à la recherche de petsitters. Nous nous engageons à placer le bien-être animal
                                     en première position et souhaitons ainsi laisser les petsitters choisir
                                    leurs tarifs, sans aucune commission de notre part !</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9">
                                <div className="container">
                                    <p style={{fontSize: '25px'}} className="m-5">Je recherche un petsitter</p>
                                    <div className="row ml-1">
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '120px'}}
                                                 src="https://image.flaticon.com/icons/svg/3043/3043946.svg"/>
                                            <p> Chercher votre annonce </p>
                                        </div>
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '120px'}}
                                                 src="https://image.flaticon.com/icons/svg/3078/3078971.svg"/>
                                            <p>Réserver votre créneaux</p>
                                        </div>
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '170px'}}
                                                 src="https://imageog.flaticon.com/icons/png/512/1019/1019607.png?size=1200x630f&pad=10,10,10,10&ext=png"/>
                                            <p>Payer</p>
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="container mt-4 mb-5">
                                    <p style={{fontSize: '25px'}} className="m-5">Je veux être petsitter</p>
                                    <div className="row ml-1">
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '120px'}}
                                                 src="https://image.flaticon.com/icons/svg/3089/3089692.svg"/>
                                            <p> Déposer votre annonce </p>
                                        </div>
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '120px'}}
                                                 src="https://image.flaticon.com/icons/svg/2720/2720601.svg"/>
                                            <p>Je sélectionne mes demandes</p>
                                        </div>
                                        <div className="col-md-3 m-4">
                                            <img className="rounded float-left img-fluid" style={{width: '120px'}}
                                                 src="https://image.flaticon.com/icons/svg/2132/2132246.svg"/>
                                            <p>Aucune commission</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="container">
                                    <p style={{fontSize: '25px'}} className="m-5 text-center">Espace communautaire<br/> 100% gratuit</p>
                                    <img
                                        src="https://image.flaticon.com/icons/svg/2472/2472017.svg"
                                        alt="header dog" className="img-fluid"></img>
                                    <p className="mt-3 text-dark text-justify">Crée votre compte, consultez, proposer des annonces en temps réel !</p>
                                </div>
                            </div>
                        </div>

                        <hr></hr>
                            <div className="mb-4">
                                <p className="text-center mt-4" style={{fontSize: '32px', color: 'rgba(23, 106, 196, 0.95)'}}>
                                    <img src="https://image.flaticon.com/icons/svg/2041/2041020.svg" style={{width: '50px'}} className="img-fluid"></img>
                                    Besoin d'un boost ?</p>
                                <p className="text-dark text-center mt-3">Même si nos services restent gratuit, nous vous proposons un boost de notoriété grâce à notre tiers payant !</p>

                                <section className="pricing py-5">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="card mb-5 mb-lg-0">
                                                    <div className="card-body">
                                                        <h5 className="card-title text-muted text-uppercase text-center">Free</h5>
                                                        <hr/>
                                                            <ul className="fa-ul">
                                                                <li><span className="fa-li"><i
                                                                    className="fas fa-check text-success"></i></span> Compte
                                                                </li>
                                                                <li><span className="fa-li"><i
                                                                    className="fas fa-check text-success"></i></span> Déposer d'annonce illimité
                                                                </li>
                                                                <li><span className="fa-li"><i
                                                                    className="fas fa-check text-success"></i></span> Consultez des annonces
                                                                </li>
                                                                <li><span className="fa-li"><i
                                                                    className="fas fa-check text-success"></i></span> Services communautaire
                                                                </li>
                                                                <li className="text-muted"><span className="fa-li"><i
                                                                    className="fas fa-times text-danger"></i></span> Annonces prioritaires
                                                                </li>
                                                                <li className="text-muted"><span className="fa-li"><i
                                                                    className="fas fa-times text-danger"></i></span> Plusieurs annonces activent
                                                                </li>
                                                            </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="card mb-5 mb-lg-0">
                                                    <div className="card-body">
                                                        <h5 className="card-title text-muted text-uppercase text-center">Plus</h5>
                                                        <hr/>
                                                        <ul className="fa-ul">
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Compte
                                                            </li>
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Déposer d'annonce illimité
                                                            </li>
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Consultez des annonces
                                                            </li>
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Services communautaire
                                                            </li>
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Annonces prioritaires
                                                            </li>
                                                            <li><span className="fa-li"><i
                                                                className="fas fa-check text-success"></i></span> Plusieurs annonces activent (2.99 €)
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <hr></hr>

                                <p className="text-center mt-4" style={{fontSize: '32px', color: 'rgba(23, 106, 196, 0.95)'}}>
                                    <img src="https://image.flaticon.com/icons/svg/2372/2372804.svg" style={{width: '50px'}} className="img-fluid mr-2"></img>
                                    Le meilleur pour vos compagnons</p>
                                <p className="text-dark text-center mt-3">PetsBNB met à votre disposition <a href="/store">une sélection d'équipement</a> qui sera ravir au mieux vos animaux de compagnie</p>

                                <div className="row mt-4 mb-4">
                                    <div className="col-md-6 col-sm-6 mt-4 text-center">
                                        <img src="https://cdn.allwallpaper.in/wallpapers/1920x1200/4770/animals-dogs-glasses-pets-sunglasses-1920x1200-wallpaper.jpg" style={{width: '800px'}}  className="mr-2 rounded-top rounded-bottom img-fluid"></img>
                                    </div>
                                    <div className="col-md-6 col-sm-6 mt-4 text-center">
                                        <p className="text-dark" style={{fontSize: '45px'}}>
                                            Testé
                                            <img src="https://image.flaticon.com/icons/svg/3004/3004112.svg" style={{width: '100px'}} className="img-fluid ml-4"/>
                                        </p>
                                        <p className="text-dark" style={{fontSize: '45px'}}>
                                            Approuvé
                                            <img src="https://image.flaticon.com/icons/svg/3062/3062354.svg" style={{width: '100px'}} className="img-fluid ml-4"/>
                                        </p>
                                        <p className="text-dark mt-2" style={{fontSize: '45px'}}>
                                            Sécurisé
                                            <img src="https://image.flaticon.com/icons/svg/3182/3182157.svg" style={{width: '100px'}} className="img-fluid ml-4"/>
                                        </p>
                                        <p className="text-dark mt-2" style={{fontSize: '45px'}}>
                                            Partenaire
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1600px-Amazon_logo.svg.png  " style={{width: '100px'}} className="img-fluid ml-4"/>
                                        </p>
                                    </div>
                                </div>
                            </div>


                    </div>

                </div>


                <div className="card m-4">
                    <p className="text-center mt-4"
                       style={{fontSize: '32px', color: 'rgba(23, 106, 196, 0.95)'}}>On vous accompagne</p>
                    <div className="row d-flex justify-content-center text-center">

                        <div className="col-lg-4 col-md-6 mb-4  m-5">

                            <div className="avatar mx-auto">
                                <img src={Sylvain} className="team rounded z-depth-1-half"
                                     alt="Sample avatar"/>
                            </div>

                            <h4 className="font-weight-bold dark-grey-text my-4">Sylvain
                                Joly</h4>
                            <h6 className="text-uppercase grey-text mb-3"><strong>Co-fondateur</strong></h6>

                            <a type="button"
                               href="https://www.linkedin.com/in/sylvain-joly-3a7152aa/"
                               className="btn-floating btn-sm mx-1 mb-0 btn-dribbble">
                                <i className="fab fa-linkedin-in "></i>
                            </a>

                            <a type="button" href="https://github.com/sylvainSUPINTERNET"
                               className="btn-floating btn-sm mx-1 mb-0 btn-tw">
                                <i className="fab fa-github-alt"></i>
                            </a>


                            <a type="button" href="http://sylvain.alwaysdata.net/"
                               className="btn-floating btn-sm mx-1 mb-0 btn-tw">
                                <i className="fa fa-globe"></i>
                            </a>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-4 m-5">
                            <div className="avatar mx-auto">
                                <img src={Thomas} className="team rounded z-depth-1-half"
                                     alt="Sample avatar"/>
                            </div>

                            <h4 className="font-weight-bold dark-grey-text my-4">Thomas
                                Mallet</h4>
                            <h6 className="text-uppercase grey-text mb-3"><strong>Fondateur</strong></h6>

                            <a type="button"
                               href="https://fr.linkedin.com/in/thomas-mallet-497998121"
                               className="btn-floating btn-sm mx-1 mb-0 btn-tw">
                                <i className="fab fa-linkedin-in "></i>
                            </a>

                            <a type="button" href="https://github.com/kivabien"
                               className="btn-floating btn-sm mx-1 mb-0 btn-pin">
                                <i className="fab fa-github-alt"></i>
                            </a>

                        </div>

                    </div>
                </div>

                <Footer></Footer>

            </div>

        )
    }
}

export default withRouter(Home);
