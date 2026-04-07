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
            triage: document.querySelector('.triage-btn.active').color,
            edad: document.getElementById('input-age').value,
            sexo: document.getElementById('input-sex').value,
            signosVitales: {
                pa: document.getElementById('input-bp').value,
                fc: document.getElementById('input-hr').value,
                temp: document.getElementById('input-temp').value,
                spo2: document.getElementById('input-o2').value
            }

})      }).then(res => res.json())
        .then(data => {
            if(data.success){
                alert('Paciente registrado con éxito. Turno: ');
                document.querySelector('dialog').close();
                // Aquí podrías agregar lógica para actualizar la lista de turnos sin recargar la página
            } else {
                alert('Error al registrar paciente');
            }
        })
}