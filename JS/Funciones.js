        // Cuando la página se carga, obtener los datos del menú
        window.onload = function() {
            obtenerMenu();
        };

        // Función para obtener todos los elementos del menú
        function obtenerMenu() {
            fetch('http://localhost:3000/menu')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then(data => {
                mostrarMenu(data);
            })
            .catch(error => {
                console.error('Error al obtener el menú:', error);
            });
        }

        // Función para mostrar los elementos del menú en la página
        function mostrarMenu(menu) {
            const menuList = document.getElementById('menu-list');
            menuList.innerHTML = ''; // Limpiar el contenido anterior

            menu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <p><strong>ID:</strong> ${item.id_menu}</p>
                    <p><strong>Tipo de Plato:</strong> ${item.tipo_plato}</p>
                    <p><strong>Nombre:</strong> ${item.nombre}</p>
                    <p><strong>Precio:</strong> ${item.precio_clp}</p>
                    <p><strong>Descripción:</strong> ${item.descripcion}</p>
                    <button onclick="editarMenu(${item.id_menu})">Editar</button>
                    <button onclick="eliminarMenu(${item.id_menu})" class="btn-danger">Eliminar</button>
                    <hr>
                `;
                menuList.appendChild(menuItem);
            });
        }

        // Función para agregar un nuevo elemento al menú
        document.getElementById('add-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            fetch('http://localhost:3000/menu', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
                obtenerMenu(); // Actualizar la lista después de agregar un nuevo elemento
                this.reset(); // Limpiar los campos del formulario
            })
            .catch(error => {
                console.error('Error al agregar el elemento:', error);
            });
        });

        // Función para eliminar un elemento del menú
        function eliminarMenu(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este elemento del menú?')) {
                fetch(`http://localhost:3000/menu/${id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la red');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                    obtenerMenu(); // Actualizar la lista después de eliminar un elemento
                })
                .catch(error => {
                    console.error('Error al eliminar el elemento:', error);
                });
            }
        }

        // Función para editar un elemento del menú
        function editarMenu(id) {
            // Obtener los datos del elemento seleccionado mediante una solicitud fetch
            fetch(`http://localhost:3000/menu/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then(data => {
                // Mostrar los datos del elemento en un formulario de edición
                document.getElementById('tipo_plato').value = data.tipo_plato;
                document.getElementById('nombre').value = data.nombre;
                document.getElementById('precio_clp').value = data.precio_clp;
                document.getElementById('descripcion').value = data.descripcion;

                // Cambiar el texto del botón de "Agregar" a "Guardar" en el formulario
                const addButton = document.querySelector('#add-form button[type="submit"]');
                addButton.textContent = 'Guardar';

                // Agregar un manejador de eventos al formulario para manejar la actualización del elemento
                document.getElementById('add-form').onsubmit = function(event) {
                    event.preventDefault();

                    // Obtener los datos del formulario de edición
                    const formData = new FormData(this);
                    
                    // Enviar los datos actualizados al servidor para guardar la edición
                    fetch(`http://localhost:3000/menu/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(Object.fromEntries(formData)),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta de la red');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log(data);
                        obtenerMenu(); // Actualizar la lista después de editar un elemento
                        this.reset(); // Limpiar los campos del formulario
                        
                        // Restaurar el texto del botón de "Guardar" a "Agregar" en el formulario
                        addButton.textContent = 'Agregar';
                        this.onsubmit = null; // Remover el manejador de eventos de edición
                    })
                    .catch(error => {
                        console.error('Error al actualizar el elemento:', error);
                    });
                };
            })
            .catch(error => {
                console.error('Error al obtener los datos del elemento:', error);
            });
        }