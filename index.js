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

        // Ruta para eliminar una entrada de película
        app.delete('/peliculas/:id', (req, res) => {
            const id = req.params.id;

            Movie.findById(id)
                .then(movie => {
                    if (!movie) {
                        return res.status(404).json({ error: 'No se encontró la entrada de película' });
                    }

                    // Verificar el estado de la entrada
                    if (movie.estado === 'cancelado') {
                        return res.status(400).json({ error: 'La entrada de película ya está cancelada' });
                    }

                    // Actualizar el estado a "cancelado"
                    movie.estado = 'cancelado';

                    movie.save()
                        .then(() => {
                            res.json({ mensaje: 'Entrada de película cancelada exitosamente' });
                        })
                        .catch(error => {
                            res.status(500).json({ error: 'Error al cancelar la entrada de película' });
                        });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Error al buscar la entrada de película' });
                });
        });

        // Iniciar el servidor
        app.listen(4000, () => {
            console.log('Servidor en ejecución en el puerto 4000');
        });
