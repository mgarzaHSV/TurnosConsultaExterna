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
        this.#sexo = sexo
        this.#edad = edad
        this.#telefono = telefono
    }
}