const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configura la conexión a la base de datos
const db = mysql.createConnection({
    host: '10.0.6.39',
    user: 'estudiante',
    password: 'Info-2023', // 
    database: 'firgolini',  //
    port: 3306              // 
});

// Conéctate a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

//--------------------------------------------------------------------------------------------------------------------------------------------//

// Middleware para parsear el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos de la carpeta 'imagenes'
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Ruta para servir el formulario HTML
app.use(express.static(path.join(__dirname, 'pagina_principal')));

// Ruta para manejar la subida de imágenes
app.post('/subir_imagenes', upload.single('imagen'), (req, res) => {
    // Extrae 'nombre' y 'descripcion' del cuerpo de la solicitud
    const { nombre, descripcion } = req.body;
    // Extrae el nombre del archivo subido desde la solicitud
    const imagen = req.file.filename;
    // Define la consulta SQL para insertar los datos en la tabla 'imagenes'
    const query = 'INSERT INTO imagenes (nombre, descripcion, imagen) VALUES (?, ?, ?)';
    // Ejecuta la consulta SQL con los valores extraídos
    connection.query(query, [nombre, descripcion, imagen], (err) => {
        // Si hay un error, lanza una excepción
        if (err) throw err;
        // Si la inserción es exitosa, redirige al usuario a la página principal
        res.redirect('/');
    });
});

// Ruta para obtener las imágenes
app.get('/imagenes', (req, res) => {
    const query = 'SELECT nombre, descripcion, imagen FROM imagenes';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos de la base de datos: ' + err.stack);
            res.status(500).send('Error al obtener los datos de la base de datos.');
            return;
        }
        res.json(results);
    });
});

//---------------------------------------------------------------------------------------------------------------------//

// Ruta para servir el formulario HTML
app.use(express.static(path.join(__dirname, 'pagina_principal')));

// Middleware para manejar los datos de formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el registro de usuario
app.post('/registrar_usuario', (req, res) => {
    const { correo, contraseña, rol } = req.body;

    const query = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES (?, ?, ?)';
    connection.query(query, [correo, contraseña, rol], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            res.send('Error al registrar el usuario');
        } else {
            console.log('Usuario registrado exitosamente:', result);
            res.send('Usuario registrado exitosamente');
            res.redirect('/');
        }
    });
});

// Ruta para manejar el inicio de sesión
app.post('/iniciar_sesion', (req, res) => { // Define una ruta POST para '/iniciar_sesion'
    const { correo, contraseña } = req.body; // Extrae 'correo' y 'contraseña' del cuerpo de la solicitud

    // Define la consulta SQL para obtener el rol del usuario que coincida con el correo y la contraseña
    const query = 'SELECT rol FROM usuarios WHERE correo = ? AND contraseña = ?';

    // Ejecuta la consulta SQL con los valores de 'correo' y 'contraseña'
    connection.query(query, [correo, contraseña], (err, results) => {
        if (err) { // Si hay un error en la consulta
            console.error('Error al iniciar sesión:', err); // Imprime el error en la consola
            res.send('Error al iniciar sesión'); // Envía una respuesta de error al cliente
        } else if (results.length > 0) { // Si la consulta devuelve al menos un resultado
            const rol = results[0].rol; // Obtiene el rol del usuario del primer resultado
            if (rol === 1) { // Si el rol es 1 (administrador)
                res.redirect('/administrador.html'); // Redirige a la página del administrador
            } else if (rol === 2) { // Si el rol es 2 (usuario normal)
                res.redirect('/usuario.html'); // Redirige a la página del usuario
            }
        } else { // Si no se encuentra ningún usuario con las credenciales proporcionadas
            res.send('Correo o clave incorrectos'); // Envía una respuesta indicando que las credenciales son incorrectas
        }
    });
});

//------------------------------------------------------------------------------------------------------------------------------//

// Ruta para servir el formulario HTML
app.use(express.static(path.join(__dirname, 'pagina')));

// Middleware para manejar los datos de formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el registro de usuario
app.post('/registrar_usuario', (req, res) => {
    const { correo, contraseña, rol } = req.body;

    const query = 'INSERT INTO usuarios (correo, contraseña, rol) VALUES (?, ?, ?)';
    connection.query(query, [correo, contraseña, rol], (err, result) => {
        if (err) {
            res.send('Error al registrar el usuario');
        } else {
            console.log('Usuario registrado exitosamente');
            res.redirect('/');
        }
    });
});

// Nueva ruta para mostrar todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.send('Error al obtener los usuarios');
        } else {
            res.json(results);
        }
    });
});

// Nueva ruta para obtener los detalles de un usuario
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles del usuario:', err);
            res.status(500).send('Error al obtener los detalles del usuario');
        } else {
            res.json(result[0]);
        }
    });
});

// Nueva ruta para eliminar un usuario
app.delete('/eliminar_usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.status(200).send('Usuario eliminado exitosamente');
        }
    });
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para obtener todos los elementos del menú
app.get('/menu', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener elementos del menú:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(result);
    });
});

// Ruta para obtener un elemento del menú por ID
app.get('/menu/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM menu WHERE id_menu = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener elemento del menú:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(result[0]);
    });
});

// Ruta para agregar un nuevo elemento al menú
app.post('/menu', (req, res) => {
    const { tipo_plato, nombre, precio_clp, descripcion } = req.body;
    const sql = 'INSERT INTO menu (tipo_plato, nombre, precio_clp, descripcion) VALUES (?, ?, ?, ?)';
    db.query(sql, [tipo_plato, nombre, precio_clp, descripcion], (err, result) => {
        if (err) {
            console.error('Error al agregar elemento al menú:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.send('Elemento del menú agregado con éxito');
    });
});

// Ruta para actualizar un elemento del menú
app.put('/menu/:id', (req, res) => {
    const { id } = req.params;
    const { tipo_plato, nombre, precio_clp, descripcion } = req.body;
    const sql = 'UPDATE menu SET tipo_plato = ?, nombre = ?, precio_clp = ?, descripcion = ? WHERE id_menu = ?';
    db.query(sql, [tipo_plato, nombre, precio_clp, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar elemento del menú:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.send('Elemento del menú actualizado con éxito');
    });
});

// Ruta para eliminar un elemento del menú
app.delete('/menu/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM menu WHERE id_menu = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar elemento del menú:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.send('Elemento del menú eliminado con éxito');
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});




