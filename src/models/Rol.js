export class Rol {
    #idRol
    #nombreRol

    
    /**
     * 
     * @param {number|null} idRol 
     * @param {string} nombreRol 
     */
    constructor(idRol, nombreRol){
        this.#idRol = idRol
        this.#nombreRol = nombreRol
    }
    
    /**
     * Funcion para crear nueva instancia de un nuevo Rol
     * @param {string} nombreRol 
     * @return Instancia de tipo {@link Rol} para manejo del modelo
     */
    static crearRol( nombreRol) {
        return new Rol(null, nombreRol)
    }

    /**
     * Funcion que retorna una instancia de Rol con la información obtenidos desde una consulta a la base de datos
     * @param {number} idRol 
     * @param {string} nombreRol 
     * @return
     */
    static registroRol (idRol, nombreRol){
        return new Rol(idRol, nombreRol)
    }

    get idRol () {
        return this.#idRol
    }

    get nombreRol (){
        return this.#nombreRol
    }

    set idRol (idRol){
        this.#idRol = idRol
    }

    set nombreRol (nombreRol){
        this.#nombreRol = nombreRol
    }

    toJSON(){
        return {
            "idRol":this.#idRol,
            "nombreRol":this.#nombreRol 
        }
    }
}