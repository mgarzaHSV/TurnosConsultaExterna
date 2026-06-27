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

socket.on("turno_creado", () => {
location.reload();
});


socket.on("turno_pagado", () => {
    setTimeout(() => {
        location.href = ''
    }, 3000);
});


function mensajeParaUsuario(mensaje, tipoIcon){
    Swal.fire({
        title: mensaje,
        icon: tipoIcon,
        showConfirmButton: false,
        timer: tipoIcon === 'success' ? 2500 : 4500
    });
}