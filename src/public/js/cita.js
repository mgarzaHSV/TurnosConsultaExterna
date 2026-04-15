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
    "5": { color: 'blue', hex: '#3b82f6', name: 'Sin urgencia' }
};

function saveAndGoToQueue(){
    fetch('/citas',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: document.getElementById('input-name').value,
            apellidoPaterno: document.getElementById('input-firstName').value,
            apellidoMaterno: document.getElementById('input-lastName').value,
            triage: document.querySelector('.triage-btn.active').dataset.color,
            edad: document.getElementById('input-age').value,
            sexo: document.getElementById('input-sex').value

})      }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data){
                alert(data.message);
                document.querySelector('dialog').close();
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