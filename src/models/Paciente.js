import { Persona } from "./Persona.js"

export class Paciente extends Persona {
    #idPaciente
    /**
     * 
     * @param {*} idPaciente 
     * @param {*} nombre 
     * @param {*} apellidoPaterno 
     * @param {*} apellidoMaterno 
     * @param {*} sexo 
     * @param {*} edad 
     */
    constructor(idPaciente,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        sexo,
        edad
    ){
        super({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            sexo,
            edad
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
        Apellido Materno: ${this.apellidoMaterno},
        Sexo: ${this.sexo}
        Edad: ${this.edad}`
    }
}