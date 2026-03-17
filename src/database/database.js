import sql from 'mssql'

export class Database {
    #url
    #dbName
    #userName
    #password
    #connection = null

    constructor(url, dbName, userName, password) {
        this.#url = url
        this.#dbName = dbName
        this.#userName = userName
        this.#password = password
    }

    async connect(){
        if (this.#connection) {
            return this.#connection
        }
        try {
            const pool = sql.connect({
                user: this.#userName,
                password: this.#password,
                server: this.#url,
                database: this.#dbName,
                pool:{
                    max:5,
                    min:0,
                    idleTimeoutMillis:30000
                },
                options: {
                    encrypt: false,
                    trustServerCertificate: true
                }
            });
            return pool
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error)
            throw error
        }
    }

    getConnection(){
        return this.#connection
    }
}