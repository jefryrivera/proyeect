document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECTORES DEL DOM
    const formulario = document.getElementById('formulario-registro');
    const inputNombre = document.getElementById('input-nombre');
    const inputCategoria = document.getElementById('input-categoria');
    const inputDescripcion = document.getElementById('input-descripcion');
    const contenedorCards = document.getElementById('contenedor-cards');
    const totalRegistrosSpan = document.getElementById('total-registros');
    const mensajeAlerta = document.getElementById('mensaje-alerta');
    const spinnerCarga = document.getElementById('spinner-carga');
    const btnSubmit = document.getElementById('btn-submit');
    
    // Modal de Bootstrap
    const modalElement = document.getElementById('modalConfirmarEliminar');
    const modalBootstrap = new bootstrap.Modal(modalElement);
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    let indiceAEliminar = null;

    // 2. ESTRUCTURA DE DATOS (Arreglo de Objetos)
    let registros = [
        {
            nombre: "E-Commerce Platform",
            categoria: "Fullstack",
            descripcion: "Tienda virtual con pasarela de pagos integrada."
        },
        {
            nombre: "Landing Page Corporativa",
            categoria: "Frontend",
            descripcion: "Sitio web responsivo con animaciones modernas en CSS."
        }
    ];

    // 3. RENDERIZADO DINÁMICO (Usando Cards de Bootstrap)
    function renderizarRegistros() {
        contenedorCards.innerHTML = '';
        
        if (registros.length === 0) {
            contenedorCards.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-secondary text-center py-4 mb-0" role="alert">
                        No hay elementos registrados en el sistema.
                    </div>
                </div>`;
            totalRegistrosSpan.textContent = 0;
            return;
        }

        registros.forEach((registro, index) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-4';

            colDiv.innerHTML = `
                <div class="card h-100 shadow-sm border border-light-subtle">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0 text-primary fw-bold">${registro.nombre}</h5>
                            <span class="badge bg-primary">${registro.categoria}</span>
                        </div>
                        <p class="card-text text-muted flex-grow-1">${registro.descripcion}</p>
                        <div class="pt-2 border-top mt-2 text-end">
                            <button class="btn btn-outline-danger btn-sm" onclick="solicitarEliminacion(${index})">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            contenedorCards.appendChild(colDiv);
        });

        totalRegistrosSpan.textContent = registros.length;
    }

    // 4. ELIMINACIÓN MEDIANTE MODAL DE BOOTSTRAP
    window.solicitarEliminacion = function(index) {
        indiceAEliminar = index;
        modalBootstrap.show();
    };

    btnConfirmarEliminar.addEventListener('click', () => {
        if (indiceAEliminar !== null) {
            registros.splice(indiceAEliminar, 1);
            renderizarRegistros();
            mostrarMensaje('Registro eliminado correctamente.', 'warning');
            indiceAEliminar = null;
            modalBootstrap.hide();
        }
    });

    // 5. FUNCIONES DE VALIDACIÓN MODULARES
    function validarNombre() {
        const valor = inputNombre.value.trim();
        if (valor.length >= 3) {
            marcarValido(inputNombre);
            return true;
        } else {
            marcarInvalido(inputNombre);
            return false;
        }
    }

    function validarCategoria() {
        const valor = inputCategoria.value;
        if (valor !== "") {
            marcarValido(inputCategoria);
            return true;
        } else {
            marcarInvalido(inputCategoria);
            return false;
        }
    }

    function validarDescripcion() {
        const valor = inputDescripcion.value.trim();
        if (valor.length >= 10) {
            marcarValido(inputDescripcion);
            return true;
        } else {
            marcarInvalido(inputDescripcion);
            return false;
        }
    }

    function marcarValido(elemento) {
        elemento.classList.remove('is-invalid');
        elemento.classList.add('is-valid');
    }

    function marcarInvalido(elemento) {
        elemento.classList.remove('is-valid');
        elemento.classList.add('is-invalid');
    }

    function limpiarEstilosCampos() {
        [inputNombre, inputCategoria, inputDescripcion].forEach(elem => {
            elem.classList.remove('is-valid', 'is-invalid');
        });
    }

    // 6. EVENTOS EN TIEMPO REAL
    inputNombre.addEventListener('input', validarNombre);
    inputNombre.addEventListener('blur', validarNombre);

    inputCategoria.addEventListener('change', validarCategoria);
    inputCategoria.addEventListener('blur', validarCategoria);

    inputDescripcion.addEventListener('input', validarDescripcion);
    inputDescripcion.addEventListener('blur', validarDescripcion);

    // 7. CONTROL DEL FORMULARIO CON SPINNER DE CARGA
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); 

        const esNombreValido = validarNombre();
        const esCategoriaValida = validarCategoria();
        const esDescripcionValida = validarDescripcion();

        if (esNombreValido && esCategoriaValida && esDescripcionValida) {
            // Mostrar Spinner y deshabilitar botón
            spinnerCarga.classList.remove('d-none');
            btnSubmit.disabled = true;

            // Simulación de proceso asíncrono/carga
            setTimeout(() => {
                const nuevoRegistro = {
                    nombre: inputNombre.value.trim(),
                    categoria: inputCategoria.value,
                    descripcion: inputDescripcion.value.trim()
                };

                registros.push(nuevoRegistro);
                renderizarRegistros();

                mostrarMensaje('¡Registro guardado con éxito!', 'success');
                formulario.reset();
                limpiarEstilosCampos();

                // Ocultar Spinner
                spinnerCarga.classList.add('d-none');
                btnSubmit.disabled = false;
            }, 800);

        } else {
            mostrarMensaje('Por favor, corrija los campos marcados en rojo antes de registrar.', 'danger');
        }
    });

    // 8. ALERTAS BOOTSTRAP DINÁMICAS
    function mostrarMensaje(texto, tipo) {
        mensajeAlerta.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                ${texto}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => { mensajeAlerta.innerHTML = ''; }, 4000);
    }

    // 9. CARGA INICIAL
    renderizarRegistros();
});
