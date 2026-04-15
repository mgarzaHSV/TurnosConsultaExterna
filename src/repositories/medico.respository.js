/** @typedef {import('../database/database.js').Database} Database*/

export class MedicoRepository{
    /**
     * 
     * @param {Database} dataBase 
     */
    constructor(dataBase){
        this.dataBase = dataBase
    }
}