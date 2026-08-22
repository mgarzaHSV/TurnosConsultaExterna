let citasGlobal = [];
let DOM = {};

const TRIAGE_DATA = {
    "1": { color: 'red', hex: '#ef4444', name: 'Resucitación' },
    "2": { color: 'orange', hex: '#f97316', name: 'Emergencia' },
    "3": { color: 'yellow', hex: '#eab308', name: 'Urgencia' },
    "4": { color: 'green', hex: '#22c55e', name: 'Urgencia Menor' },
    "5": { color: 'blue', hex: '#3b82f6', name: 'Sin urgencia' }
};

// --- MÉTODOS DE RENDERIZADO (Optimizados con Batching) ---
async function renderDoctorAtentionCards() {
    if(!DOM.atentionGrid) return;
    const response = await fetch('/api/citas/atention', { cache: 'no-store' });
    const data = await response.json(); 
    DOM.atentionGrid.innerHTML = '';
    
    let htmlContent = '';
    data.forEach(element => {
        const triage = TRIAGE_DATA[element.triage] || TRIAGE_DATA["5"];
        const bgTint = `${triage.hex}15`; 
        htmlContent += `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center relative overflow-hidden hover:shadow-md transition-all duration-300" style="border-left: 6px solid ${triage.hex}">
                <div class="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:border-r border-slate-100">
                    <div class="w-full sm:w-1/3">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-xl font-bold text-gray-800 truncate">${element.paciente}</h3>
                        </div>
                        <div class="flex items-center gap-4">
                            <p class="text-sm text-gray-500">Turno: <span class="font-black text-gray-800">${element.turno}</span></p>
                            <div class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style="background-color: ${bgTint}; color: ${triage.hex}">
                                <div class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: ${triage.hex}"></div>
                                ${triage.name}
                            </div>
                        </div>
                        <p class="text-sm p-2.5 text-gray-500">Seguimiento: <span class="font-black text-gray-800">${element.seguimiento}</span></p>
                    </div>
                    <div class="w-full sm:w-1/5">
                        <span class="font-semibold text-slate-700 text-sm">${element.edad} años • ${element.sexo}</span>
                    </div>
                     <div class="w-full sm:w-auto flex-1">
                        <div class="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg px-6 py-4 border border-slate-100 w-fit">
                             <button data-id-cita="${element.id}" onclick="regresarAFila(this,'${element.turno}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${triage.hex}">
                                <i data-lucide="undo-2" class="w-5 h-5"></i>
                                Regresa a la fila
                            </button>
                        </div>
                    </div>
                </div>
                <div class="p-6 w-full lg:w-48 bg-slate-50/50 flex justify-center shrink-0">
                    <button data-id-cita="${element.id}" onclick="finalizarAtencion(this,'${element.turno}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${triage.hex}">
                        <i data-lucide="stethoscope" class="w-5 h-5"></i>
                        Finalizar
                    </button>
                </div>
            </div>`;
    });
    DOM.atentionGrid.innerHTML = htmlContent;
    lucide.createIcons();
}

async function renderDoctorCards() {
    if(!DOM.patientsGrid) return;
    const response = await fetch('/api/citas', { cache: 'no-store' });
    const data = await response.json(); 
    DOM.patientsGrid.innerHTML = '';
    
    citasGlobal = data.map(element => ({
        idCita: element.id,
        name: element.paciente,
        age: element.edad,
        sex: element.sexo,
        turnNumber: element.turno,
        triage: TRIAGE_DATA[element.triage] || TRIAGE_DATA["5"],
        seguimiento: element.seguimiento,
        segundosTranscurridos: Number(element.segundosTranscurridos) || 0 
    }));

    let htmlContent = '';
    citasGlobal.forEach(patient => {
        const bgTint = `${patient.triage.hex}15`; 
        const tiempo = getElapsedTime(patient.segundosTranscurridos);
        htmlContent += `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center relative overflow-hidden hover:shadow-md transition-all duration-300" style="border-left: 6px solid ${patient.triage.hex}">
                <div class="p-6 flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:border-r border-slate-100">
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
                <div class="p-6 w-full lg:w-48 bg-slate-50/50 flex justify-center shrink-0">
                    <button data-id-cita="${patient.idCita}" onclick="atenderPaciente(this,'${patient.turnNumber}')" class="w-full py-1 px-2 text-white rounded-xl hover:cursor-pointer font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1 hover:opacity-90" style="background-color: ${patient.triage.hex}">
                        <i data-lucide="stethoscope" class="w-5 h-5"></i>
                        Atender
                    </button>
                </div>
            </div>`;
    });
    DOM.patientsGrid.innerHTML = htmlContent;
    lucide.createIcons();
}

