/* ==========================================================================
   RECURSO PARA ESTUDIANTES - EVALUACIÓN JAVASCRIPT
   Dashboard de Torneos Gamer
   ========================================================================== */

// Actividad 3. Declarar el arreglo (10 puntos)
// Declarar un arreglo global vacío llamado torneos.
// Cada elemento deberá ser un objeto con las propiedades:
// nombre, categoria, participantes, valorInscripcion, email y recaudacion.
let torneos = [];

/**
 * Actividad 4. Registrar y validar un torneo (30 puntos)
 * 12. Crear la función registrarTorneo() sin parámetros.
 */
function registrarTorneo() {

// 13. Obtener los valores de todos los campos con document.getElementById()
    let nombre = document.getElementById("nombre").value;
    let categoria = document.getElementById("categoria").value;
    let participantes = parseInt(document.getElementById("participantes").value);
    let valorInscripcion = parseFloat(document.getElementById("valorInscripcion").value);
    let email = document.getElementById("email").value;

    document.getElementById("errNombre").textContent = "";
    document.getElementById("errCategoria").textContent = "";
    document.getElementById("errParticipantes").textContent = "";
    document.getElementById("errValor").textContent = "";
    document.getElementById("errEmail").textContent = "";

// 14. Validar que el nombre tenga al menos 4 caracteres
    let hayError = false;
    if (nombre.length < 4) {
        document.getElementById("errNombre").textContent = "Mínimo 4 caracteres";
        hayError = true;
    }

// 15. Validar que se haya seleccionado una categoría
    if (categoria == "") {
        document.getElementById("errCategoria").textContent = "Seleccione una categoría";
        hayError = true;
    }

    // 16. Validar que los participantes sean un entero entre 1 y 100
    if (!Number.isInteger(participantes) || participantes < 1 || participantes > 100) {
        document.getElementById("errParticipantes").textContent = "Debe estar entre 1 y 100";
        hayError = true;
    }

// 17. Validar que el valor de inscripción sea mayor que 0
    if (valorInscripcion <= 0 || isNaN(valorInscripcion)) {
        document.getElementById("errValor").textContent = "Valor inválido";
        hayError = true;
    }

// 18. Validar que el email no esté vacío. No se requiere validación avanzada de formato.
    if (email == "") {
        document.getElementById("errEmail").textContent = "Ingrese un email";
        hayError = true;
    }

    if (hayError) {
        return;
    }
// Si alguna validación falla, mostrar mensajes de error y detener la ejecución


 // 19. Calcular la recaudación estimada con: participantes × valor de inscripción
    let recaudacion = participantes * valorInscripcion;
// 20. Crear el objeto nuevoTorneo con los datos obtenidos
    let nuevoTorneo = {
        nombre: nombre,
        categoria: categoria,
        participantes: participantes,
        valorInscripcion: valorInscripcion,
        email: email,
        recaudacion: recaudacion
    };
// 21. Agregar el objeto al arreglo con push()
    torneos.push(nuevoTorneo);
// 22. Llamar a mostrarTorneos() y limpiarFormulario()
    mostrarTorneos();
    limpiarFormulario();
// 23. Mostrar un mensaje de registro exitoso
    alert("Torneo registrado");
}

/**
 * Actividad 5. Mostrar los torneos (15 puntos)
 * 24. Crear la función mostrarTorneos() sin parámetros.
 */

function mostrarTorneos() {
// 25. Crear una variable vacía para concatenar el HTML
    let html = "";

// 26. Recorrer el arreglo torneos utilizando obligatoriamente un ciclo for
    for (let i = 0; i < torneos.length; i++) {

// 27. En cada vuelta, obtener el objeto actual y construir una fila de la tabla (<tr>...</tr>)
        let torneo = torneos[i];


// 28. Mostrar todos los datos y la recaudación calculada
        html += `
       <tr>
            <td>${torneo.nombre}</td>
            <td>${torneo.categoria}</td>
            <td>${torneo.participantes}</td>
            <td>$${torneo.valorInscripcion}</td>
            <td>${torneo.email}</td>
            <td>$${torneo.recaudacion}</td>
            <td><button>Editar</button><button onclick="eliminarTorneo(-1)">Eliminar</button></td>
        </tr>
        `;
    }
// 28. Mostrar todos los datos y la recaudación calculada
// 29. Insertar el HTML final en el cuerpo de la tabla sin duplicar filas (usando innerHTML)
    document.getElementById("tablaTorneos").innerHTML = html;
}

/**
 * Actividad 6. Limpiar el formulario (5 puntos)
 * 30. Crear la función limpiarFormulario().
 */
function limpiarFormulario() {

// 31. Vaciar los campos del formulario, restablecer la categoría y limpiar los mensajes de error
    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("participantes").value = "";
    document.getElementById("valorInscripcion").value = "";
    document.getElementById("email").value = "";

    document.getElementById("errNombre").textContent = "";
    document.getElementById("errCategoria").textContent = "";
    document.getElementById("errParticipantes").textContent = "";
    document.getElementById("errValor").textContent = "";
    document.getElementById("errEmail").textContent = "";
  

}

function limpiar(){
    limpiarFormulario();
    torneos = [];
    mostrarTorneos();

}

function eliminarTorneo (indice){
    const respuesta = confirm("¿Deseas eliminar este elemento?");
    if (respuesta) {
    torneos.splice(indice,1)
    mostrarTorneos()
    console.log("Acción confirmada");
    }
    else {
    mostrarTorneos()
    console.log("Acción cancelada");
    }
}













