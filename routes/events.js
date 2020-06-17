const express = require("express");
const router = express.Router();
const connection = require("../connection");

// 1. Je veux pouvoir créer un nouvel événement.
router.post('/', (req,res) => {
  const formBody = req.body;
  connection.query('INSERT INTO event SET ?', [formBody], (err, results) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
        res.sendStatus(200);
    }
  });
}); //OK


// 2. Je veux pouvoir consulter un événement en renseignant son id dans l'url (juste ses données propres, pas les activités associées).
router.get('/:id', (req, res) => {
    const idEvent = req.params.id
    connection.query("SELECT * FROM event WHERE idevent = ?", [idEvent], (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).json(results);
      }
    })
}); //OK

//3. Je veux créer et affecter une activité à un événement.
router.post('/activity', (req,res) => {
  const formData = req.body;
  connection.query('INSERT INTO activity SET ?', [formData], (err, results) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      connection.query('SELECT * FROM activity AS a JOIN event AS e ON e.idevent = a.event_id', (err2, records) => {
        if(err){
          console.log(err);
          res.status(500).send(err);
        }
        else{
          res.status(200).json(records);
        }
      });
    } 
  });
});

//4. Je veux lister toutes les activités d'un événement.
router.get("/:id/activity", (req, res) => {
  const idEvent = req.params.id;

  connection.query('SELECT * FROM activity AS a JOIN event AS e ON a.event_id = e.idevent WHERE e.idevent = ? ', [idEvent], (err, results) => {
    if (err) {
      res.status(404).json({error: "Erreur", data: {}});
    } else {
      res.json({data: results});
    }
  });
});

//5. Je veux pouvoir supprimer un événement.
router.delete('/:id', (req, res) => {
  const idEvent= req.params.id
  connection.query('DELETE FROM event WHERE idevent = ?', [idEvent], err => {
    if (err) {
      res.status(500).send('Error in deleting')
    } else {
      res.status(200).send('Votre event à bien été supprimé')
    }
  });
});

//6. Je veux pouvoir modifier un événement.
router.put('/:id', (req, res) => {
  const idEvent= req.params.id
  const formData= req.body
  connection.query('UPDATE event SET ? WHERE idevent = ?', [formData, idEvent], err => {
    if (err) {
      res.status(500).send(err)
    }
    else{
      res.status(200).send('Votre event a bien été modifié')
    }
  });
});


//7. Je veux supprimer une activité d'un événement.
router.delete('/:idEvent/activity/:idActivity', (req, res) => {
  const idEvent = req.params.idEvent;
  const idActivity = req.params.idActivity;

  connection.query('SELECT * FROM activity AS a JOIN event AS e ON e.idevent = a.event_id WHERE idevent = ? AND id = ?', [idEvent, idActivity], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      connection.query('DELETE FROM activity WHERE id = ?', [idActivity], (err2, records) =>{
        if(err2){
          res.status(500).send(err2);
        }
        else{
          res.status(200).send('L\'activité de l\'événement a bien été supprimée');
        }
      });
    }
  });
});

//8. Je veux modifier une activité d'un événement.
router.put('/:idEvent/activity/:idActivity', (req, res) => {
  const formBody = req.body;
  const idEvent = req.params.idEvent;
  const idActivity = req.params.idActivity;

  connection.query('UPDATE activity AS a JOIN event AS e ON e.idevent = a.event_id SET ? WHERE idevent = ? AND id = ?', [formBody, idEvent, idActivity], (err2, results) => {
    if(err2) {
      res.status(500).send(err2);
    } else {
      res.status(200).send('L\'activité de l\'événement a bien été modifié');
    }
  });
});


//9. Je recupère tous les évents
router.get("/", (req, res) => {
    connection.query("SELECT * FROM event", (err, results) => {
      if (err) {
          res.status(404).send(err);
      } else {
          res.json(results);
      }
    });
  });


// Je veux récupérer tous les événements trié par nom
router.get("/", (req, res) => {
  const { name } = req.query;

  if(name){
    connection.query("SELECT * FROM event WHERE name = ?", [name], (err, results) => {
      console.log(req.query)
      if (err) {
        res.status(500).send(err);
      }
      else if(results.length === 0){
        res.status(404).send('Evénement non trouvé');
      }
      else {
        res.status(200).json(results);
      }
    });
  }
  else{
    console.log('coucou');
  }
});

// router.get("/", (req, res)=> {
//     let sql = 'SELECT * FROM event'
//     const sqlValues = []
//     if (req.query.name) {
//         sql += 'WHERE name=?'
//         sqlValues.push (req.query.name)
//     }
//     connection.query(sql, sqlValues, (err, results) => {
//         if (err) {
//             res.status(500).send('Error')
//         } else {
//             res.jason(results)
//         }
//     })
// })

//Je veux récupérer toutes les activités indépendamment de l'événement auxquelles elles sont liés
router.get("/activity", (req, res) => {
  const { title } = req.query
  if(name){
    connection.query("SELECT * FROM activity title = ?", [title], (err, results) => {
        if (err) {
            res.status(404).send(err);
        }
        else if(results.length === 0){
          res.status(404).send('Activité non trouvée');
        }
        else {
            res.json(results);
        }
    });
  }
});

// 10. get all activities filtered by title == a mettre su run nouveau fichier
router.get('/', (req, res) => {
  const { title } = req.query;

  if(title){
    connection.query('SELECT * FROM activity WHERE title = ?', [title], (err, results) => {
      if(err){
        res.status(500).send(err);
      }
      else if(results.length === 0){
        res.status(404).send('Evénement non trouvé');
      }
      else {
        res.status(200).json(results);
      }
    });
  }
});

module.exports = router;