// --- UTILIDADES Y TIMERS ---
function updateTimers() {
    citasGlobal.forEach(patient => {
        if (patient.segundosTranscurridos == null) return;
        patient.segundosTranscurridos += 1;
        const el = document.getElementById(`timer-${patient.idCita}`);
        if (el) el.textContent = getElapsedTime(patient.segundosTranscurridos);
    });
}

function getElapsedTime(diffSeconds) {
    const h = Math.floor(diffSeconds / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    const s = diffSeconds % 60;
    return `${String(h).padStart(2,'0')}h:${String(m).padStart(2,'0')}m:${String(s).padStart(2,'0')}s`;
}

function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({ title: mensaje, icon: tipoIcon, showConfirmButton: false, timer: tipoIcon === 'success' ? 2500 : 4500 });
}

// --- ACCIONES CON LA API ---
function ejecutarAccion(url, idCita, mensajeExito) {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idCita })
    }).then(res => res.json()).then(data => {
        if(data.success || data.codigo === 103) {
            mensajeParaUsuario(mensajeExito || data.mensaje, "success");
            updateDisplays();
        } else {
            mensajeParaUsuario(data.mensaje || 'Error', "error");
        }
    }).catch(err => console.error('Error:', err));
}

function atenderPaciente(btn) { ejecutarAccion('/api/medico/asignar', btn.dataset.idCita); }
function regresarAFila(btn) { ejecutarAccion('/api/turno/regresar', btn.dataset.idCita); }
function finalizarAtencion(btn) { ejecutarAccion('/api/medico/finalizar', btn.dataset.idCita, "Atención finalizada con éxito"); }

function updateDisplays() {
    console.log("🟢 ¡Aviso de caja recibido! Actualizando médicos...")
    renderDoctorCards();
    renderDoctorAtentionCards();
}

// --- ASIGNACIÓN DE MÉDICO INICIAL ---
const medicoEnAtencion = async () => {
    const res = await fetch('/api/medicos');
    const lista = await res.json();
    const medicos = lista.reduce((obj, m) => { obj[m.idMedico] = m.nombreMedico; return obj; }, {});

    return await Swal.fire({
        title: "¿Quién está atendiendo a los pacientes?",
        input: "select",
        inputOptions: medicos,
        inputPlaceholder: "Selecciona un médico",
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (v) => v && v.trim() !== "" ? Promise.resolve() : Promise.resolve("Es obligatorio seleccionar un médico")
    });
}

// === INICIALIZACIÓN SEGURA (DOM READY) ===
document.addEventListener('DOMContentLoaded', () => {
    DOM.patientsGrid = document.getElementById('doctor-patients-grid');
    DOM.atentionGrid = document.getElementById('doctor-patients-atention-grid');

    updateDisplays();
    setInterval(updateTimers, 1000);

    // Flujo del modal de médicos
    (async () => {
        if(localStorage.getItem("idMedico")) return;
        const { value: idMedico } = await medicoEnAtencion();
        if (idMedico) {
            fetch(`/api/medico`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idMedico })
            }).then(() => localStorage.setItem("idMedico", idMedico));
        }
    })();
});

// === WEBSOCKETS VINCULADOS A FUNCIONES SEGURAS ===
socket.on("turno_pagado", updateDisplays);
socket.on("turno_asignado", updateDisplays); // Si un paciente pasa de espera a asignado, recargamos las tarjetas
socket.on("turno_regresado", updateDisplays);
socket.on("turno_finalizado", updateDisplays);