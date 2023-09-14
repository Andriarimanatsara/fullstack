import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {useLocation, useNavigate} from "react-router-dom"
import axios from 'axios'

import configData from '../conf.json';

const ListeCategory = () =>{
    const[listeCat,setListeCat]=useState([]);
    
    const location= useLocation();

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
                const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_category")
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
      }, [token, navigate]);

    const[category,setCategory]=useState({
        nameCategory:"",
        description:"",
    },[]);
    
    const fetchAllListe=async()=>{
        try {
            const res=await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/lists_category")
            setListeCat(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleRemoveItem= async(idCat)=>{
       
        try {
            const response = await axios.get(configData.REACT_APP_SERVER+"/ActuCrud/delete_category/"+idCat)///////
            fetchAllListe();      
        } catch (error) {
            console.error('Erreur suppresion', error);
        }
    };

    const fetchDeconnecte= async e=>{
        e.preventDefault();
        localStorage.removeItem("jwtToken");
        navigate("/listeIndex");
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
                                <a className="nav-item nav-link"><Link to="/listeCategory" style={{color:'white'}} >Category</Link></a>
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
                                <a>
                                    <img src="img/logo-midas.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        
                        <div className="col-md-9">
                            <div className="user">
                                
                                <button onClick={()=>fetchDeconnecte()}>Log- out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-9">
                
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>No</th>
                                        <th>Name Category</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listeCat.map((listeCt,index)=>(
                                        <tr key={listeCt.id}>
                                            <td>{index + 1}</td>
                                            <td>{listeCt.nomCategorie}</td>
                                            <td>{listeCt.description}</td>
                                            <td>
                                                <button className="btn" style={{color:'green'}} ><Link to={`/updateCategory/${listeCt.id}`}>Update</Link></button>
                                                <button className="btn" onClick={()=>handleRemoveItem(listeCt.id)} style={{color:'red'}}>Delete</button>
                                            </td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </table>
                        </div>
                    
            </div>
            
        

        </div>
    )
}

export default ListeCategory