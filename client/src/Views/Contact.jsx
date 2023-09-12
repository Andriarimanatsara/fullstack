import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const Contact = () =>{
    const[admin,setAdmin]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate= useNavigate();
    
    const location= useLocation();
    const countTotalProductsInCart = () => {
        const panierExistants = JSON.parse(localStorage.getItem('panier')) || [];
        let totalCount = 0;
    
        panierExistants.forEach(article => {
          totalCount += article.quantite;
        });
    
        return totalCount;
    };
    const [cartItemCount, setCartItemCount] = useState(countTotalProductsInCart());

    useEffect(()=>{
        const contactUs=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/contactUs")
                setAdmin(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        contactUs();
        const handleBeforeUnload = () => {
            localStorage.removeItem("panier");
        };
    
        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    },[]);

    const[contact,setContact]=useState({
        nameUser:"",
        emailUser:"",
        subject:"",
        message:"",
    });

    const handleChange = (e) => {
      setContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    
    
    const handleInsert= async e=>{
        e.preventDefault()
        try {
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrudSeq/insert_contact",contact)
            if (response.status === 200) {
                setErrorMessage('');
                //navigate("/");
            } else {
                setErrorMessage(response.data.error);
                //alert(response.data.erreur);
            }  
            console.log(response);       
        } catch (error) {
            console.log("Erreur insertion=="+error)            
        }
        console.log(contact);
    };

    return (
        <div className='afficheContent'>
            <div className="top-bar">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <i className="fa fa-envelope"></i>
                            stonesmidas@gmail.com
                        </div>
                        <div className="col-sm-6">
                            <i className="fa fa-phone-alt"></i>
                            +261 32 98 869 81
                            <i className="fa fa-whatsApp-alt"></i>
                            +261 38 65 069 82
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                        <a href="#" className="navbar-brand">MENU</a>
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                            <div className="navbar-nav mr-auto">
                                <a className="nav-item nav-link active"><Link to="/" >Home</Link></a>
                                <a className="nav-item nav-link"><Link to="/listeProduit" >Produits</Link></a>
                                
                                <a className="nav-item nav-link"><Link to="/cart" >Panier</Link></a>
                                <div className="nav-item dropdown">
                                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{color:'blue'}}>Plus de Pages</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"><Link to="/login" >Login </Link></a>
                                        <a className="dropdown-item"><Link to="/contact" style={{color:'white'}} >Contacter Nous</Link></a>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </nav>
                </div>
            </div>
            
            <div className="bottom-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo">
                                <a href="index.html">
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="user">
                                
                                <a href="cart.html" className="btn cart">
                                    <i className="fa fa-shopping-cart"></i>
                                    <span>({cartItemCount})</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a><Link to="/" >Home</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeProduit" >Products</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/login" >Login</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="contact">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4">
                            
                                <div className="contact-info">
                                    <h2>Contacter Nous</h2>
                                    <h3><i className="fa fa-map-marker"></i>Madagascar antananarivo</h3>
                                    <h3><i className="fa fa-envelope"></i>stonesmidas@gmail.com</h3>
                                    <h3><i className="fa fa-whatsApp"></i>+261 32 98 869 81</h3>
                                    <h3><i className="fa fa-phone"></i>+261 34 65 069 82</h3>
                                    <div className="social">
                                        <a href=""><i className="fab fa-twitter"></i></a>
                                        <a href=""><i className="fab fa-facebook-f"></i></a>
                                        <a href=""><i className="fab fa-linkedin-in"></i></a>
                                        <a href=""><i className="fab fa-instagram"></i></a>
                                        <a href=""><i className="fab fa-youtube"></i></a>
                                    </div>
                                </div>
                            
                        </div>
                        <div className="col-lg-4">
                            <div className="contact-form">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="text" className="form-control" placeholder="Your Name" onChange={handleChange} name="nameUser" />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="email" className="form-control" placeholder="Your Email" onChange={handleChange} name="emailUser" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Subject" onChange={handleChange} name="subject" />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control" rows="5" placeholder="Message" onChange={handleChange} name="message" ></textarea>
                                    </div>
                                    {errorMessage && <b><p className="error-message" style={{color:'red'}}>{errorMessage}</p></b>}
                                    <div><button className="btn" type="submit" onClick={handleInsert}>Send Message</button></div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="contact-map">
                                {/*  https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.733248043701!2d-118.24532098539802!3d34.05071312525937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c648fa1d4803%3A0xdec27bf11f9fd336!2s123%20S%20Los%20Angeles%20St%2C%20Los%20Angeles%2C%20CA%2090012%2C%20USA!5e0!3m2!1sen!2sbd!4v1585634930544!5m2!1sen!2sbd*/}
                                <iframe src="https://www.google.mg/maps/place/Amobohimiandra,+Tananarive/@-18.9281349,47.5446385,222m/data=!3m1!1e3!4m6!3m5!1s0x21f07dc47873b7fd:0x37bcd762f0ee0416!8m2!3d-18.930577!4d47.5404327!16s%2Fg%2F1tf8jd9m?entry=ttu" frameborder="0" style={{border:'0'}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        

        </div>
    )
}

export default Contact