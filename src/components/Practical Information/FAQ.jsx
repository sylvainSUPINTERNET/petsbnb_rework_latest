import React from 'react';
import Footer from '../../components/Partials/Footer';
import {withRouter} from "react-router-dom";
import LoadingOverlay from 'react-loading-overlay';
import Menu from "../Menu/Menu";
import Faq from 'react-faq-component';

const data = {
    title: " ",
    rows: [
      {
        title: " Comment supprimer mon compte ? ",
        content: "Pour cela, il suffit d'envoyer un email à notre adresse <a href=\"mailto:petsbnb45@gmail.com\">petsbnb45@gmail.com</a> en nous transmettant votre nom d'utilisateur et votre adresse mail."
      },
      {
        title: "Comment contacter PetsBNB ?",
        content: " <p>Vous avez besoin de conseil ? Vous avez une suggestion à nous transmettre ? Une question à poser concernant le fonctionnement du site ?</p> <p>Pour cela rien de plus simple, vous pouvez nous contacter par mail à l'adresse <a href=\"mailto:petsbnb45@gmail.com\">petsbnb45@gmail.com</a></p> <p>Nous sommes aussi disponibles sur nos réseaux sociaux."
      },
      {
        title: "Quel est l'intérêt d'un compte prenium ?",
        content: "<p>L'offre payante permet de poster plusieurs annonces et donc de bénéficier d'une visibilité supérieure aux personnes bénéficiant de l'offre gratuite.</li></ul><p>"
      },
      {
        title: "Comment sont fixer les prix pour la garde ?",
        content: "<p>Sur PetsBNB, ce sont les petsitters qui fixent les prix.<p><p>Nous faisons entièrement confiance en votre bonne foi. Si nous voyons des débordements dans les prix, alors, nous serons obligé de prendre les mesures qui s'imposent.</p>"
      },
      {
        title: "Qui prend en charge la nourriture ?",
        content: "<p>Le propriétaire de l'animal ou la personne qui garde l'animal. Il faudra vous mettre d'accord.</p> <p>Un conseil à vous donner. Il est préférable que la nourriture soit fournie par le propriétaire de l'animal au moment de la garde pour éviter tout changement alimentaire et pour le confort des animaux.</p>"
      }]
  }

  const styles = {
    titleTextColor: "blue",
    rowTitleColor: "blue",
  };

class FAQ extends React.Component {
    
    render() {
        return (
            <div className="">
                <Menu/>
                <div className="container py-3">
                  
                    <div className="card-header blue darken-4 m-0 p-0">
                        <div className="text-center mt-2 p-1 white-text"><h3>FAQ</h3></div>
                    </div>

                    <div className="card">
                        <div className="card-body">

                          <Faq data={data} styles={styles} />

                          <p class="contact-faq">Si vous voulez qu'on rajoute des questions, n'hésitez pas à nous l'indiquer par email : <a href="mailto:petsbnb45@gmail.com">petsbnb45@gmail.com</a></p>
                                                                                                        
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

export default withRouter(FAQ);
