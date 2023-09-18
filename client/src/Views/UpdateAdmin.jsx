import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'
import configData from '../conf.json';

const UpdateAdmin = () =>{
    const[listsCat,setListsCat]=useState([]);
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

    const[liste,setListe]=useState([]);
    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_product_id/"+idUp, {
                    headers: {
                      Authorization: token,
                    },
                  });
                setListe(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllListe()
    },[idUp]);

    useEffect(()=>{
        const fetchAllListe=async()=>{
            try {
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_category")
                setListsCat(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllListe()
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

    const[produit,setProduit]=useState({
        idCategorie:"",
        nomProduit:"",
        description:"",
        photo:"",
        prixUnitaire:null,
    });
    useEffect(() => {
        if (liste.length > 0) {
          setProduit({
            idCategorie: liste[0].idCategorie,
            nomProduit: liste[0].nomProduit,
            description: liste[0].description,
            photo: liste[0].photo,
            prixUnitaire: liste[0].prixUnitaire,
          });
        }
      }, [liste]);

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
            const response = await axios.post(configData.REACT_APP_SERVER+"/ActuCrud/update_product/"+idUp,produit,config)///////
            if (response.data.status===201) {
                // Le fichier a été téléchargé avec succès
                setErrorMessage('');
                navigate("/listeProdAdmin");
            } else{
                // Le fichier existe déjà
                setErrorMessage(response.data.message);
                navigate("/updateAdmin/"+idUp);
            }
            
            navigate("/listeProdAdmin");
            //console.log(response);
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
            
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                    
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page"><Link to="/listeProdAdmin" style={{color:'white'}} >Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/addAdmin" style={{color:'blue'}} >Add Products</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/listeCategory" style={{color:'blue'}} >Category</Link></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link"><Link to="/addCategory" style={{color:'blue'}} >Add Category</Link></a>
                        </li>
                        <a>
                            <button className="btn-danger" onClick={fetchDeconnecte}>Log-Out</button>
                        </a>
                    </ul>
                        
                    </div>
                </div>
            </nav>
            
            
            <div className="login">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login-form">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Categorie</label>
                                    <select onChange={handleChange} name="idCategorie" className="form-control" style={{width: '100%'}}>
                                        <option value={0}>-Selected Categorie-</option> 
                                        {listsCat.map(listeCt=>(
                                            <option key={listeCt.id} value={listeCt.id}>{listeCt.nomCategorie}</option>
                                        ))} 
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label>Name Product</label>
                                    <input className="form-control" type="text" placeholder="Nom Produit" onChange={handleChange} name="nomProduit" value={produit.nomProduit} />
                                </div>

                                <div className="col-md-6">
                                    <label>Description</label>
                                    <textarea className="form-control" onChange={handleChange} name="description" rows="3" value={produit.description} ></textarea>
                                </div>
                                <div className="col-md-6">
                                    <label>Photo</label>
                                    <input className="form-control" type="file" placeholder="Photo" onChange={handleChange} name="photo" />
                                    {errorMessage && <b><p className="error-message" style={{color:'red'}}>{errorMessage}</p></b>}
                                </div>
                                <div className="col-md-6">
                                    <label>Price Unitaire</label>
                                    <input className="form-control" type="text" placeholder="Prix Unitaire" onChange={handleChange} name="prixUnitaire" value={produit.prixUnitaire} />
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

export default UpdateAdmin