document.getElementById("registrarTurno").addEventListener("submit", function(e) {
    e.preventDefault(); // evita envío si es inválido
    if (!this.checkValidity()) {
        this.reportValidity(); // muestra mensajes
        return;
    }
    saveAndGoToQueue();
    registrarTurno.reset(); // Limpia el formulario despues de enviar toda la información
});

// State
const state = {
    triage: { color: 'yellow', name: 'Urgente', hex: '#eab308' },
    vitals: { bp: '120/80', hr: '85', temp: '37.5', o2: '98' }
};

// --- CONSTANTS & MOCK DATA ---
const TRIAGE_DATA = {
    "1": { color: 'red', hex: '#ef4444', name: 'Resucitación' },
    "2": { color: 'orange', hex: '#f97316', name: 'Emergencia' },
    "3": { color: 'yellow', hex: '#eab308', name: 'Urgencia' },
    "4": { color: 'green', hex: '#22c55e', name: 'Urgencia Menor' },
    "5": { color: 'blue', class: 'bg-noUrgente', name: 'Sin urgencia' }
};

function getInputValue(id) {
    const input = /** @type {HTMLInputElement|null} */ (document.getElementById(id));
    return input ? input.value : '';
}

function getActiveTriageColor() {
    const activeButton = document.querySelector('.triage-btn.active');
    return activeButton ? activeButton.dataset.color : '';
}

function saveAndGoToQueue(){
    fetch('/citas',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: getInputValue('input-name'),
            apellidoPaterno: getInputValue('input-firstName'),
            apellidoMaterno: getInputValue('input-lastName'),
            triage: getActiveTriageColor(),
            edad: getInputValue('input-age'),
            sexo: getInputValue('input-sex'),
            seguimiento: getInputValue('input-seguimiento'),
            noCuenta: getInputValue('input-noCuenta')
        })
    }).then(res => res.json())
        .then(data => {
            if(data){
                if(data.success){
                    mensajeParaUsuario(data.message,'success')
                    /*setTimeout(() => {
                        location.href = ''
                    }, 3000);*/
                }else{
                    mensajeParaUsuario('Ocurrio un error al crear el turno', 'error')
                }
                const dialog = document.querySelector('dialog');
                if (dialog) dialog.close();
                // Aquí podrías agregar lógica para actualizar la lista de turnos sin recargar la página
            } else {
                alert('Error al registrar paciente');
            }
        })
}


// Triage Selection
function selectTriage(colorKey, name) {
    state.triage = TRIAGE_DATA[colorKey];
    
    // Visual Update Buttons
    document.querySelectorAll('.triage-btn').forEach(btn => {
        const isActive = btn.dataset.color === colorKey;
        if(isActive) {
            btn.classList.add('active', 'border-slate-800', 'bg-white', 'scale-105', 'shadow-md');
            btn.classList.remove('border-transparent', 'bg-slate-50', 'opacity-70');
            if(!btn.querySelector('.fa-check-circle')) {
                btn.innerHTML += `<div class="absolute top-2 right-2 text-slate-800"><i data-lucide="check-circle" class="w-4 h-4"></i></div>`;
                lucide.createIcons();
            }
        } else {
            btn.classList.remove('active', 'border-slate-800', 'bg-white', 'scale-105', 'shadow-md');
            btn.classList.add('border-transparent', 'bg-slate-50', 'opacity-70');
            const check = btn.querySelector('.absolute');
            if(check) check.remove();
        }
    });
}

function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({
        title: mensaje,
        icon: tipoIcon,
        showConfirmButton: false,
        timer: tipoIcon === 'success' ? 2500 : 4500
    });
}

lucide.createIcons();


socket.on("turno_creado", (turno) => {
    let tarjetaAgregar = crearTarjetaTurno(turno.cita);
    const turnosContainer = document.getElementById("tarjetasTurnosActivos");
    if (turnosContainer && tarjetaAgregar) {
        turnosContainer.appendChild(tarjetaAgregar);
    }
});

/**
 * 
 * @param {number} idCita
 * @returns 
 */
function crearTarjetaTurno({
    idCita, 
    paciente,
    triage,
    estatus,
    turno,
    edad,
    color,
    noCuenta
}) {

    const card = document.createElement("div");
    card.setAttribute("data-idCita", idCita)

    card.className =
        "max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200";

    card.innerHTML = `
        <div class="${color} p-4">
            <h2 class="text-white text-xl font-bold flex items-center gap-2">
                <span>📅</span>
                Turno de Consulta T-${turno}
            </h2>
        </div>

        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <p class="text-sm text-slate-500 uppercase font-semibold tracking-wider">
                        Paciente
                    </p>
                    <p class="text-lg font-bold text-slate-800">
                        ${paciente}
                    </p>
                </div>

                <span class="text-amber-50 bg-generado text-xs px-2 py-1 rounded-full font-bold">
                    ${estatus}
                </span>
            </div>

            <div>
                <p class="text-sm text-slate-500 uppercase font-semibold tracking-wider">
                    Semáforo de Manchester
                </p>

                <div class="flex items-center gap-2 mt-1">
                    <span class="w-4 h-4 ${color} rounded-full"></span>
                    <span class="text-sm text-slate-700">
                        ${triage}
                    </span>
                </div>
            </div>
        </div>
    `;

    return card;
}