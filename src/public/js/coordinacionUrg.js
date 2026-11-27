let chartEdades = null;
let chartManchester = null;
let chartTendencia = null;
let datosActuales = null;
let chartSexoEdad = null;

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');

    const inputMes = document.getElementById('filtro-mes');
    const inputInicio = document.getElementById('filtro-inicio');
    const inputFin = document.getElementById('filtro-fin');
    const selectConsultorio = document.getElementById('filtro-consultorio');

    // Inicializar con el mes actual
    inputMes.value = `${yyyy}-${mm}`;
    establecerRangoDeMes(yyyy, hoy.getMonth());

    // Al cambiar el selector de mes, actualiza automáticamente fechas inicio/fin y consulta
    inputMes.addEventListener('change', (e) => {
        if (!e.target.value) return;
        const [year, month] = e.target.value.split('-').map(Number);
        establecerRangoDeMes(year, month - 1);
        cargarEstadisticas();
    });

    document.getElementById('btn-filtrar').addEventListener('click', cargarEstadisticas);
    document.getElementById('btn-exportar').addEventListener('click', exportarCSV);

    function establecerRangoDeMes(year, monthIndex) {
        const inicio = new Date(year, monthIndex, 1).toISOString().split('T')[0];
        const fin = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];
        inputInicio.value = inicio;
        inputFin.value = fin;
    }

    async function cargarEstadisticas() {
        const params = new URLSearchParams({
            fechaInicio: inputInicio.value,
            fechaFin: inputFin.value,
            consultorio: selectConsultorio.value
        });

        try {
            const response = await fetch(`/coordinacion/api/estadisticas?${params}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.mensaje || 'Error al cargar datos');

            datosActuales = data;
            actualizarKPIs(data.resumen);
            renderizarEdades(data.edades);
            renderizarManchester(data.manchester);
            renderizarTendencia(data.tendencia);
            renderizarSexoEdad(data.sexoPorEdad);
        } catch (error) {
            console.error(error);
            if (window.Swal) {
                Swal.fire('Error', 'No se pudieron cargar las métricas del periodo.', 'error');
            }
        }
    }

    function actualizarKPIs(resumen) {
        document.getElementById('kpi-total').textContent = resumen.totalAtenciones.toLocaleString('es-MX');
        document.getElementById('kpi-espera').textContent = `${resumen.promedioEsperaMin} min`;
        document.getElementById('kpi-atencion').textContent = `${resumen.promedioAtencionMin} min`;
    }

    function renderizarEdades(edades) {
        const tbody = document.getElementById('tabla-edades');
        tbody.innerHTML = edades.map(e => `
            <tr>
                <td class="py-2 px-3 font-medium text-slate-700">${e.grupoEtario}</td>
                <td class="py-2 px-3 text-center font-semibold text-blue-600">${e.cantidad}</td>
                <td class="py-2 px-3 text-right text-slate-600">${e.promedioAtencionMin} min</td>
            </tr>
        `).join('');

        const ctx = document.getElementById('chart-edades').getContext('2d');
        if (chartEdades) chartEdades.destroy();

        chartEdades = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: edades.map(e => e.grupoEtario),
                datasets: [
                    {
                        label: 'Cantidad de Pacientes',
                        data: edades.map(e => e.cantidad),
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    },
                    {
                        label: 'Prom. Atención (min)',
                        data: edades.map(e => e.promedioAtencionMin),
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    function renderizarManchester(manchester) {
        const tbody = document.getElementById('tabla-manchester');
        tbody.innerHTML = manchester.map(m => `
            <tr>
                <td class="py-2 px-3 font-medium flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full inline-block" style="background-color: ${m.colorHex}"></span>
                    ${m.nombre}
                </td>
                <td class="py-2 px-3 text-center">${m.cantidad}</td>
                <td class="py-2 px-3 text-center text-slate-400">${m.metaMin} min</td>
                <td class="py-2 px-3 text-right font-bold ${m.enMeta ? 'text-emerald-600' : 'text-red-600'}">
                    ${m.promedioEsperaMin} min
                </td>
            </tr>
        `).join('');

        const ctx = document.getElementById('chart-manchester').getContext('2d');
        if (chartManchester) chartManchester.destroy();

        chartManchester = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: manchester.map(m => m.nombre.split(' - ')[0]),
                datasets: [{
                    label: 'Espera Promedio (min)',
                    data: manchester.map(m => m.promedioEsperaMin),
                    backgroundColor: manchester.map(m => m.colorHex),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderizarTendencia(tendencia) {
        const ctx = document.getElementById('chart-tendencia').getContext('2d');
        if (chartTendencia) chartTendencia.destroy();

        chartTendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tendencia.map(t => t.fecha),
                datasets: [{
                    label: 'Consultas Atendidas',
                    data: tendencia.map(t => t.total),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderizarSexoEdad(sexoPorEdad) {
    if (!sexoPorEdad) return;

    const grupos = ['Niños (0-11)', 'Jóvenes (12-26)', 'Adultos (27-59)', 'Adultos Mayores (60+)'];
    const tbody = document.getElementById('tabla-sexo-edad');

    tbody.innerHTML = sexoPorEdad.map(item => `
        <tr class="hover:bg-slate-50">
            <td class="py-3 px-3 font-semibold text-slate-700">${item.sexo}</td>
            <td class="py-3 px-2 text-center text-slate-600">${item.desglose['Niños (0-11)'] || 0}</td>
            <td class="py-3 px-2 text-center text-slate-600">${item.desglose['Jóvenes (12-26)'] || 0}</td>
            <td class="py-3 px-2 text-center text-slate-600">${item.desglose['Adultos (27-59)'] || 0}</td>
            <td class="py-3 px-2 text-center text-slate-600">${item.desglose['Adultos Mayores (60+)'] || 0}</td>
            <td class="py-3 px-3 text-right font-bold text-blue-600 bg-slate-50">${item.total}</td>
        </tr>
    `).join('');

    const coloresPorSexo = {
        'Masculino': '#3b82f6',              // Azul
        'Femenino': '#ec4899',               // Rosa
        'Otro / No especificado': '#8b5cf6'  // Morado
    };

    const datasets = sexoPorEdad.map(item => ({
        label: item.sexo,
        data: grupos.map(g => item.desglose[g] || 0),
        backgroundColor: coloresPorSexo[item.sexo] || '#64748b',
        borderRadius: 6
    }));

    const ctx = document.getElementById('chart-sexo-edad').getContext('2d');
    if (chartSexoEdad) chartSexoEdad.destroy();

    chartSexoEdad = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: grupos,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

    function exportarCSV() {
        if (!datosActuales) return;
        let csv = 'REPORTE COORDINACION MEDICA\n';
        csv += `Periodo,${inputInicio.value} a ${inputFin.value}\n`;
        csv += `Total Atenciones,${datosActuales.resumen.totalAtenciones}\n`;
        csv += `Promedio Espera Global (min),${datosActuales.resumen.promedioEsperaMin}\n`;
        csv += `Promedio Atencion Global (min),${datosActuales.resumen.promedioAtencionMin}\n\n`;

        csv += 'GRUPO ETARIO,CANTIDAD PACIENTES,PROMEDIO ATENCION (MIN)\n';
        datosActuales.edades.forEach(e => {
            csv += `${e.grupoEtario},${e.cantidad},${e.promedioAtencionMin}\n`;
        });

        csv += '\nSEMAFORO MANCHESTER,CONSULTAS,META (MIN),ESPERA PROMEDIO (MIN)\n';
        datosActuales.manchester.forEach(m => {
            csv += `${m.nombre},${m.cantidad},${m.metaMin},${m.promedioEsperaMin}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Coordinacion_${inputInicio.value}_${inputFin.value}.csv`;
        a.click();

        if (datosActuales.sexoPorEdad) {
            csv += '\nATENCIONES POR SEXO Y EDAD,NINOS (0-11),JOVENES (12-26),ADULTOS (27-59),ADULTOS MAYORES (60+),TOTAL\n';
            datosActuales.sexoPorEdad.forEach(s => {
                csv += `${s.sexo},${s.desglose['Niños (0-11)']},${s.desglose['Jóvenes (12-26)']},${s.desglose['Adultos (27-59)']},${s.desglose['Adultos Mayores (60+)']},${s.total}\n`;
            });
        }
    }

    // Carga inicial
    cargarEstadisticas();
});