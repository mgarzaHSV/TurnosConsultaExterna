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

    async connect() {
        if (this.#connection) {
            return this.#connection
        }

        try {
            const pool = await sql.connect({
                user: this.#userName,
                password: this.#password,
                server: this.#url,
                database: this.#dbName,
                pool: {
                    max: 5,
                    min: 0,
                    idleTimeoutMillis: 30000
                },
                options: {
                    encrypt: false,
                    trustServerCertificate: true
                }
            })

            console.log("Conexión correcta")
            this.#connection = pool
            return pool
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error)
            throw error
        }
    }

    async consultar(query, params = {}) {
        try {
            const pool = await this.connect()
            const request = pool.request()

            // Agregar parámetros dinámicamente
            for (const key in params) {
                request.input(key, params[key])
            }

            const result = await request.query(query)
            return result.recordset

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    getConnection() {
        return this.#connection
    }
}