import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const AddAdmin = () =>{
    const[listeCat,setListeCat]=useState([]);
    const[listsUnit,setListsUnit]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
    const location= useLocation();
    const idUp=location.pathname.split("/")[2]

    const token = localStorage.getItem('jwtToken');
    const navigate= useNavigate();
    
    useEffect(() => {
        if (!token) {
          // Redirigez l'utilisateur vers la page de connexion s'il n'y a pas de token
          navigate('/login');
        }
      }, [token, navigate]);

    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_category", {
                    headers: {
                      Authorization: token,
                    },
                  });
                setListeCat(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllListe();
        const handleBeforeUnload = () => {
            localStorage.removeItem("jwtToken");
        };

        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    },[]);

    useEffect(()=>{
        const fetchAllUnite=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_unite");
                setListsUnit(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllUnite()
    },[]);

    const[produit,setProduit]=useState({
        idCategorie:null,
        nomProduit:"",
        description:"",
        photo:"",
        prixUnitaire:null,
        poids:null,
        idUnite:null,
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
            if (response.data.status===201) {
                // Le fichier a été téléchargé avec succès
                setErrorMessage('');
                navigate("/listeProdAdmin");
            } else{
                // Le fichier existe déjà
                setErrorMessage(response.data.message);
                navigate("/addAdmin");
            }
            

            /*navigate("/listeProdAdmin");*/
            console.log(response);
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier', error);
        }
        //console.log("tsy maintsy miseo");
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
            
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
                <div className="container-fluid">
                    
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page"><Link to="/listeProdAdmin" style={{color:'blue'}} >Products</Link></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active"><Link to="/addAdmin" style={{color:'white'}} >Add Products</Link></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"><Link to="/listeCategory" style={{color:'blue'}} >Category</Link></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"><Link to="/addCategory" style={{color:'blue'}} >Add Category</Link></a>
                        </li>
                        <a>
                            <button className="btn-danger" onClick={fetchDeconnecte}>Log-Out</button>
                        </a>
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
                        
                    </div>
                </div>
            </div>
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                    <li className="breadcrumb-item"><a><Link to="/listeProdAdmin" >Products</Link></a></li>
                        <li className="breadcrumb-item"><a><Link to="/listeCategory" >Category</Link></a></li>
                        <li className="breadcrumb-item active"><Link to="/addAdmin" >Add Products</Link></li>
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
                                    <label>Category</label>
                                    <select onChange={handleChange} name="idCategorie" className="form-control" style={{width: '100%'}} required>
                                        <option value={0}>-Selected Categorie-</option> 
                                        {listeCat.map(listeCt=>(
                                            <option key={listeCt.id} value={listeCt.id}>{listeCt.nomCategorie}</option>
                                        ))} 
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label>Name Product</label>
                                    <input className="form-control" type="text" placeholder="Nom Produit" onChange={handleChange} name="nomProduit" required />
                                </div>

                                <div className="col-md-6">
                                    <label>Description</label>
                                    <textarea className="form-control" onChange={handleChange} name="description" rows="3" value={produit.description} required ></textarea>
                                </div>
                                <div className="col-md-6">
                                    <label>Photo</label>
                                    <input className="form-control" type="file" placeholder="Photo" onChange={handleChange} name="photo" />
                                    {errorMessage && <b><p className="error-message" style={{color:'red'}}>{errorMessage}</p></b>}
                                </div>
                                <div className="col-md-6">
                                    <label>Price Unitaire</label>
                                    <input className="form-control" type="text" placeholder="Prix Unitaire" onChange={handleChange} name="prixUnitaire" required />
                                </div>
                                <div className="col-md-6">
                                    <label>Poids</label>
                                    <input className="form-control" type="text" placeholder="Poids" onChange={handleChange} name="poids" required />
                                </div>
                                <div className="col-md-6">
                                    <label>Unite</label>
                                    <select onChange={handleChange} name="idUnite" className="form-control" style={{width: '100%'}} required>
                                        <option value={0}>-Selected Unite-</option> 
                                        {listsUnit.map(listeUt=>(
                                            <option key={listeUt.id} value={listeUt.id}>{listeUt.unite}</option>
                                        ))} 
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <button className="btn" onClick={handleUpdate}>Add</button>           
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