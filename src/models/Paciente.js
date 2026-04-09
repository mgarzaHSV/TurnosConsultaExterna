import { Persona } from "./Persona.js"

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

    get idPaciente(){
        return this.#idPaciente
    }

    set idPaciente(idPaciente){
        this.#idPaciente = idPaciente
    }

     toString(){
        return `idPaciente:${this.#idPaciente}
        Nombre: ${this.nombre}
        Apellido Paterno: ${this.apellidoPaterno}
        Apellido Materno: ${this.apellidoMaterno}
        FechaNacimiento: ${this.fechaNacimiento},
        Sexo: ${this.sexo}
        Edad: ${this.edad}
        Telefono: ${this.telefono}`
    }
}