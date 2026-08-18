export class DTOCitaTarjeta {
    constructor({idCita, paciente, estatus, triage, turno, edad, color, noCuenta, consultorio, seguimiento}){
        this.idCita = idCita;
        this.paciente = paciente;
        this.estatus = estatus;
        this.triage = triage;
        this.turno = turno;
        this.edad = edad;
        this.color = color;
        this.noCuenta = noCuenta;
        this.consultorio = consultorio;
        this.seguimiento = seguimiento;
    }

    toJSON(){
        return {
            idCita: this.idCita,
            paciente: this.paciente,
            estatus: this.estatus,
            triage: this.triage,
            turno: this.turno,
            edad: this.edad,
            color: this.color,
            noCuenta: this.noCuenta,
            consultorio: this.consultorio,
            seguimiento: this.seguimiento
        }
    }
}