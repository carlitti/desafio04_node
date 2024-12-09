const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

require('dotenv').config(); 

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme',
  password: 'karlos100',
  port: 5432,
});


app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});


app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *';
    const values = [titulo, img, descripcion];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

pool.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error conectando a la base de datos', err));

  app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
  });

  app.put('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const { likes } = req.body; 
    try {
        const result = await pool.query(
            'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *',
            [likes, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Post no encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

app.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
          return res.status(404).send('Post no encontrado');
      }
      res.send('Post eliminado correctamente');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
  }
});

