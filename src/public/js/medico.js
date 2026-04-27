
let citasGlobal = [];

function updateTimers() {
    citasGlobal.forEach(patient => {
        if (!patient.segundosTranscurridos) return;
        patient.segundosTranscurridos ++

        const el = document.getElementById(`timer-${patient.idCita}`);
        if (!el) return;

        el.textContent = getElapsedTime(patient.segundosTranscurridos);
    });
}

// --- CONSTANTS & MOCK DATA ---
const TRIAGE_DATA = {
    "1": { color: 'red', hex: '#ef4444', name: 'Resucitación' },
    "2": { color: 'orange', hex: '#f97316', name: 'Emergencia' },
    "3": { color: 'yellow', hex: '#eab308', name: 'Urgencia' },
    "4": { color: 'green', hex: '#22c55e', name: 'Urgencia Menor' },
    "5": { color: 'blue', hex: '#3b82f6', name: 'Sin urgencia' }
};


async function renderDoctorAtentionCards(){
     const container = document.getElementById('doctor-patients-atention-grid');
    if(!container) return;
    container.innerHTML = '';

    const response = await fetch('/api/citas/atention')
    const data = await response.json() 
    const allTurns = data.map(element=>{
        return {
            idCita: element.id,
            name:element.paciente,
            age: element.edad,
            sex: element.sexo,
            turnNumber: element.turno,
            triage: TRIAGE_DATA[element.triage]
        }
    })

    allTurns.forEach( patient => {
        const bgTint = `${patient.triage.hex}15`; // 15 es la transparencia en hex
        
        const html = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center relative overflow-hidden hover:shadow-md transition-all duration-300" style="border-left: 6px solid ${patient.triage.hex}">
                
                <!-- Info Principal -->
                <div class="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:border-r border-slate-100">
                    
                    <!-- Nombre y Turno -->
                    <div class="w-full sm:w-1/3">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-xl font-bold text-gray-800 truncate">${patient.name}</h3>
                        </div>
                        <div class="flex items-center gap-4">
                            <p class="text-sm text-gray-500">Turno: <span class="font-black text-gray-800">${patient.turnNumber}</span></p>
                            <div class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style="background-color: ${bgTint}; color: ${patient.triage.hex}">
                                <div class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${patient.triage.hex}"></div>
                                ${patient.triage.name}
                            </div>
                        </div>
                    </div>

                    <!-- Datos Físicos -->
                    <div class="w-full sm:w-1/5">
                        <span class="font-semibold text-slate-700 text-sm">${patient.age} años • ${patient.sex}</span>
                    </div>
                     <div class="w-full sm:w-auto flex-1">
                        <div class="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg px-6 py-4 border border-slate-100 w-fit">
                             <button data-id-cita=${patient.idCita} onclick="regresarAFila(this,'${patient.turnNumber}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${patient.triage.hex}">
                                <i data-lucide="undo-2" class="w-5 h-5"></i>
                                Regresa a la fila
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Acciones -->
                <div class="p-6 w-full lg:w-48 bg-slate-50/50 flex justify-center shrink-0">
                    <button data-id-cita=${patient.idCita} onclick="finalizarAtencion(this,'${patient.turnNumber}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${patient.triage.hex}">
                        <i data-lucide="stethoscope" class="w-5 h-5"></i>
                        Finalizar
                    </button>
                </div>
                
            </div>
        `;
        container.innerHTML += html;
    });
    lucide.createIcons();
}

// --- DOCTOR CARDS LOGIC ---
async function renderDoctorCards() {
    const container = document.getElementById('doctor-patients-grid');
    if(!container) return;
    container.innerHTML = '';

    const response = await fetch('/api/citas')
    const data = await response.json() 
    const allTurns = data.map(element=>{
        return {
            idCita: element.id,
            name:element.paciente,
            age: element.edad,
            sex: element.sexo,
            turnNumber: element.turno,
            triage: TRIAGE_DATA[element.triage],
            seguimiento: element.seguimiento,
            segundosTranscurridos: element.segundosTranscurridos
        }
    })

    citasGlobal = allTurns;

    allTurns.forEach(patient => {
        const bgTint = `${patient.triage.hex}15`; // 15 es la transparencia en hex
        const tiempo = getElapsedTime(patient.segundosTranscurridos);
        const html = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center relative overflow-hidden hover:shadow-md transition-all duration-300" style="border-left: 6px solid ${patient.triage.hex}">
                
                <!-- Info Principal -->
                <div class="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:border-r border-slate-100">
                    
                    <!-- Nombre y Turno -->
                    <div class="w-full sm:w-1/3">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-xl font-bold text-gray-800 truncate">${patient.name}</h3>
                        </div>
                        <div class="flex items-center gap-4">
                            <p class="text-sm text-gray-500">Turno: <span class="font-black text-gray-800">${patient.turnNumber}</span></p>
                            <div class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style="background-color: ${bgTint}; color: ${patient.triage.hex}">
                                <div class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${patient.triage.hex}"></div>
                                ${patient.triage.name}
                            </div>
                        </div>
                        <p class="text-sm p-2.5 text-gray-500">Seguimiento: <span class="font-black text-gray-800">${patient.seguimiento}</span></p>
                    </div>

                    <!-- Datos Físicos -->
                    <div class="w-full sm:w-1/5">
                        <span class="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Edad y Sexo</span>
                        <span class="font-semibold text-slate-700 text-sm">${patient.age} años • ${patient.sex}</span>
                    </div>
                    <div class="w-full sm:w-auto flex-1">
                        <span class="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Tiempo en Espera</span>
                        <div class="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 w-fit">
                            <i data-lucide="timer" class="w-4 h-4 text-slate-400"></i>
                            <span id="timer-${patient.idCita}" class="font-mono text-4xl font-bold">${tiempo}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Acciones -->
                <div class="p-6 w-full lg:w-48 bg-slate-50/50 flex justify-center shrink-0">
                    <button data-id-cita=${patient.idCita} onclick="atenderPaciente(this,'${patient.turnNumber}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${patient.triage.hex}">
                        <i data-lucide="stethoscope" class="w-5 h-5"></i>
                        Atender
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
    lucide.createIcons();
}

function atenderPaciente(btnPresionado) {
    const idCita = btnPresionado.dataset.idCita
    fetch('/api/medico/asignar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            idCita: idCita
        })
    }).then(response => response.json()).then(data=>{
        if(data.codigo === 103) {
            renderDoctorCards();
            renderDoctorAtentionCards();
            mensajeParaUsuario(data.mensaje, "success")
        } else {
            mensajeParaUsuario(data.mensaje, "error")
        }
    }).catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function regresarAFila(btnPresionado) {
    const idCita = btnPresionado.dataset.idCita
    fetch('/api/turno/regresar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            idCita: idCita
        })
    }).then(response => response.json()).then(data=>{
        if(data.success) {
            renderDoctorCards();
            renderDoctorAtentionCards();
            mensajeParaUsuario(data.mensaje, "success")
        } else {
            mensajeParaUsuario(data.mensaje, "error")
        }
    }).catch(error => {
        console.error('Error en la solicitud:', error);
    });
}


function finalizarAtencion(btnPresionado){
    const idCita = btnPresionado.dataset.idCita
    fetch('/api/medico/finalizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            idCita: idCita
        })
    }).then(response => response.json()).then(data => {
        if(data.success) {
            mensajeParaUsuario("Atención finalizada con éxito", "success")
            renderDoctorCards();
            renderDoctorAtentionCards();
        } else {
            mensajeParaUsuario('Error al finalizar la atención', "error")
        }
        })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

}

// --- GENERAL UPDATE LOGIC ---
function updateDisplays() {
    document.querySelectorAll('.display-name').forEach(el => el.textContent = state.name);
    document.querySelectorAll('.display-turn').forEach(el => el.textContent = state.turn);
    document.querySelectorAll('.display-age').forEach(el => el.textContent = state.age);
    document.querySelectorAll('.display-sex').forEach(el => el.textContent = state.sex);
    document.querySelectorAll('.display-triage-name').forEach(el => el.textContent = state.triage.name);

    document.querySelectorAll('.display-bp').forEach(el => el.textContent = state.vitals.bp);
    document.querySelectorAll('.display-hr').forEach(el => el.textContent = state.vitals.hr);
    document.querySelectorAll('.display-temp').forEach(el => el.textContent = state.vitals.temp);
    document.querySelectorAll('.display-o2').forEach(el => el.textContent = state.vitals.o2);
    /*
    // Triage colors in specific elements
    document.getElementById('status-header-color').style.backgroundColor = state.triage.hex;
    const docBadge = document.getElementById('doctor-triage-badge');
    if(docBadge) {
        docBadge.style.borderColor = state.triage.hex;
        docBadge.querySelector('div').style.backgroundColor = state.triage.hex;
    }*/
    renderDoctorCards();
    renderDoctorAtentionCards();
    
    // Re-bind icons globally just in case
    lucide.createIcons();
}

function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({
        title: mensaje,
        icon: tipoIcon,
        showConfirmButton: false,
        timer: tipoIcon === 'success' ? 2500 : 4500
    });
}

function getElapsedTime(diffSeconds) {
    const h = Math.floor(diffSeconds / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    const s = diffSeconds % 60;

    return `${String(h).padStart(2,'0')}h:${String(m).padStart(2,'0')}m:${String(s).padStart(2,'0')}s`;
}

socket.on("turno_pagado", () => {
location.reload();
});

socket.on("turno_asignado",() =>{
    //location.reload();
})


updateDisplays();

setInterval(updateTimers, 1000);