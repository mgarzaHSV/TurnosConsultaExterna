export class TurnoComponenteDTO {
    #nombrePaciente
    #estado
    #turno
    #triage
    
    constructor(nombrePaciente, estado, turno, triage) {
        this.#nombrePaciente = nombrePaciente
        this.#estado = estado
        this.#turno = turno
        this.#triage = triage
    }

    toJSON() {
        return {
            nombre: this.#nombrePaciente,
            estado: this.#estado,
            turno: this.#turno,
            triage: this.#triage
        }
    }
}