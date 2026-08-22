// --- ACCIONES CON LA API ---
function setStatus(btnElement, status, idCita) {
    const buttonGroup = btnElement.parentElement;
    buttonGroup.querySelectorAll('.status-btn').forEach(btn => {
        btn.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 transition-all';
        const icon = btn.querySelector('svg');
        if(icon) icon.remove();
    });

    // Cambiar a estado activo visualmente
    btnElement.className = 'status-btn w-full flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 shadow-inner transition-all';
    btnElement.innerHTML += `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
    lucide.createIcons();

    fetch(`/caja/update-cita-estatus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idCita: idCita,
            turno: btnElement.dataset.turno,
            estatus: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            mensajeParaUsuario(data.message, 'success');
            
            // ELIMINACIÓN INMEDIATA LOCAL:
            // Borramos la tarjeta para la persona que acaba de cobrar sin esperar a nadie más
            eliminarTurno(idCita);
            colaTurnos = colaTurnos.filter(t => (t.idCita || t.id) != idCita);
        } else {
            mensajeParaUsuario(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error al actualizar estatus:', error);
    });
}

// === WEBSOCKETS (Sincronización para las demás pantallas) ===

socket.on("turno_creado", (payload) => {
    if(payload && payload.cita) {
        colaTurnos.push(payload.cita);
        ordenarCitas();
        actualizarVistaCitas();
    } else {
        location.reload(); // Respaldo por si falla la estructura
    }
});

// Cuando cualquier Caja marca un turno como Pagado
socket.on("turno_pagado", (payload) => {
    console.log("🟢 ¡Aviso de caja recibido! Actualizando médicos...")
    // Atrapamos el ID directo que acabamos de poner en el backend
    const idCita = payload.idCita;

    if (idCita) {
        eliminarTurno(idCita);
        colaTurnos = colaTurnos.filter(t => (t.idCita || t.id) != idCita);
    } else {
        // Plan B: Seguro de vida por si algo se pierde en la red
        location.reload();
    }
});


// --- FUNCIONES DE APOYO Y DOM ---
function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({
        title: mensaje,
        icon: tipoIcon,
        showConfirmButton: false,
        timer: tipoIcon === 'success' ? 2500 : 4500
    });
}

function eliminarTurno(idCita){
    // Buscamos el elemento (considerando que el navegador puede convertir data-attributes a minúsculas)
    const elemento = document.querySelector(`[data-idTurno="${idCita}"]`) || document.querySelector(`[data-idturno="${idCita}"]`);
    
    if(elemento){
        // Le agregamos una transición suave para que se desvanezca en lugar de parpadear
        elemento.style.transition = "all 0.4s ease";
        elemento.style.opacity = "0";
        elemento.style.transform = "scale(0.9)";
        
        setTimeout(() => {
            elemento.remove();
        }, 400);
    }
}

function ordenarCitas(){
    colaTurnos.sort((a, b) => {
        if (Number(a.triage) !== Number(b.triage)) {
            return Number(a.triage) - Number(b.triage);
        }
        return (a.idCita || a.id) - (b.idCita || b.id);
    });
}

function actualizarVistaCitas(){
    const elementoContenedor = document.getElementById('contenedorTurnos');
    if(elementoContenedor){
        elementoContenedor.innerHTML = '';
        colaTurnos.forEach( turno => {
            const nuevaTarjeta = crearNuevaTarjetaCita(turno);
            elementoContenedor.innerHTML += nuevaTarjeta;
        });
        lucide.createIcons();
    }
}

function crearNuevaTarjetaCita(turno){
    const id = turno.idCita || turno.id;
    return `<div data-idTurno="${id}" class="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div id="status-header-color" class="h-3 ${turno.color || 'bg-blue-500'}"></div>
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
                        <button onclick="setStatus(this, 'Pendiente', ${id})" class="status-btn w-full flex items-center justify-between p-4 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 shadow-inner transition-all">
                            <span class="font-medium">Pendiente</span>
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                        </button>
                        <button onclick="setStatus(this, 'Proyectada', ${id})" class="status-btn w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 transition-all">
                            <span class="font-medium">Pagada</span>
                        </button>
                    </div>
                </div>
                
                <div class="text-center text-xs text-slate-400">
                    Última actualización: Hace un momento
                </div>
            </div>
        </div>`;
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    ordenarCitas();
    actualizarVistaCitas();
});