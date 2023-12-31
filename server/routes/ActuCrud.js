const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const path =require('path')
const express=require('express')
const bodyParser= require('body-parser')
const app=express();
const connection=require('../DbConnect.js')
const router = express.Router();
const mysql = require('mysql');

app.set('views', path.join(__dirname, '..', 'views'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use(cors())

//listes
router.get('/lists_product', (req, res) => {
  let sqlString="select categorie.id as idCategorie,categorie.nomCategorie,produit.id as idProduit,produit.nomProduit,produit.prixUnitaire,produit.photo,produit.poids,unite.unite from categorie LEFT JOIN produit ON categorie.id = produit.idCategorie LEFT JOIN unite ON produit.idUnite=unite.id"
  let query= connection.query(sqlString,(err,rows) => {
    if(err){
      console.error(err);
      res.status(500).json({ title: 'Une erreur est survenue.', content: err.message, fatal: err.fatal });
    } else {
      const categories = {};
      rows.forEach(row => {
        if (!categories[row.idCategorie]) {
          categories[row.idCategorie] = {
            idCategorie: row.idCategorie,
            nomCategorie: row.nomCategorie,
            produits: [],
          };
        }
        if (row.idProduit) {
          categories[row.idCategorie].produits.push({
            idProduit: row.idProduit,
            nomProduit: row.nomProduit,
            prixUnitaire: row.prixUnitaire,
            photo: row.photo,
            poids: row.poids,
            unite: row.unite,
          });
        }
      });
      res.json(Object.values(categories));
    }
  });
});

//listesCat
router.get('/lists_category', (req, res) => {
  let sqlString="SELECT * FROM categorie";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

//listesDescri/:idProduit
router.get('/lists_by_product/:idProduct', (req, res) => {
  const idProduct=req.params.idProduct;
  let sqlString="select produit.id as id,idCategorie,nomProduit,produit.description as description,photo,prixUnitaire,categorie.nomCategorie,categorie.description as descriptionCat,produit.poids,unite.unite from produit LEFT JOIN categorie ON produit.idCategorie = categorie.id LEFT JOIN unite ON produit.idUnite=unite.id where produit.id="+idProduct;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

//listesPg
router.get('/lists_paging', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page par défaut est 1
  const perPage = parseInt(req.query.perPage) || 10; // Nombre d'éléments par page par défaut est 10

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  let sqlString = `SELECT produit.id as id,idCategorie,nomProduit,produit.description as description,photo,prixUnitaire,produit.poids,unite.unite FROM produit LEFT JOIN unite ON produit.idUnite=unite.id LIMIT ${startIndex}, ${perPage}`;
  let query = connection.query(sqlString, (err, rows) => {
    if (err) return res.json(err);

    // Récupérer le nombre total d'éléments pour la pagination
    connection.query('SELECT COUNT(*) AS totalCount FROM produit', (countErr, countRows) => {
      if (countErr) return res.json(countErr);

      const totalCount = countRows[0].totalCount;
      const totalPages = Math.ceil(totalCount / perPage);

      const response = {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: perPage,
        totalCount: totalCount,
        data: rows
      };

      return res.json(response);
    });
  });
});

//listesProdCat/:idCat
router.get('/lists_by_category/:idCategory', (req, res) => {
  const idCategory=req.params.idCategory;
  const page = parseInt(req.query.page) || 1; // Page par défaut est 1
  const perPage = parseInt(req.query.perPage) || 10; // Nombre d'éléments par page par défaut est 10

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  let sqlString="SELECT produit.id as id,idCategorie,nomProduit,produit.description as description,photo,prixUnitaire,produit.poids,unite.unite FROM produit LEFT JOIN unite ON produit.idUnite=unite.id where idCategorie="+idCategory+" LIMIT "+startIndex+", "+perPage;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    connection.query('SELECT COUNT(*) AS totalCount FROM produit where idCategorie='+idCategory, (countErr, countRows) => {
      if (countErr) return res.json(countErr);

      const totalCount = countRows[0].totalCount;
      const totalPages = Math.ceil(totalCount / perPage);

      const response = {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: perPage,
        totalCount: totalCount,
        data: rows
      };
      return res.json(response);
    });
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './client/public/img'); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const isImg=(req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(null,Error("only img is allowed"))
  }
}

const upload = multer({ storage:storage,fileFilter:isImg });

router.post('/add_product', upload.single('photo'), (req, res) => {
  let data={idCategorie:req.body.idCategorie,nomProduit:req.body.nomProduit,description:req.body.description,/*photo:req.file ? req.file.originalname : '',*/prixUnitaire:req.body.prixUnitaire,poids:req.body.poids,idUnite:req.body.idUnite};
  if(data.idCategorie<1 || !data.nomProduit || !data.description /*|| !data.photo */|| !data.prixUnitaire || !data.poids || data.idUnite<1)
  {
    return res.json({status:422,message:"fill all the details"})
  }else if(data.idCategorie>=1 && data.nomProduit && data.description && data.prixUnitaire && data.poids && data.idUnite>=1){
    try{
      const nomProduit = mysql.escape(data.nomProduit);
      const description = mysql.escape(data.description);
      //let sqlString = "INSERT INTO produit(idCategorie,nomProduit,description,photo,prixUnitaire)values(" + data.idCategorie + ",'" + nomProduit + "','" + description + "','" + data.photo + "'," + data.prixUnitaire + ")";
      let sqlString = "INSERT INTO produit(idCategorie,nomProduit,description,prixUnitaire,poids,idUnite)values(" + data.idCategorie + "," + nomProduit + "," + description + /*"','" + data.photo + */"," + data.prixUnitaire + ","+data.poids+","+data.idUnite+")";
      let query = connection.query(sqlString,(err, results) => {
        if (err) {
          return res.json({status:500,message:"Une erreur est survenue"});
        }else{
          console.log("data added")
          return res.json({status:201,message:"OK",data:req.body})
        }
      })
    }catch(error){
      return res.json({status:422,message:"Une erreur lié au serveur"})
    }
  }
});

//updateProduit
router.post('/update_product/:id', upload.single('photo'), (req, res) => {
  const id=req.params.id;
  let data={idCategorie:req.body.idCategorie,nomProduit:req.body.nomProduit,description:req.body.description,/*photo:req.file ? req.file.originalname : '',*/prixUnitaire:req.body.prixUnitaire,poids:req.body.poids,idUnite:req.body.idUnite};
  
  /*let sqlString = "UPDATE produit SET idCategorie='" + data.idCategorie + "', nomProduit='" + data.nomProduit + "', description='" + data.description + "', photo='" + data.photo + "', prixUnitaire=" + data.prixUnitaire + " WHERE id=" + id;
  
  const filePath = `./client/public/img/${data.photo}`;
  if (fs.existsSync(filePath)) {
    return res.status(409).json({ message: 'Le fichier existe déjà' });
  }

  let query = connection.query(sqlString,(err, results) => {
    if (err) {
      return res.json(err);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprimer le fichier existant après la mise à jour
    }

    return res.status(200).json({ message: 'Mise à jour réussie' });
  });*/
  if(data.idCategorie <1 || !data.nomProduit || !data.description /*|| !data.photo*/ || !data.prixUnitaire || !data.poids || data.idUnite<1)
  {
    return res.json({status:422,message:"fill all the details"})
  }else if(data.idCategorie>=1 && data.nomProduit && data.description && data.prixUnitaire && data.poids && data.idUnite>=1){
    try{
      const nomProduit = mysql.escape(data.nomProduit);
      const description = mysql.escape(data.description);
      let sqlString = "UPDATE produit SET idCategorie=" + data.idCategorie + ", nomProduit=" + nomProduit + ", description=" + description + /*"', photo='" + data.photo +*/ ", prixUnitaire=" + data.prixUnitaire + ", poids="+data.poids+", idUnite="+ data.idUnite +" WHERE id=" + id;
      let query = connection.query(sqlString,(err, results) => {
        if (err) {
          return res.json({status:500,message:"Une erreur est survenue"});
        }else{
          console.log("data updated")
          return res.json({status:201,message:"OK",data:req.body})
        }
      });
      //return res.json({sqlStr:sqlString});
    }catch(error){
      return res.json({status:422,message:"Une erreur lié au serveur"})
    }
  }
  // Traitez le fichier téléchargé ici
  //return res.status(200).json({ message: 'Fichier téléchargé avec succès' });
});
////////////////update\\\\\\\\\\\\\\\\\\\\\\\\

router.get('/delete_product/:id', (req, res) => {
  const id=req.params.id;
  let sqlString="DELETE FROM produit where id="+id;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

router.post('/add_category', (req, res) => {
  let data={name:req.body.nameCategory,description:req.body.description};
 
  if(!data.name || !data.description)
  {
    return res.json({status:422,message:"fill all the details"})
  }else if(nomCategorie && description){
    const nomCategorie = mysql.escape(data.name);
    const description = mysql.escape(data.description);
    let sqlString="INSERT INTO categorie(nomCategorie, description) values('"+ nomCategorie +"','"+ description  +"')";
    let query= connection.query(sqlString,(err,results) => {
      if(err) return res.json({status:500,message:"Une erreur est survenue"});
      return res.json({status:201,message:"OK",data:req.body})
    });
  }
});

router.post('/update_category/:id', (req, res) => {
  const idCategorie=req.params.id;
  let data={name:req.body.nameCategory,description:req.body.description};
  if(!data.name || !data.description)
  {
    return res.json({status:422,message:"fill all the details"})
  }else if(nomCategorie && description){
    const nomCategorie = mysql.escape(data.name);
    const description = mysql.escape(data.description);
    let sqlString="UPDATE categorie SET nomCategorie='"+ nomCategorie +"', description='"+ description+ "' where id="+idCategorie;
    let query= connection.query(sqlString,(err,results) => {
      if(err) return res.json({status:500,message:"Une erreur est survenue"});
      return res.json({status:201,message:"OK",data:req.body})
    });
  }
});

router.get('/delete_category/:id', (req, res) => {
  const categoryId = req.params.id;

  // Étape 1 : Supprimer les produits associés à la catégorie
  const deleteProductsQuery ="DELETE FROM produit WHERE idCategorie ="+categoryId;
  connection.query(deleteProductsQuery, (err, productDeletionResults) => {
    if (err) {
      return res.json(err);
    }

    // Étape 2 : Supprimer la catégorie
    const deleteCategoryQuery = "DELETE FROM categorie WHERE id = "+categoryId;
    connection.query(deleteCategoryQuery, (err, categoryDeletionResults) => {
      if (err) {
        return res.json(err);
      }

      return res.json("Suppression réussie")
    });
  });
});

router.get('/contact_us', (req, res) => {
  let sqlString="SELECT * FROM admin ";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.post('/search', (req, res) => {
  let nameProduct=req.body.nomProduit;
  let sqlString="select produit.id as id,idCategorie,nomProduit,produit.description as description,photo,prixUnitaire,produit.poids,unite.unite from produit LEFT JOIN unite ON produit.idUnite=unite.id where LOWER(nomProduit) LIKE LOWER('%"+nameProduct+"%')";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/lists_product_id/:id', (req, res) => {
  const id=req.params.id;
  let sqlString="SELECT produit.id as id,idCategorie,nomProduit,produit.description as description,photo,prixUnitaire,produit.poids,unite.unite FROM produit LEFT JOIN unite ON produit.idUnite=unite.id where produit.id="+id;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/lists_category_id/:id', (req, res) => {
  const id=req.params.id;
  let sqlString="SELECT * FROM categorie where id="+id;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

router.get('/lists_unite', (req, res) => {
  let sqlString="SELECT * FROM unite";
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
  });
});

module.exports = router;