const express = require('express');
const mongoose = require('mongoose');

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost/pruebacm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch(error => {
        console.error('Error al conectar a la base de datos:', error);
    });

// Definir el esquema para los usuarios
const userSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String
});

// Definir el modelo para los usuarios
const User = mongoose.model('User', userSchema);

// Definir el esquema para las películas
const movieSchema = new mongoose.Schema({
    pelicula: String,
    hora_inicio: String,
    cantidad: Number,
    precio: Number,
    sala: String,
    estado: { type: String, default: 'activo' } // Nuevo campo para el estado de la entrada
});

// Definir el modelo para las películas
const Movie = mongoose.model('Movie', movieSchema);


// Definir el modelo para las películas
const Movie = mongoose.model('Movie', movieSchema);

const app = express();

// Configurar middlewares
app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, email, telefono } = req.body;

    const user = new User({
        nombre,
        email,
        telefono
    });

    user.save()
        .then(() => {
            res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al registrar el usuario' });
        });
});

// Ruta para registrar una nueva película
app.post('/peliculas', (req, res) => {
    const { pelicula, hora_inicio, cantidad, precio, sala } = req.body;

    const total = cantidad * precio;
    const descuento = total > 20 ? total * 0.05 : 0;
    const totalPagar = total - descuento;

    const movie = new Movie({
        pelicula,
        hora_inicio,
        cantidad,
        precio,
        sala
    });

    movie.save()
        .then(() => {
            res.status(201).json({ mensaje: 'Película registrada exitosamente', descuento, totalPagar });
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al registrar la película' });
        });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});
