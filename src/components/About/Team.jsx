import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";
import Thomas from "../../images/team/MALLET_Thomas.png"
import Sylvain from "../../images/team/JOLY_Sylvain.png"

class Team extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>Notre équipe</h3></div>
                    </div>

                    <div className="card">
                        <div className="card-body">

                            <p class="text-center">Elle est composée de 2 développeurs web full-stack :</p>
                    
                            <div class="row d-flex justify-content-center text-center">

                                <div class="col-lg-4 col-md-6 mb-4">

                                    <div class="avatar mx-auto">
                                        <img src={Sylvain} class="team rounded z-depth-1-half" alt="Sample avatar"/>
                                    </div>

                                    <h4 class="font-weight-bold dark-grey-text my-4">Sylvain Joly</h4>
                                    <h6 class="text-uppercase grey-text mb-3"><strong>Développeur web full-stack</strong></h6>
                                
                                    <a type="button" href="https://www.linkedin.com/in/sylvain-joly-3a7152aa/" class="btn-floating btn-sm mx-1 mb-0 btn-dribbble">
                                        <i class="fab fa-linkedin-in "></i>
                                    </a>
                                    
                                    <a type="button" href="https://github.com/sylvainSUPINTERNET" class="btn-floating btn-sm mx-1 mb-0 btn-tw">
                                        <i class="fab fa-github-alt"></i>
                                    </a>

                                </div>
                                                
                                <div class="col-lg-4 col-md-6 mb-4">

                                    <div class="avatar mx-auto">
                                    <img src={Thomas} class="team rounded z-depth-1-half" alt="Sample avatar"/>                                 
                                    </div>

                                    <h4 class="font-weight-bold dark-grey-text my-4">Thomas Mallet</h4>
                                    <h6 class="text-uppercase grey-text mb-3"><strong>Développeur web full-stack</strong></h6>
                                                                                             
                                    <a type="button" href="https://fr.linkedin.com/in/thomas-mallet-497998121" class="btn-floating btn-sm mx-1 mb-0 btn-tw">
                                        <i class="fab fa-linkedin-in "></i>
                                    </a>
                            
                                    <a type="button" href="https://github.com/kivabien" class="btn-floating btn-sm mx-1 mb-0 btn-pin">
                                        <i class="fab fa-github-alt"></i>
                                    </a>

                                </div>

                            </div>
                                            
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

export default withRouter(Team);
