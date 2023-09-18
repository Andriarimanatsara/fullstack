import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Slider from "react-slick";
import configData from '../conf.json';
import {useLocation, useNavigate} from "react-router-dom"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Login = () =>{
    const [errorMessage, setErrorMessage] = useState('');
    const navigate= useNavigate();
    
    const location= useLocation();
    const token = localStorage.getItem('jwtToken');
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
        const handleBeforeUnload = () => {
            localStorage.removeItem("panier");
            localStorage.removeItem("jwtToken");
        };
    
        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    },[]);

    const[admin,setAdmin]=useState({
        name:"",
        email:"",
    });

    const handleChange = (e) => {
      setAdmin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleInsert= async e=>{
        e.preventDefault()
        try {
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrudSeq/loging",admin)
            console.log(response);
            if(response.status===200)
            {
                localStorage.setItem('jwtToken', response.data.token);
                navigate("/listeProdAdmin");
            }else{
                navigate("/login");
                setErrorMessage(response.data.message);
            }            
        } catch (error) {
            console.log("Erreur insertion=="+error)            
        }
        console.log(admin);
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
                            <i className="fa fa-whatsapp-alt"></i>
                            +261 38 65 069 82
                        </div>
                    </div>
                </div>
            </div>
            
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page"><Link to="/" style={{color:'blue'}} >Home</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/listeProduit" style={{color:'blue'}} >Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/cart" style={{color:'blue'}} >Cart</Link></a>
                        </li>
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{color:'white'}}>More Pages</a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item"><Link to="/login" >Login</Link></a>
                                <a className="dropdown-item"><Link to="/contact" >Contact Us</Link></a>
                            </div>
                        </div>
                    </ul>
                        
                    </div>
                </div>
            </nav>
            
            <div className="bottom-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo">
                                <a>
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        
                        <div className="col-md-9">
                            <div className="user">
                                
                                <a className="btn cart">
                                    <Link to="/cart" >
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>({cartItemCount})</span>
                                    </Link>
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
                        <li className="breadcrumb-item active"><Link to="/register" >Login & Register</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="login">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>E-mail / Username</label>
                                        <input className="form-control" type="text" placeholder="E-mail / Username" onChange={handleChange} name="email"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Password</label>
                                        <input className="form-control" type="password" placeholder="Password" onChange={handleChange} name="password"/>
                                    </div>
                                    {errorMessage && <b><p className="error-message" style={{color:'red'}}>{errorMessage}</p></b>}
                                    <div className="col-md-12">
                                        <button className="btn" onClick={handleInsert}>Se Connecter</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        

        </div>
    )
}

export default Login