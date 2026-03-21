export class Paciente extends Persona {
    #idPaciente
    constructor({
        idPaciente= null,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        fechaNacimiento,
        sexo,
        edad,
        telefono
    }){
        super({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            sexo,
            edad,
            telefono
        })
        this.#idPaciente = idPaciente
    }
    
}