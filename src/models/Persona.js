export class Persona {
    #nombre
    #apellidoPaterno
    #apellidoMaterno
    #sexo
    #edad

    /**
     * 
     * @param {*} param0 
     */
    constructor(
        {
            nombre = '', 
            apellidoPaterno, 
            apellidoMaterno, 
            sexo, 
            edad}) {
        this.#nombre = nombre
        this.#apellidoPaterno = apellidoPaterno
        this.#apellidoMaterno = apellidoMaterno
        this.#sexo = sexo.charAt(0)
        this.#edad = edad
    }

    get nombre() {
        return this.#nombre
    }

    get nombreCompleto() {
        return `${this.#nombre} ${this.#apellidoPaterno} ${this.#apellidoMaterno}`
    }

    get apellidoPaterno(){
        return this.#apellidoPaterno
    }

    get apellidoMaterno(){
        return this.#apellidoMaterno
    }

    get sexo(){
        return this.#sexo
    }

    get edad(){
        return this.#edad
    }

    toString(){
        return `Nombre: ${this.#nombre}
        Apellido Paterno: ${this.#apellidoPaterno}
        Apellido Materno: ${this.#apellidoMaterno}
        Sexo: ${this.#sexo}
        Edad: ${this.#edad}`
    }
}