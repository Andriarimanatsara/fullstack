const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const path =require('path')
const express=require('express')
const bodyParser= require('body-parser')
const app=express();
const connection=require('../DbConnect.js')
const router = express.Router();

app.set('views', path.join(__dirname, '..', 'views'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use(cors())

//listes
router.get('/lists_product', (req, res) => {
  let sqlString="select categorie.id as idCategorie,categorie.nomCategorie,produit.id as idProduit,produit.nomProduit,produit.prixUnitaire,produit.photo from categorie LEFT JOIN produit ON categorie.id = produit.idCategorie"
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
  let sqlString="SELECT * FROM produit where id="+idProduct;
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

  let sqlString = `SELECT * FROM produit LIMIT ${startIndex}, ${perPage}`;
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
  let sqlString="SELECT * FROM produit where idCategorie="+idCategory;
  let query= connection.query(sqlString,(err,rows) => {
    if(err) return res.json(err);
    return res.json(rows);
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

router.post('/add_product', (req, res) => {
  let data=req.body;
  let sqlString="INSERT INTO produit(idCategorie, nomProduit, description, prixUnitaire, photo) values('"+data.category+"','"+data.name+"','"+data.description+"','"+data.price+"','"+data.picture+"')";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json({ status: 201,data: req.body })
  });
});

router.post('/add_category', (req, res) => {
  let data=req.body;
  let sqlString="INSERT INTO categorie(nomCategorie, description) values('"+data.name+"','"+data.description+"')";
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json({status:201,data:req.body})
  });
});

//updateProduit
router.post('/update_product/:id', upload.single('photo'), (req, res) => {
  const id=req.params.id;
  //console.log(req.file)
  let data={idCategorie:req.body.idCategorie,nomProduit:req.body.nomProduit,description:req.body.description,photo:req.file ? req.file.originalname : '',prixUnitaire:req.body.prixUnitaire};
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
  if(!data.idCategorie || !data.nomProduit || !data.description || !data.photo || !data.prixUnitaire)
  {
    res.json({status:422,message:"fill all the details"})
  }
  try{
    let sqlString = "UPDATE produit SET idCategorie=" + data.idCategorie + ", nomProduit='" + data.nomProduit + "', description='" + data.description + "', photo='" + data.photo + "', prixUnitaire=" + data.prixUnitaire + " WHERE id=" + id;
    let query = connection.query(sqlString,(err, results) => {
      if (err) {
        res.json(err);
      }else{
        console.log("data updated")
        res.json({status:201,data:req.body})
      }
    })
  }catch(error){
    res.json({status:422,error})
  }

  // Traitez le fichier téléchargé ici
  //return res.status(200).json({ message: 'Fichier téléchargé avec succès' });
});
////////////////update\\\\\\\\\\\\\\\\\\\\\\\\

router.delete('/delete_product/:id', (req, res) => {
  const id=req.params.id;
  let sqlString="DELETE FROM produit where id="+id;
  let query= connection.query(sqlString,(err,results) => {
    if(err) return res.json(err);
    return res.json("delete successfuly");
  });
});

module.exports = router;