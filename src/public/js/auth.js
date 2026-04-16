function logout(){
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            // Redirigir al usuario a la página de inicio de sesión después del logout
            window.location.href = '/login';
        } else {
            console.error('Error al cerrar sesión:', data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
}