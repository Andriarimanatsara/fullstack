import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const AddCategory = () =>{
    const location= useLocation();
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('jwtToken');
    const navigate= useNavigate();
    
    useEffect(() => {
        if (!token) {
          // Redirigez l'utilisateur vers la page de connexion s'il n'y a pas de token
          navigate('/login');
        }
        const handleBeforeUnload = () => {
            localStorage.removeItem("jwtToken");
        };

        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, [token, navigate]);

    const[category,setCategory]=useState({
        nameCategory:"",
        description:"",
    });

    const handleChange = (e) => {
      setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleInsert= async e=>{
       
        try {
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrud/add_category",category)///////
            if(response.data.status===201)
            {
                setErrorMessage('');
                navigate("/listeProdAdmin");
            }else{
                setErrorMessage(response.data.message);
                navigate("/addCategory");
            }            
        } catch (error) {
            console.error('Erreur insertion', error);
        }
    };

    const fetchDeconnecte= ()=>{
        localStorage.removeItem("jwtToken");
        navigate("/");
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
            
            <div className="nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                        <a href="#" className="navbar-brand">MENU</a>
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                            <div className="navbar-nav mr-auto">
                                
                                <a className="nav-item nav-link"><Link to="/listeProdAdmin" >Products</Link></a>
                                <a className="nav-item nav-link"><Link to="/addAdmin" >Add Products</Link></a>
                                <a className="nav-item nav-link"><Link to="/listeCategory" >Category</Link></a>
                                <a className="nav-item nav-link"><Link to="/addCategory" style={{color:'white'}} >Ajouter Categorie</Link></a>
                                <a>
                                    <button className="btn" onClick={fetchDeconnecte}>Log-Out</button>
                                </a>
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
                                <a>
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a><Link to="/listeProdAdmin" >Products</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeCategory" >Category</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/addCategory" >Ajouter Categorie</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="login">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login-form">
                                <div className="col-md-6">
                                    <label>Nom Categorie</label>
                                    <input className="form-control" type="text" placeholder="Nom Categorie" onChange={handleChange} name="nameCategory" />
                                </div>

                                <div className="col-md-6">
                                    <label>Description</label>
                                    <textarea className="form-control" onChange={handleChange} name="description" rows="3" ></textarea>
                                </div>
                                {errorMessage && <b><p className="error-message" style={{color:'red'}}>{errorMessage}</p></b>}
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleInsert}>Ajouter</button>           
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        

        </div>
    )
}

export default AddCategory