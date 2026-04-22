function refreshTurnsList(){
    fetch('/api/turnos/estatus/generados',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    ).then(response => response.json()).
    then(data =>{
        console.log(data)
        const turnosAreas = document.getElementById('areaTurnos')
        if(!turnosAreas) return null
        turnosAreas.innerHTML = ''

        const colores = {
            '1': 'bg-inmediato',
            '2': 'bg-muyUrgente',
            '3': 'bg-urgente',
            '4': 'bg-normal',
            '5': 'bg-noUrgente'
        }

        const textos = {
            '1': 'Inmediato',
            '2': 'Muy Urgente',
            '3': 'Urgente',
            '4': 'Normal',
            '5': 'No urgente'
        }

        const coloresEstatus = {'Generado': 'bg-generado','Fila': 'bg-fila','Atención': 'bg-atencion', 'Finalizado': 'bg-finalizado'}
        
        data.forEach(element =>{
            element.color = colores[element.triage]
            element.textoEstatus = textos[element.triage]
            const component =  `<div class="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                                    <!--<div class="bg-blue-600 p-4">-->
                                    <div class="${element.color} p-4">
                                        <h2 class="${(element.color === 'bg-urgente' ? 'text-black' : 'text-white')} text-xl font-bold flex items-center gap-2">
                                            <span>📅</span> Turno de Consulta ${element.turno}</h2>
                                    </div>
                                    
                                    <div class="p-6">
                                        <div class="flex justify-between items-start mb-4">
                                            <div>
                                                <p class="text-sm text-slate-500 uppercase font-semibold tracking-wider">Paciente</p>
                                                <p class="text-lg font-bold text-slate-800">${element.nombre}</p>
                                            </div>
                                            <span class="text-amber-50 ${element.textoEstatus} text-xs px-2 py-1 rounded-full font-bold">${element.estado}</span>
                                        </div>
                                        <div>
                                            <p class="text-sm text-slate-500 uppercase font-semibold tracking-wider">Semáforo de Manchester</p>
                                            <div class="flex items-center gap-2 mt-1">
                                                <span class="w-4 h-4 ${element.color} rounded-full"></span>
                                                <span class="text-sm text-slate-700">${TRIAGE_DATA[element.triage].name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
            turnosAreas.innerHTML += component;
        })
    })
    .catch(error=>{
        console.log(error)
    });
}




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

refreshTurnsList()