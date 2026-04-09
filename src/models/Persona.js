export class Persona {
    #nombre
    #apellidoPaterno
    #apellidoMaterno
    #fechaNacimiento
    #sexo
    #edad
    #telefono

    constructor(
        {
            nombre = '', 
            apellidoPaterno, 
            apellidoMaterno, 
            fechaNacimiento, 
            sexo, 
            edad, 
            telefono} = {}) {
        this.#nombre = nombre
        this.#apellidoPaterno = apellidoPaterno
        this.#apellidoMaterno = apellidoMaterno
        this.#fechaNacimiento = fechaNacimiento
        this.#sexo = sexo.charAt(0)
        this.#edad = edad
        this.#telefono = telefono
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

    get fechaNacimiento(){
        return this.#fechaNacimiento
    }

    get sexo(){
        return this.#sexo
    }

    get edad(){
        return this.#edad
    }

    get telefono(){
        return this.#telefono
    }

    toString(){
        return `Nombre: ${this.#nombre}
        Apellido Paterno: ${this.#apellidoPaterno}
        Apellido Materno: ${this.#apellidoMaterno}
        FechaNacimiento: ${this.#fechaNacimiento},
        Sexo: ${this.#sexo}
        Edad: ${this.#edad}
        Telefono: ${this.#telefono}`
    }
}