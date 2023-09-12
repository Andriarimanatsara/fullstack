import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const AddAdmin = () =>{
    const[listeCat,setListeCat]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate= useNavigate();
    
    const location= useLocation();
    const idUp=location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/listesCat")
                setListeCat(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllListe()
    },[]);

    const[produit,setProduit]=useState({
        idCategorie:"",
        nomProduit:"",
        description:"",
        photo:"",
        prixUnitaire:null,
    });

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
          const selectedFile = e.target.files[0];
          setProduit((prev) => ({ ...prev, [e.target.name]: selectedFile }));
        } else {
          setProduit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };
    
    const handleUpdate= async e=>{
        e.preventDefault()
        const config={
            headers:{
                "Content-type":"multipart/form-data"
            }
        }
        //console.log(produit)
        try {
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrud/add_product",produit,config)///////
            /*if (response.status===200) {
                // Le fichier a été téléchargé avec succès
                setErrorMessage('');
                navigate("/listeProdAdmin");
            } else if (response.status === 409) {
                // Le fichier existe déjà
                setErrorMessage('Le fichier existe déjà');
            }*/
            /*if(response.data.status===201)
            {
                navigate("/listeProdAdmin");
            }else{
                alert("error");
            }*/
            navigate("/listeProdAdmin");
            //console.log(response);
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier', error);
        }
        //console.log("tsy maintsy miseo");
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
                                <a className="nav-item nav-link"><Link to="/listeCategory" >Categories</Link></a>
                                <a className="nav-item nav-link"><Link to="/addCategory" style={{color:'white'}} >Ajouter Categorie</Link></a>

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
                    <li className="breadcrumb-item"><a><Link to="/listeProdAdmin" >Produits</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeCategory" >Categories</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/addAdmin" >Ajouter Produit</Link></li>
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
                                    <label>Categorie</label>
                                    <select onChange={handleChange} name="idCategorie" class="form-control" style={{width: '100%'}}>
                                        {listeCat.map(listeCt=>(
                                            <option key={listeCt.id} value={listeCt.id}>{listeCt.nomCategorie}</option>
                                        ))} 
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label>Nom Produit</label>
                                    <input className="form-control" type="text" placeholder="Nom Produit" onChange={handleChange} name="nomProduit" />
                                </div>

                                <div className="col-md-6">
                                    <label>Description</label>
                                    <textarea class="form-control" onChange={handleChange} name="description" rows="3" value={produit.description} ></textarea>
                                </div>
                                <div className="col-md-6">
                                    <label>Photo</label>
                                    <input className="form-control" type="file" placeholder="Photo" onChange={handleChange} name="photo" />
                                    {errorMessage && <p>{errorMessage}</p>}
                                </div>
                                <div className="col-md-6">
                                    <label>Prix Unitaire</label>
                                    <input className="form-control" type="text" placeholder="Prix Unitaire" onChange={handleChange} name="prixUnitaire" />
                                </div>
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleUpdate}>Update</button>           
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

export default AddAdmin