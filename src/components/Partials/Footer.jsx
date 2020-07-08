import React from "react";
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <footer className="page-footer font-small mdb-color pt-4">
                    <div className="container text-center text-md-left">
                        <div className="row text-center text-md-left mt-3 pb-3">
                            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                                <h6 className="text-uppercase mb-4 font-weight-bold">PetsBNB ?</h6>
                                <p>PetsBNB est une plateforme de mise en relation de détenteurs d’animaux et petsitters en cas de départ en vacances.</p>
                            </div>
                                <hr className="w-100 clearfix d-md-none"></hr>
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                                <h6 className="text-uppercase mb-4 font-weight-bold">Infos pratiques</h6>
                                <p><Link to="/conditions-generales-utilisation">Conditions générales d’utilisation</Link></p>   
                                <p><Link to="/faq">FAQ</Link></p>   
                                <p><Link to="/credits">Crédits</Link></p>                         
                            </div>
                                <hr className="w-100 clearfix d-md-none"></hr>
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                                <h6 className="text-uppercase mb-4 font-weight-bold">A propos</h6>
                                <p><Link to="/explication-du-site">Explication du site</Link></p>   
                                <p><Link to="/equipes">Notre équipe</Link></p>
                                <p><Link to="/partenaires">Nos partenaires</Link></p>                
                            </div>
                                <hr className="w-100 clearfix d-md-none"></hr>
                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>                 
                                <p><i className="fas fa-envelope mr-3"></i><a href="mailto:petsbnb45@gmail.com">petsbnb45@gmail.com</a></p>
                                <ul className="list-unstyled list-inline">
                                        <li className="list-inline-item">
                                            <a href="https://www.facebook.com/Pets-BNB-112643583833880" target="_blank" className="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light">
                                            <i className="fab fa-facebook-f"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="https://twitter.com/bnb_pets" target="_blank" className="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light">
                                            <i className="fab fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="https://www.instagram.com/pets_bnb/" target="_blank" className="btn-floating btn-sm rgba-white-slight mx-1 waves-effect waves-light">
                                            <i className="fab fa-instagram"></i>
                                            </a>
                                        </li>
                                    </ul>                             
                            </div>
                        </div>
                        <hr></hr>
                            <div className="row d-flex align-items-center">
                                <div className="col-lg-12 center">
                                    <p className="text-center">Copyright - PetsBNB</p>
                                 </div>
                            </div>
                    </div>
                </footer>
            </div>

        )
    }

}
