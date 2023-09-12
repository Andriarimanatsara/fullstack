import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const UpdateCategory = () =>{
    const navigate= useNavigate();
    
    const location= useLocation();
    const idUp=location.pathname.split("/")[2]

    const[category,setCategory]=useState({
        nameCategory:"",
        description:"",
    });

    const handleChange = (e) => {
      setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleInsert= async e=>{
        e.preventDefault()
        try {
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrud/update_category/"+idUp,category)
            if(response.data.status===201)
            {
                console.log(response.data.data)
                navigate("/listeCategory");
            }else{
                navigate("/updateCategory");
            }            
        } catch (error) {
            console.log("Erreur insertion=="+error)            
        }
        console.log(category);
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
                                
                                <a className="nav-item nav-link"><Link to="/listeProdAdmin" >Produits</Link></a>
                                <a className="nav-item nav-link"><Link to="/addAdmin" >Ajouter Produit</Link></a>
                                <a className="nav-item nav-link"><Link to="/listeCategory" style={{color:'white'}} >Categories</Link></a>
                                <a className="nav-item nav-link"><Link to="/addCategory" >Ajouter Categorie</Link></a>
                                
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
                        
                    </div>
                </div>
            </div>
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a><Link to="/listeProdAdmin" >Produits</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeCategory" >Categories</Link></a></li>
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
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleInsert}>Insert</button>           
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        

        </div>
    )
}

export default UpdateCategory