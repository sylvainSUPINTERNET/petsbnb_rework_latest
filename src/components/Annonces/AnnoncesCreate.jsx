import React from 'react';

import Api from '../../api/index';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";

import {getLoadingText} from '../LoaderSettings';
import Checkbox from "rc-checkbox";
import LoadingOverlay from 'react-loading-overlay';
import { Redirect } from "react-router-dom";
import Menu from "../Menu/Menu";


class AnnoncesCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: {
                description: "",
                dept: "",
                streetAddress: "",
                title: "",
                city: "",
                farePerDay: 0,
                farePerMonth: 0,
                farePerHour: 0,
                servicesIds: [],
                animalsTypeIds: [],
                equipmentsIds: [],
            },
            disableInput:false,
            isValidTitle: true,
            isValidDescription: true,
            isValidAddr: true,
            isValidCity: true,
            isValidDept: true,
            isValidDayFare: true,
            isValidMensuelFare: true,
            isValidYearFare: true,
            isValidHoursFare: true,
            isValidEquipment: true,
            isValidService: true,
            isValidAnimalsType: true,

            submitDisable: false,
            isLoadingSubmit: false,
            // data for list
            services: [],
            equipments: [],
            animalsType: [],


            // selections
            selectedServices: [],
            selectedAnimalsTypes: [],
            selectedEquipments: [],

            isLoading: true,
            delay: 400
        };

        this.onSubmit = this.onSubmit.bind(this);
    }


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


    async getEquipments() {
        try {
            const {data, status} = await Api.Equipments.list();
            if (status === 200) {
                this.setState({
                    equipments: data,
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


    componentDidMount() {
        setTimeout(() => {
            this.getServices();
            this.getAnimalsType();
            this.getEquipments();
        }, this.state.delay)
    }

    onClickService = async (ev) => {
        let test = this.state.selectedServices.find(id => id == ev.target.id);
        if(test){
            // remove
            this.setState({
                selectedServices: this.state.selectedServices.filter(item => item != ev.target.id)
            });
        } else {
            this.setState({
                selectedServices: [...this.state.selectedServices, ev.target.id],
            });
        }

    };

    onClickEquipments = async (ev) => {
        let test = this.state.selectedEquipments.find(id => id == ev.target.id);
        if(test){
            // remove
            this.setState({
                selectedEquipments: this.state.selectedEquipments.filter(item => item != ev.target.id)
            });
        } else {
            this.setState({
                selectedEquipments: [...this.state.selectedEquipments, ev.target.id],
            });
        }
    };


    onClickAnimalsType = async (ev) => {
        let test = this.state.selectedAnimalsTypes.find(id => id == ev.target.id);
        if(test){
            // remove
            this.setState({
                selectedAnimalsTypes: this.state.selectedAnimalsTypes.filter(item => item != ev.target.id)
            });
        } else {
            this.setState({
                selectedAnimalsTypes: [...this.state.selectedAnimalsTypes, ev.target.id],
            });
        }
    };


    onChange = (ev) => {
        let body = this.state.body;
        body[ev.target.id] = ev.target.value;

        this.setState({
            body: body
        })
    };

    onSubmit = async (ev) => {
        ev.preventDefault();

        let flagError = false;

        this.setState({
            submitDisable: true,
            isLoadingSubmit: true,
            disableInput:true,
            isValidTitle: true,
            isValidDescription: true,
            isValidAddr: true,
            isValidCity: true,
            isValidDept: true,
            isValidDayFare: true,
            isValidMensuelFare: true,
            isValidYearFare: true,
            isValidHoursFare: true,
            isValidEquipment: true,
            isValidService: true,
            isValidAnimalsType: true,
        });

        setTimeout( async () => {
            if(this.state.body.title.trim().length === 0) {
                flagError = true;
                this.setState({
                    isValidTitle: false
                })
            }

            if(this.state.body.description.trim().length === 0) {
                flagError = true;
                this.setState({
                    isValidDescription: false
                })
            }

            if(this.state.body.dept.trim().length === 0) {
                flagError = true;
                this.setState({
                    isValidDept: false
                })
            }

            if(this.state.body.streetAddress.trim().length === 0) {
                flagError = true;
                this.setState({
                    isValidAddr: false
                })
            }
            if(this.state.body.city.trim().length === 0) {
                flagError = true;
                this.setState({
                    isValidCity: false
                })
            }
            if(this.state.body.farePerDay <= 0) {
                flagError = true;
                this.setState({
                    isValidDayFare: false
                })
            }

            if(this.state.body.farePerMonth <= 0) {
                flagError = true;
                this.setState({
                    isValidMensuelFare: false
                })
            }

            if(this.state.body.farePerHour <= 0) {
                flagError = true;
                this.setState({
                    isValidHoursFare: false
                })
            }

            if (this.state.selectedAnimalsTypes.length === 0) {
                flagError = true;
                this.setState({
                    isValidAnimalsType: false
                })
            }

            if (this.state.selectedServices.length === 0) {
                flagError = true;
                this.setState({
                    isValidService: false
                })
            }

            if (this.state.selectedEquipments.length === 0) {
                flagError = true;
                this.setState({
                    isValidEquipment:false
                })
            }
            
            if(flagError === false) {
                let body = this.state.body;
                body["equipmentsIds"] = this.state.selectedEquipments;
                body["servicesIds"] = this.state.selectedServices;
                body["animalsTypeIds"] = this.state.selectedAnimalsTypes;

                this.setState({
                    body: body
                });

                const {data, status} = await Api.Announces.post(this.state.body);
                if(status === 200) {
                    this.props.history.push(`/annonce/${data.uuid}`);
                } else {
                    // TODO
                    // error
                }
            } else {
                this.setState({
                    isLoadingSubmit: false,
                    disableInput: false,
                    submitDisable: false
                })
            }

        }, 2000)


    };

    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container-fluid mb-4">
                        <div className="card-header blue darken-4 m-0 p-0">
                                 <div className="text-center mt-2 p-1 white-text"><h3>Déposer votre annonce</h3></div>
                        </div>

                        <div className="card">
                            <div className="card-body">

                            <form className="text-center" onSubmit={this.onSubmit}>

                            <div className="form-group row">
                                <div className="col-sm-6">
                                <label htmlFor="title" className="label_annonce">Titre de l'annonce*</label>
                                <input type="text" id="title" className={this.state.isValidTitle === true ? 'form-control' : 'form-control is-invalid'} placeholder="Ex. Garder un chien" onChange={this.onChange} disabled={this.state.disableInput}/>
                                <div className="invalid-feedback">titre ne peut pas être vide</div>
                                </div>
                                <div className="col-sm-6">
                                <label htmlFor="description" className="label_annonce">Description de l'annonce*</label>
                                <textarea id="description" rows="1" cols="59"  className={this.state.isValidDescription === true ? 'form-control' : 'form-control is-invalid'} disabled={this.state.disableInput} placeholder="Ex. Je peux garder un chien pendant quelques jours"
                                              onChange={this.onChange}/>
                                    <div className="invalid-feedback">description ne peut pas être vide</div>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-6">
                                <label htmlFor="streetAddress" className="label_annonce">Adresse complète*</label>
                                <input type="text" id="streetAddress" className={this.state.isValidAddr === true ? 'form-control' : 'form-control is-invalid'} disabled={this.state.disableInput} placeholder="Ex. 14 rue de la paix"
                                           onChange={this.onChange}/>
                                    <div className="invalid-feedback">adresse ne peut pas être vide</div>
                                </div>
                                <div className="col-sm-6">
                                <label htmlFor="city" className="label_annonce">Ville*</label>
                                <input type="text" id="city"  className={this.state.isValidCity === true ? 'form-control' : 'form-control is-invalid'} placeholder="Ex. Paris" disabled={this.state.disableInput} onChange={this.onChange}/>
                                    <div className="invalid-feedback">ville ne peut être vide</div>
                                </div>
                            </div>      

                            <div className="form-group row">
                                <div className="col-sm-6">
                                    <label htmlFor="departement" className="label_annonce">Département*</label>
                                    <select
                                        disabled={this.state.disableInput}
                                        onChange={this.onChange}
                                        defaultValue={"default_dept"} className={this.state.isValidDept === true ? 'custom-select' : 'custom-select is-invalid'}
                                        id="dept" required>
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
                                    <div className="invalid-feedback">choisissez un département</div>
                                </div>
                                <div className="col-sm-6">
                                <label htmlFor="farePerDay" className="label_annonce">Tarif journalier*</label>
                                <input disabled={this.state.disableInput} type="number" id="farePerDay" className={this.state.isValidDayFare === true ? 'custom-select' : 'custom-select is-invalid'} placeholder="Ex. 25"
                                           onChange={this.onChange} min="1" step="any"/>
                                    <div className="invalid-feedback">tarif n'est pas valide</div>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-sm-6">
                                <label htmlFor="farePerMonth" className="label_annonce">Tarif mensuel*</label>
                                <input disabled={this.state.disableInput} type="number" id="farePerMonth" className={this.state.isValidMensuelFare === true ? 'custom-select' : 'custom-select is-invalid'} placeholder="Ex. 150"
                                           onChange={this.onChange} min="1" step="any"/>
                                    <div className="invalid-feedback">tarif n'est pas valide</div>
                                </div>
                                <div className="col-sm-6">
                                <label htmlFor="farePerHour" className="label_annonce">Tarif par heure*</label>
                                <input disabled={this.state.disableInput} type="number" id="farePerHour" className={this.state.isValidHoursFare === true ? 'custom-select' : 'custom-select is-invalid'} placeholder="Ex. 6"
                                           onChange={this.onChange} min="1" step="any"/>
                                    <div className="invalid-feedback">tarif n'est pas valide</div>
                                </div>
                            </div>                           

                            <div className="container mt-4">
                                <p className="service">Vos services* </p>
                                <div className="wrapper">
                                    <ul>              
                                        {
                                            this.state.services.map((service) => {
                                                return (
                                                    <li className={"list-group-item m-1 " + (this.state.selectedServices.find(id => id == service.id) ? 'active' : '')}
                                                        id={service.id} onClick={this.onClickService}>
                                                        {service.name}
                                                    </li>
                                                    
                                                )
                                            })
                                        }
                                        <p className={this.state.isValidService === true ? "d-none": "text-center text-danger mt-4"}>Choisissez au moins un service</p>
                                    </ul>
                                </div>

                                <p className="equipment">Équipements que vous disposez* </p>
                                <div className="wrapper">
                                    <ul>                                
                                        {
                                            this.state.equipments.map((equipments) => {
                                                return (
                                                    <li className={"list-group-item m-1 " + (this.state.selectedEquipments.find(id => id == equipments.id) ? 'active' : '')}
                                                        id={equipments.id} onClick={this.onClickEquipments}>
                                                        {equipments.name}
                                                    </li>
                                                )
                                            })
                                        }
                                        <p className={this.state.isValidEquipment === true ? "d-none": "text-center text-danger mt-4"}>Choisissez au moins un équipement</p>
                                    </ul>
                                </div>

                                <p className="type">Type d'animaux que vous accueillez* </p>
                                <div className="wrapper">
                                    <ul>                                     
                                        {
                                            this.state.animalsType.map((at) => {
                                                return (
                                                    <li className={"list-group-item m-1 " + (this.state.selectedAnimalsTypes.find(id => id == at.id) ? 'active' : '')}
                                                        id={at.id} onClick={this.onClickAnimalsType}> 
                                                        {at.name}
                                                    </li>
                                                )
                                            })
                                        }
                                        <p className={this.state.isValidAnimalsType === true ? "d-none": "text-center text-danger mt-4"}>Choisissez au moins une catégorie d'animaux</p>
                                    </ul>
                                </div>
                            </div>

                                <button
                                    disabled={this.state.submitDisable}
                                    id="button_annonce"
                                    className="mt-3 btn btn-primary btn-lg btn-block"
                                    type="submit">Ajouter
                                    <div
                                        className={this.state.isLoadingSubmit === true ? "spinner-border spinner-border-sm ml-3" : "d-none"}
                                        role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </button>

                            </form>
                       
                       
                    </div>
                    </div>
                </div>

                <LoadingOverlay>

                </LoadingOverlay>

                <Footer></Footer>

            </div>

        )
    }
}


export default withRouter(AnnoncesCreate);
