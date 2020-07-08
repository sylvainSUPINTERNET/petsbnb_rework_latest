import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";

class Partners extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>Nos partenaires</h3></div>
                    </div>

                    <div className="card">
                        <div className="card-body">

                            <p class="text-center">Pour le moment, nous n'avons pas de partenaires ...</p>
                            <p class="text-center">Pour toute demande, merci de nous contacter par email à l'adresse <a href="mailto:petsbnb45@gmail.com">petsbnb45@gmail.com</a></p>
                                                                    
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


export default withRouter(Partners);
