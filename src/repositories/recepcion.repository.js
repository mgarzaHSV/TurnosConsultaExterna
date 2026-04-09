/** @typedef {import('../database/database.js').Database} DataBase */

export class RecepcionRepository {

    /**
     * 
     * @param {DataBase} baseDatos 
     */
    constructor(baseDatos){
        this.baseDatos = baseDatos
    }
}