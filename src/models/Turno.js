/** @typedef {import('./Paciente.js').Paciente} Paciente*/
/** @typedef {import('./Usuario.js').Usuario} Usuario */

export class Turno {
    #idCita
    #fechaCreacion
    #horaCreacion
    #horaCobra
    #horaAsignacion
    #horaCierra
    #turno
    #estatus
    #manchester
    #paciente
    #usuarioCrea
    #usuarioCobra
    #usuarioAsigna
    #usuarioCierra
    #consultorio

    /**
     * 
     * @param {number} idCita 
     * @param {Date} fechaCreacion 
     * @param {string} horaCreacion 
     * @param {string} horaCobra 
     * @param {string} horaCierra 
     * @param {string} horaAsignacion 
     * @param {number} turno 
     * @param {string} estatus 
     * @param {string} manchester 
     * @param {Paciente} Paciente 
     * @param {Usuario} usuarioCrea 
     * @param {Usuario} usuarioCobra 
     * @param {Usuario} usuarioAsigna 
     * @param {Usuario} usuarioCierra 
     * @param {string} consultorio 
     */
    constructor(idCita, fechaCreacion, horaCreacion, horaCobra, horaCierra, horaAsignacion, turno, estatus, manchester, Paciente, usuarioCrea, usuarioCobra, usuarioAsigna, usuarioCierra, consultorio) {
        this.#idCita = idCita
        this.#fechaCreacion = fechaCreacion
        this.#horaCreacion = horaCreacion
        this.#horaCobra = horaCobra
        this.#horaCierra = horaCierra
        this.#horaAsignacion = horaAsignacion
        this.#turno = turno
        this.#estatus = estatus
        this.#manchester = manchester
        this.#paciente = Paciente
        this.#usuarioCrea = usuarioCrea
        this.#usuarioCobra = usuarioCobra
        this.#usuarioAsigna = usuarioAsigna
        this.#usuarioCierra = usuarioCierra
        this.#consultorio = consultorio
    }

    get idCita(){
        return this.#idCita
    }

    get fechaCreacion(){
        return this.#fechaCreacion
    }

    get horaCreacion(){
        return this.#horaCreacion
    }

    get horaCobra (){
        return this.#horaCobra
    }
    
    get horaAsignacion(){
        return this.#horaAsignacion
    }

    get horaCierra(){
        return this.#horaCierra
    }

    get turno(){
        return this.#turno
    }

    get estatus(){
        return this.#estatus
    }

    get manchester(){
        return this.#manchester
    }

    get paciente(){
        return this.#paciente
    }

    get usuarioCrea(){
        return this.#usuarioCrea
    }

    get usuarioCobra(){
        return this.#usuarioCobra
    }

    get usuarioAsigna(){
        return this.#usuarioAsigna
    }

    get usuarioCierra(){
        return this.#usuarioCierra
    }

    get consultorio(){
        return this.#consultorio
    }

    toString(){
        return `idCita: ${this.#idCita}
        fechaCreacion: ${this.#fechaCreacion}`
    }
}