export class AuthRepository{
    constructor(dataBase){
        this.dataBase = dataBase
    }

    findUserByUsername = async (user) =>{
        const query = `SELECT * FROM usuario (nolock) WHERE nombreUsuario = '${user}'`
        try{
            const resultado = await this.dataBase.consultar(query)
            return resultado[0]
        }catch{
            console.error("Error al ejecutar la query")
            return null
        }
    }
}