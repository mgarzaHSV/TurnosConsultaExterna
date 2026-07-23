// Status Selection
function setStatus(btnElement, status,idCita) {
    const buttonGroup = btnElement.parentElement;
    buttonGroup.querySelectorAll('.status-btn').forEach(btn => {
        btn.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 transition-all';
        const icon = btn.querySelector('svg');
        if(icon) icon.remove();
    });

    // Set active
    btnElement.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 shadow-inner transition-all';
    btnElement.innerHTML += `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
    lucide.createIcons();



    fetch(`/caja/update-cita-estatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idCita,
            turno: btnElement.dataset.turno,
            estatus: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            mensajeParaUsuario(data.message, 'success')

        }else{
            mensajeParaUsuario(data.message, 'error')
        }
    })
    .catch(error => {
        console.error('Error al actualizar estatus:', error);
    });
}

socket.on("turno_creado", (turno) => {
    colaTurnos.push(turno.cita)
    ordenarCitas()
    actualizarVistaCitas()
});


socket.on("turno_pagado", (turno) => {
    eliminarTurno(turno.idTurno)
    /*
    setTimeout(() => {
        location.href = ''
    }, 3000);*/
});

/**
 * 
 * @param {string} mensaje Texto el cual va a hacer mostrador en el modal 
 * @param {string} tipoIcon Icono que se mostrara en el modal, 'success' o 'error'
 */

function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({
        title: mensaje,
        icon: tipoIcon,
        showConfirmButton: false,
        timer: tipoIcon === 'success' ? 2500 : 4500
    });
}

/** 
 * Seleccion del elemento del DOM que contiene la cita y se procede a eliminar de la vista del usuario
 * 
 * @param {number} idCita Identificador de la cita a la cual se va a eliminar de la vista
 */
function eliminarTurno(idCita){
    const elemento = document.querySelector(`[data-idTurno="${idCita}"]`)
    if(elemento){
        elemento.remove()
    }
}


function ordenarCitas(){
    colaTurnos.sort((a, b) => {
        if (Number(a.triage) !== Number(b.triage)) {
            return Number(a.triage) - Number(b.triage);
        }

        // Si tienen el mismo triage
        return a.idCita - b.idCita;
    });
}

function actualizarVistaCitas(){
    const elementoContenedor = document.getElementById('contenedorTurnos')
    if(elementoContenedor){
        elementoContenedor.innerHTML = ''
        colaTurnos.forEach( turno =>{
            const nuevaTarjeta = crearNuevaTarjetaCita(turno)
            elementoContenedor.innerHTML += nuevaTarjeta
        })
    }
}

/**
 *  Generar una nueva tarjeta de cita en la vista del usuario
 *
 * @param {object} turno Objeto que contiene la información de la cita a mostrar
 */
function crearNuevaTarjetaCita(turno){
    return `<div data-idTurno="${turno.idCita}" class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div id="status-header-color" class="h-3 ${turno.color}"></div>
            <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 display-name">${turno.paciente}</h2>
                        <p class="text-slate-500">TURNO: ${turno.turno} • EDAD: <span class="display-age">${turno.edad}</span> años</p>
                        <p class="text-slate-500"># Cuenta Externo: ${turno.noCuenta}</p>
                    </div>
                    <span id="status-triage-badge" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                        ${turno.estatus}
                    </span>
                </div>

                <div class="mb-8">
                    <h3 class="text-xs font-bold text-slate-400 uppercase mb-3">Cambiar Estatus</h3>
                    <div class="space-y-2">
                        <button onclick="setStatus(this, 'Pendiente',${turno.idCita})" class="status-btn w-full flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 shadow-inner transition-all">
                            <span class="font-medium">Pendiente</span>
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                        </button>
                        <button onclick="setStatus(this, 'Proyectada',${turno.idCita})" class="status-btn w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 transition-all">
                            <span class="font-medium">Pagada</span>
                        </button>
                    </div>
                </div>
                
                <div class="text-center text-xs text-slate-400">
                    Última actualización: Hace un momento
                </div>
            </div>
        </div>`
}

ordenarCitas()
actualizarVistaCitas()
