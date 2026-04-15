// --- CONSTANTS & MOCK DATA ---
const TRIAGE_DATA = {
    "1": { color: 'red', hex: '#ef4444', name: 'Inmediato' },
    "2": { color: 'orange', hex: '#f97316', name: 'Muy Urgente' },
    "3": { color: 'yellow', hex: '#eab308', name: 'Urgente' },
    "4": { color: 'green', hex: '#22c55e', name: 'Estándar' },
    "5": { color: 'blue', hex: '#3b82f6', name: 'No Urgente' }
};

const state = {
    name: 'Ricardo M. Lopez',
    turn: 'T-102',
    age: 34,
    sex: 'Masculino',
    room: 'Consultorio 2',
    triage: TRIAGE_DATA.yellow,
    vitals: { bp: '120/80', hr: '85', temp: '37.5', o2: '98' },
    history: [
        { turnNumber: 'T-101', consultingRoom: 'Consultorio 1', triage: TRIAGE_DATA.green },
        { turnNumber: 'T-100', consultingRoom: 'Consultorio 3', triage: TRIAGE_DATA.blue },
        { turnNumber: 'T-099', consultingRoom: 'Consultorio 2', triage: TRIAGE_DATA.yellow },
    ]
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
    const modal = document.getElementById('queue-modal');
    const card = document.getElementById('queue-modal-card');
     
    // Set styles dynamically
    card.style.borderColor = turnData.triage.hex;
    card.style.boxShadow = `0 0 100px ${turnData.triage.hex}50`;
    document.getElementById('queue-modal-title').style.color = turnData.triage.hex;
    document.getElementById('queue-modal-turn').textContent = turnData.turnNumber;
    document.getElementById('queue-modal-room').textContent = turnData.consultingRoom.replace(/consultorio/i, 'Cons.');
    document.getElementById('queue-modal-icon').innerHTML = getDirectionIconHTML(turnData.consultingRoom, "w-20 h-20");
    lucide.createIcons();

    // Show Modal
    modal.classList.remove('hidden');

    // Hide Modal after 6 seconds
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 6000);
}


async function renderQueueList() {
    const response = await fetch('/api/turnos')
    const allTurnos = await response.json()
    const allTurns = allTurnos.map((turn)=>{
        return {
            turnNumber: turn.turnName,
            triage: TRIAGE_DATA[turn.triage],
            consultingRoom: turn.consultorio
        }
    })
    

    const container = document.getElementById('queue-list-container');
    container.innerHTML = '';
    allTurns.forEach((turn, idx) => {
        const isLatest = idx === 0;
        const containerClass = isLatest ? 'bg-slate-800 border-2 border-slate-600 shadow-2xl' : 'bg-slate-800/40 border border-slate-700/50 opacity-80 hover:opacity-100 shadow-md';
        const turnTextClass = isLatest ? 'text-7xl md:text-8xl' : 'text-5xl md:text-6xl';
        const roomTextClass = isLatest ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl';
        const iconContainerClass = isLatest ? 'bg-slate-900 w-24 h-24 md:w-32 md:h-32' : 'bg-slate-700 w-16 h-16 md:w-20 md:h-20';
        const iconSizeClass = isLatest ? 'w-16 h-16' : 'w-10 h-10';

        const html = `
            <div class="rounded-3xl p-6 md:p-8 flex items-center relative overflow-hidden transition-all ${containerClass}">
                <div class="absolute left-0 top-0 w-4 h-full" style="background-color: ${turn.triage.hex}"></div>
                
                <div class="pl-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
                    <div>
                        <p class="text-slate-400 text-xl uppercase tracking-widest mb-1">Turno</p>
                        <p class="font-black text-white leading-none ${turnTextClass}">${turn.turnNumber}</p>
                    </div>
                    
                    <div class="flex items-center gap-8 w-full md:w-auto justify-end">
                        <div class="text-right hidden sm:block">
                            <p class="text-slate-400 text-xl uppercase tracking-widest mb-1">Diríjase a</p>
                            <p class="font-bold text-slate-300 ${roomTextClass}">${!turn.consultingRoom?"En espera":turn.consultingRoom}</p>
                        </div>
                        <div class="rounded-full flex items-center justify-center border border-slate-600 shadow-inner shrink-0 ${iconContainerClass}">
                            ${getDirectionIconHTML(turn.consultingRoom, iconSizeClass)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
    lucide.createIcons();
}

function simularNuevoTurno() {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const randomRoom = [1, 2, 3][Math.floor(Math.random() * 3)];
    const randomTriageKeys = Object.keys(TRIAGE_DATA);
    const randomTriage = TRIAGE_DATA[randomTriageKeys[Math.floor(Math.random() * randomTriageKeys.length)]];
    
    const nuevoTurno = {
        turnNumber: `T-${randomNum}`,
        consultingRoom: `Consultorio ${randomRoom}`,
        triage: randomTriage
    };
    
    // Push current state to history before updating
    state.history.unshift({
        turnNumber: state.turn,
        consultingRoom: state.room,
        triage: state.triage
    });
    if (state.history.length > 4) state.history.pop(); // Keep max 4 history

    // Update Current
    state.turn = nuevoTurno.turnNumber;
    state.room = nuevoTurno.consultingRoom;
    state.triage = nuevoTurno.triage;
    
    updateDisplays();
    triggerModalAnimation(nuevoTurno);
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

    // Triage colors in specific elements
    /*document.getElementById('status-header-color').style.backgroundColor = state.triage.hex;
    const docBadge = document.getElementById('doctor-triage-badge');
    docBadge.style.borderColor = state.triage.hex;
    docBadge.querySelector('div').style.backgroundColor = state.triage.hex;*/

    // Render Queue List
    renderQueueList();
    
    // Re-bind icons globally just in case
    lucide.createIcons();
    
    // Clock updating
    const now = new Date();
    document.getElementById('queue-time').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Keep clock ticking every minute
setInterval(() => {
    const now = new Date();
    document.getElementById('queue-time').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}, 60000);

// Initial setup
lucide.createIcons();
updateDisplays();