// --- CACHÉ DEL DOM ---
let DOM = {};
let modalTimeout = null;
const notificationSound = new Audio('/sounds/notification.mp3');

const TRIAGE_DATA = {
    "1": { color: 'red', hex: '#ef4444', name: 'Inmediato' },
    "2": { color: 'orange', hex: '#f97316', name: 'Muy Urgente' },
    "3": { color: 'yellow', hex: '#eab308', name: 'Urgente' },
    "4": { color: 'green', hex: '#22c55e', name: 'Estándar' },
    "5": { color: 'blue', hex: '#3b82f6', name: 'No Urgente' }
};

function getDirectionIconHTML(room, sizeClass) {
    if (!room) return `<i data-lucide="map-pin" class="${sizeClass} text-blue-400"></i>`;
    const lowerRoom = room.toLowerCase();
    if (lowerRoom.includes('1')) return `<i data-lucide="arrow-left" class="${sizeClass} text-blue-400"></i>`;
    if (lowerRoom.includes('2')) return `<i data-lucide="arrow-right" class="${sizeClass} text-blue-400"></i>`;
    if (lowerRoom.includes('3')) return `<i data-lucide="arrow-up" class="${sizeClass} text-blue-400"></i>`;
    return `<i data-lucide="map-pin" class="${sizeClass} text-blue-400"></i>`;
}

function triggerModalAnimation(turnData) {
    if(!DOM.modal) return;
    const triageHexa = TRIAGE_DATA[turnData.triage]?.hex || '#ffffff';
     
    DOM.modalCard.style.borderColor = triageHexa;
    DOM.modalCard.style.boxShadow = `0 0 100px ${triageHexa}50`;
    DOM.modalTitle.style.color = triageHexa;
    DOM.modalTurn.textContent = turnData.paciente; // O turnData.turnName según tu backend
    DOM.modalRoom.textContent = turnData.consultorio || "En espera";
    DOM.modalIcon.innerHTML = getDirectionIconHTML(turnData.consultorio, "w-20 h-20");
    
    lucide.createIcons();
    DOM.modal.classList.remove('hidden');

    if (modalTimeout) clearTimeout(modalTimeout);
    
    modalTimeout = setTimeout(() => {
        DOM.modal.classList.add('hidden');
    }, 6000);
}

async function renderQueueList() {
    if(!DOM.queueContainer) return;

    const response = await fetch('/api/turnos' , { cache: 'no-store' });
    const allTurnos = await response.json();
    DOM.queueContainer.innerHTML = '';
    
    let htmlContent = '';
    allTurnos.forEach((turn, idx) => {
        const triage = TRIAGE_DATA[turn.triage] || { hex: '#ffffff' };
        const isLatest = idx === 0;
        
        const containerClass = isLatest ? 'bg-slate-800 border-2 border-slate-600 shadow-2xl' : 'bg-slate-800/40 border border-slate-700/50 opacity-80 hover:opacity-100 shadow-md';
        const turnTextClass = isLatest ? 'text-7xl md:text-8xl' : 'text-5xl md:text-6xl';
        const roomTextClass = isLatest ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl';
        const iconContainerClass = isLatest ? 'bg-slate-900 w-24 h-24 md:w-32 md:h-32' : 'bg-slate-700 w-16 h-16 md:w-20 md:h-20';
        const iconSizeClass = isLatest ? 'w-16 h-16' : 'w-10 h-10';

        htmlContent += `
            <div class="rounded-3xl p-6 md:p-8 flex items-center relative overflow-hidden transition-all ${containerClass}">
                <div class="absolute left-0 top-0 w-4 h-full" style="background-color: ${triage.hex}"></div>
                <div class="pl-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
                    <div>
                        <p class="text-slate-400 text-xl uppercase tracking-widest mb-1">Turno</p>
                        <p class="font-black text-white leading-none ${turnTextClass}">${turn.turnName}</p>
                    </div>
                    <div class="flex items-center gap-8 w-full md:w-auto justify-end">
                        <div class="text-right hidden sm:block">
                            <p class="text-slate-400 text-xl uppercase tracking-widest mb-1">Diríjase a</p>
                            <p class="font-bold text-slate-300 ${roomTextClass}">${!turn.consultorio ? "En espera" : turn.consultorio}</p>
                        </div>
                        <div class="rounded-full flex items-center justify-center border border-slate-600 shadow-inner shrink-0 ${iconContainerClass}">
                            ${getDirectionIconHTML(turn.consultorio, iconSizeClass)}
                        </div>
                    </div>
                </div>
            </div>`;
    });
    
    DOM.queueContainer.innerHTML = htmlContent;
    lucide.createIcons();
}

function updateClock() {
    if(DOM.queueTime) {
        DOM.queueTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// === INICIALIZACIÓN SEGURA ===
document.addEventListener('DOMContentLoaded', () => {
    DOM = {
        modal: document.getElementById('queue-modal'),
        modalCard: document.getElementById('queue-modal-card'),
        modalTitle: document.getElementById('queue-modal-title'),
        modalTurn: document.getElementById('queue-modal-turn'),
        modalRoom: document.getElementById('queue-modal-room'),
        modalIcon: document.getElementById('queue-modal-icon'),
        queueContainer: document.getElementById('queue-list-container'),
        queueTime: document.getElementById('queue-time')
    };

    lucide.createIcons();
    renderQueueList();
    updateClock();
    setInterval(updateClock, 60000);
});

// === WEBSOCKETS ===
['turno_pagado', 'turno_regresado', 'turno_finalizado'].forEach(evento => {
    console.log("🟢 ¡Aviso de caja recibido! Actualizando médicos...")
    socket.on(evento, renderQueueList);
});

socket.on("turno_asignado", (turno) => {
    triggerModalAnimation(turno.cita);
    notificationSound.play().catch(err => console.log("Audio de TV bloqueado, haz clic en la pantalla:", err));
    renderQueueList();
});