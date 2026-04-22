
/** @typedef {import('../models/Rol.js').Rol} Rol */

export class Usuario {
    #idUsuario
    #nombreUsuario
    #nombre
    #password
    #rol

    /**
     * 
     * @param {number | null} idUsuario 
     * @param {string | null} nombreUsuario 
     * @param {string | null} nombre 
     * @param {string | null} password 
     * @param {Rol | null} rol 
     */
    constructor(idUsuario, nombreUsuario, nombre, password, rol){
        this.#idUsuario = idUsuario
        this.#nombreUsuario = nombreUsuario
        this.#nombre = nombre
        this.#password = password
        this.#rol = rol
    }

    static crearNuevoUsuario(nombreUsuario, nombre, password, rol){
        return new Usuario(null, nombreUsuario, nombre, password, rol)
    }

    static datosUsuario(idUsuario, nombreUsuario, nombre, password, rol ){
        return new Usuario(idUsuario, nombreUsuario,nombre,  password, rol)
    }

    static usuarioVerificar(nombreUsuario, password){
        return new Usuario(null, nombreUsuario, null, password, null)
    }

    static usuarioVacio(){
        return new Usuario(null, null, null, null, null)
    }

    get idUsuario(){
        return this.#idUsuario
    }

    get nombreUsuario(){
        return this.#nombreUsuario
    }

    get nombre(){
        return this.#nombre
    }
    
    get password (){
        return this.#password
    }

    get rol (){
        return this.#rol
    }

    set idUsuario(idUsuario){
        this.#idUsuario = idUsuario
    }

    set nombreUsuario(nombreUsuario){
        this.#nombreUsuario = nombreUsuario
    }

    set password(password){
        this.#password = password
    }

    set rol(rol){
        this.#rol = rol
    }

    toString(){
        return `Id de usuario: ${this.#idUsuario}
        Nombre de usuario: ${this.#nombreUsuario}
        Nombre para mostrar: ${this.#nombre}
        Contraseña: ${this.#password}
        Rol: {
            idRol: ${this.#rol?.idRol ?? null},
            nombreRol: ${this.#rol?.nombreRol ?? null}
        }`
    }

}