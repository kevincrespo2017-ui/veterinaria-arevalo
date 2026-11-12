
import { environment } from '../../../../environments/environment';

import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  registerLocaleData
} from '@angular/common';

import localeEsEc from '@angular/common/locales/es-EC';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { timeout } from 'rxjs/operators';

import { AuthServicio }
  from '../../../Servicios/auth-servicio';

import { NotificacionesServicio }
  from '../../../Servicios/notificaciones-servicio';

// ==========================================================
// CONFIGURACIÓN REGIONAL DE ECUADOR
// ==========================================================

registerLocaleData(localeEsEc, 'es-EC');

// ==========================================================
// MODELO DE MEDICAMENTO
// ==========================================================

interface MedicamentoAdmin {
  id: number;
  nombre: string;
  descripcion?: string | null;
  presentacion: string;
  concentracion?: string | null;
  unidadMedida: string;
  precioUnitario: number | string;
  stockDisponible: number | string;
  activo: boolean;
}

// ==========================================================
// TIPOS DE FILTROS
// ==========================================================

type FiltroEstado =
  | 'TODOS'
  | 'ACTIVOS'
  | 'INACTIVOS';

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

@Component({
  selector: 'app-admin-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-medicamentos.html',
  styleUrl: './admin-medicamentos.scss'
})
export class AdminMedicamentos implements OnInit {

  // ========================================================
  // 1. CONFIGURACIÓN DEL BACKEND
  // ========================================================

  private readonly apiUrl =
    environment.apiUrl + '/medicamentos';

  private readonly tiempoMaximo = 20000;

  // ========================================================
  // 2. EXPORTACIÓN DE MEDICAMENTOS
  // ========================================================

  async exportarMedicamentos(
    formato: 'pdf' | 'excel'
  ): Promise<void> {

    if (
      this.exportando !== null ||
      this.hayOperacionEnCurso ||
      this.cargando
    ) {
      return;
    }

    if (this.medicamentos.length === 0) {
      this.mensajeError =
        'No hay medicamentos registrados para exportar.';

      this.cd.detectChanges();
      return;
    }

    this.exportando = formato;
    this.mensajeError = '';
    this.mensajeExito = '';

    try {

      if (formato === 'pdf') {

        this.generarReportePdf();

        this.mensajeExito =
          'El reporte PDF del inventario se generó correctamente.';

      } else {

        await this.generarReporteExcel();

        this.mensajeExito =
          'El reporte Excel del inventario se generó correctamente.';

      }

      this.notificacionesServicio.agregar(
        'Exportación completada',
        this.mensajeExito,
        'exito'
      );

    } catch (error) {

      console.error(
        `Error al generar el reporte ${formato.toUpperCase()}:`,
        error
      );

      this.mensajeError = formato === 'pdf'
        ? 'No se pudo generar el PDF. Inténtalo nuevamente.'
        : 'No se pudo generar el Excel. Inténtalo nuevamente.';

      this.notificacionesServicio.agregar(
        'Error al exportar inventario',
        this.mensajeError,
        'error'
      );

    } finally {

      this.exportando = null;
      this.cd.detectChanges();

    }

  }

  // ========================================================
  // OBTENER TODOS LOS MEDICAMENTOS
  // ========================================================

  private obtenerMedicamentosParaExportar(): MedicamentoAdmin[] {

    return [...this.medicamentos].sort((a, b) =>
      String(a.nombre ?? '').localeCompare(
        String(b.nombre ?? ''),
        'es',
        { sensitivity: 'base' }
      )
    );

  }

  // ========================================================
  // FORMATO DE FECHA
  // ========================================================

  private obtenerFechaEmision(
    fecha: Date = new Date()
  ): string {

    return new Intl.DateTimeFormat('es-EC', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(fecha);

  }

  private obtenerSelloFecha(
    fecha: Date = new Date()
  ): string {

    const dosDigitos = (valor: number): string =>
      String(valor).padStart(2, '0');

    return [
      fecha.getFullYear(),
      dosDigitos(fecha.getMonth() + 1),
      dosDigitos(fecha.getDate())
    ].join('-');

  }

  // ========================================================
  // FORMATO MONETARIO
  // ========================================================

  private formatearDinero(
    valor: number | string
  ): string {

    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.numero(valor));

  }

  private formatearCantidad(
    valor: number | string
  ): string {

    return new Intl.NumberFormat('es-EC', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(this.numero(valor));

  }

  // ========================================================
  // 3. GENERAR PDF PROFESIONAL
  // ========================================================

  private generarReportePdf(): void {

    const medicamentos =
      this.obtenerMedicamentosParaExportar();

    const fecha = new Date();

    const total = medicamentos.length;

    const activos = medicamentos.filter(
      m => m.activo === true
    ).length;

    const inactivos = medicamentos.filter(
      m => m.activo === false
    ).length;

    const sinStock = medicamentos.filter(
      m => this.numero(m.stockDisponible) <= 0
    ).length;

    const documento = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const anchoPagina =
      documento.internal.pageSize.getWidth();

    const altoPagina =
      documento.internal.pageSize.getHeight();

    documento.setProperties({
      title: 'Inventario de medicamentos - Veterinaria Arévalo',
      subject: 'Reporte general de medicamentos',
      author: 'Veterinaria Arévalo',
      creator: 'Sistema de gestión veterinaria'
    });

    // ENCABEZADO INSTITUCIONAL

    const dibujarEncabezado = (pagina: number): void => {

      documento.setFillColor(7, 94, 71);

      documento.rect(
        0,
        0,
        anchoPagina,
        32,
        'F'
      );

      documento.setFillColor(8, 116, 90);

      documento.rect(
        0,
        32,
        anchoPagina,
        2,
        'F'
      );

      documento.setTextColor(255, 255, 255);

      documento.setFont('helvetica', 'bold');
      documento.setFontSize(15);

      documento.text(
        'VETERINARIA ARÉVALO',
        12,
        13
      );

      documento.setFont('helvetica', 'normal');
      documento.setFontSize(8);

      documento.text(
        'Sistema de gestión veterinaria',
        12,
        21
      );

      documento.setFont('helvetica', 'bold');
      documento.setFontSize(10);

      documento.text(
        'REPORTE DE INVENTARIO',
        anchoPagina - 12,
        13,
        { align: 'right' }
      );

      documento.setFont('helvetica', 'normal');
      documento.setFontSize(7.5);

      documento.text(
        `Emitido: ${this.obtenerFechaEmision(fecha)}`,
        anchoPagina - 12,
        21,
        { align: 'right' }
      );

      // TARJETAS ESTADÍSTICAS EN LA PRIMERA PÁGINA

      if (pagina === 1) {

        const separacion = 4;
        const margen = 12;

        const anchoTarjeta =
          (anchoPagina - margen * 2 - separacion * 3) / 4;

        const tarjetas = [
          {
            etiqueta: 'TOTAL MEDICAMENTOS',
            valor: String(total),
            color: [230, 245, 236] as [number, number, number],
            texto: [7, 94, 71] as [number, number, number]
          },
          {
            etiqueta: 'ACTIVOS',
            valor: String(activos),
            color: [232, 247, 238] as [number, number, number],
            texto: [22, 128, 78] as [number, number, number]
          },
          {
            etiqueta: 'INACTIVOS',
            valor: String(inactivos),
            color: [255, 246, 229] as [number, number, number],
            texto: [165, 103, 25] as [number, number, number]
          },
          {
            etiqueta: 'SIN STOCK',
            valor: String(sinStock),
            color: [255, 237, 235] as [number, number, number],
            texto: [177, 57, 49] as [number, number, number]
          }
        ];

        tarjetas.forEach((tarjeta, indice) => {

          const x =
            margen + indice * (anchoTarjeta + separacion);

          documento.setFillColor(...tarjeta.color);

          documento.roundedRect(
            x,
            38,
            anchoTarjeta,
            17,
            2,
            2,
            'F'
          );

          documento.setTextColor(90, 116, 101);
          documento.setFont('helvetica', 'bold');
          documento.setFontSize(6.5);

          documento.text(
            tarjeta.etiqueta,
            x + 4,
            44
          );

          documento.setTextColor(...tarjeta.texto);
          documento.setFont('helvetica', 'bold');
          documento.setFontSize(11);

          documento.text(
            tarjeta.valor,
            x + 4,
            51
          );

        });

      }

    };

    // DATOS DE LA TABLA

    const filas = medicamentos.map(medicamento => [

      String(medicamento.id),

      String(medicamento.nombre ?? '—'),

      String(medicamento.descripcion ?? '—'),

      String(medicamento.presentacion ?? '—'),

      String(medicamento.concentracion ?? '—'),

      String(medicamento.unidadMedida ?? '—'),

      this.formatearDinero(
        medicamento.precioUnitario
      ),

      this.formatearCantidad(
        medicamento.stockDisponible
      ),

      medicamento.activo ? 'Activo' : 'Inactivo'

    ]);

    // TABLA PROFESIONAL

    autoTable(documento, {

      head: [[
        'ID',
        'MEDICAMENTO',
        'DESCRIPCIÓN',
        'PRESENTACIÓN',
        'CONCENTRACIÓN',
        'UNIDAD',
        'PRECIO UNITARIO',
        'STOCK',
        'ESTADO'
      ]],

      body: filas,

      startY: 62,

      margin: {
        top: 40,
        right: 12,
        bottom: 18,
        left: 12
      },

      theme: 'grid',

      styles: {
        font: 'helvetica',
        fontSize: 7,
        cellPadding: 2.2,
        overflow: 'linebreak',
        valign: 'middle',
        textColor: [47, 72, 57],
        lineColor: [222, 235, 226],
        lineWidth: 0.15
      },

      headStyles: {
        fillColor: [7, 94, 71],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7
      },

      alternateRowStyles: {
        fillColor: [245, 250, 247]
      },

      columnStyles: {
        0: { cellWidth: 11, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 48 },
        3: { cellWidth: 32 },
        4: { cellWidth: 30 },
        5: { cellWidth: 18, halign: 'center' },
        6: { cellWidth: 29, halign: 'right' },
        7: { cellWidth: 20, halign: 'right' },
        8: { cellWidth: 22, halign: 'center' }
      },

      didParseCell: (datos) => {

        if (datos.section !== 'body') {
          return;
        }

        // RESALTAR EXISTENCIAS AGOTADAS

        if (
          datos.column.index === 7 &&
          this.numero(String(datos.cell.raw ?? '')) === 0
        ) {

          datos.cell.styles.fillColor = [255, 237, 235];
          datos.cell.styles.textColor = [177, 57, 49];
          datos.cell.styles.fontStyle = 'bold';

        }

        // DIFERENCIAR ESTADOS

        if (datos.column.index === 8) {

          if (String(datos.cell.raw) === 'Activo') {

            datos.cell.styles.textColor = [22, 128, 78];
            datos.cell.styles.fontStyle = 'bold';

          } else {

            datos.cell.styles.textColor = [165, 103, 25];
            datos.cell.styles.fontStyle = 'bold';

          }

        }

      },

      willDrawPage: (datos) => {
        dibujarEncabezado(datos.pageNumber);
      }

    });

    // PIE DE PÁGINA

    const totalPaginas =
      documento.getNumberOfPages();

    for (
      let pagina = 1;
      pagina <= totalPaginas;
      pagina++
    ) {

      documento.setPage(pagina);

      documento.setDrawColor(218, 233, 223);
      documento.setLineWidth(0.2);

      documento.line(
        12,
        altoPagina - 13,
        anchoPagina - 12,
        altoPagina - 13
      );

      documento.setFont('helvetica', 'normal');
      documento.setFontSize(7);
      documento.setTextColor(105, 126, 113);

      documento.text(
        'VETERINARIA ARÉVALO | Reporte administrativo de inventario',
        12,
        altoPagina - 7
      );

      documento.text(
        `Página ${pagina} de ${totalPaginas}`,
        anchoPagina - 12,
        altoPagina - 7,
        { align: 'right' }
      );

    }

    documento.save(
      `inventario-medicamentos-${this.obtenerSelloFecha(fecha)}.pdf`
    );

  }

  // ========================================================
  // 4. GENERAR EXCEL PROFESIONAL
  // ========================================================

  private async generarReporteExcel(): Promise<void> {

    const medicamentos =
      this.obtenerMedicamentosParaExportar();

    const fecha = new Date();

    const total = medicamentos.length;

    const activos = medicamentos.filter(
      m => m.activo === true
    ).length;

    const inactivos = medicamentos.filter(
      m => m.activo === false
    ).length;

    const sinStock = medicamentos.filter(
      m => this.numero(m.stockDisponible) <= 0
    ).length;

    const libro = new ExcelJS.Workbook();

    libro.creator = 'Veterinaria Arévalo';
    libro.lastModifiedBy = 'Sistema de gestión veterinaria';
    libro.created = fecha;
    libro.modified = fecha;
    libro.subject = 'Inventario general de medicamentos';
    libro.title = 'Reporte de inventario - Veterinaria Arévalo';

    // PALETA INSTITUCIONAL

    const verdeOscuro = 'FF075E47';
    const verdePrincipal = 'FF08745A';
    const verdeClaro = 'FFEAF7EF';
    const verdeAlterno = 'FFF5FAF7';
    const grisTexto = 'FF365B49';
    const grisBorde = 'FFDCEBE1';
    const rojoClaro = 'FFFFEDEC';
    const rojoTexto = 'FFB13931';
    const amarilloClaro = 'FFFFF5E5';
    const amarilloTexto = 'FFA56719';

    // --------------------------------------------------------
    // HOJA 1: RESUMEN EJECUTIVO
    // --------------------------------------------------------

    const resumen = libro.addWorksheet('Resumen', {
      properties: {
  tabColor: { argb: verdePrincipal }
},
      views: [{ showGridLines: false }]
    });

    resumen.columns = [
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 16 },
      { width: 16 }
    ];

    resumen.mergeCells('A1:H1');

    resumen.getCell('A1').value =
      'VETERINARIA ARÉVALO';

    resumen.getCell('A1').font = {
      name: 'Aptos Display',
      size: 19,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };

    resumen.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: verdeOscuro }
    };

    resumen.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'left',
      indent: 1
    };

    resumen.getRow(1).height = 38;

    resumen.mergeCells('A2:H2');

    resumen.getCell('A2').value =
      'REPORTE GENERAL DE INVENTARIO DE MEDICAMENTOS';

    resumen.getCell('A2').font = {
      name: 'Aptos',
      size: 11,
      bold: true,
      color: { argb: verdeOscuro }
    };

    resumen.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'left',
      indent: 1
    };

    resumen.getRow(2).height = 25;

    resumen.getCell('A4').value = 'Fecha de emisión';

    resumen.getCell('A4').font = {
      bold: true,
      color: { argb: grisTexto }
    };

    resumen.getCell('B4').value = fecha;
    resumen.getCell('B4').numFmt = 'dd/mm/yyyy hh:mm';

    resumen.getCell('B4').font = {
      color: { argb: grisTexto }
    };

    resumen.getCell('D4').value = 'Registros incluidos';

    resumen.getCell('D4').font = {
      bold: true,
      color: { argb: grisTexto }
    };

    resumen.getCell('E4').value = total;

    resumen.getCell('E4').font = {
      bold: true,
      color: { argb: verdeOscuro }
    };

    // TARJETAS DEL RESUMEN

    const crearTarjeta = (
      columnaInicio: string,
      columnaFin: string,
      etiqueta: string,
      valor: number,
      colorFondo: string,
      colorTexto: string
    ): void => {

      resumen.mergeCells(
        `${columnaInicio}7:${columnaFin}7`
      );

      resumen.mergeCells(
        `${columnaInicio}8:${columnaFin}9`
      );

      const celdaEtiqueta =
        resumen.getCell(`${columnaInicio}7`);

      celdaEtiqueta.value = etiqueta;

      celdaEtiqueta.font = {
        name: 'Aptos',
        size: 9,
        bold: true,
        color: { argb: colorTexto }
      };

      celdaEtiqueta.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorFondo }
      };

      celdaEtiqueta.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      const celdaValor =
        resumen.getCell(`${columnaInicio}8`);

      celdaValor.value = valor;

      celdaValor.font = {
        name: 'Aptos Display',
        size: 22,
        bold: true,
        color: { argb: colorTexto }
      };

      celdaValor.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorFondo }
      };

      celdaValor.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      for (let fila = 7; fila <= 9; fila++) {

        for (
          let columna = resumen.getColumn(columnaInicio).number;
          columna <= resumen.getColumn(columnaFin).number;
          columna++
        ) {

          resumen.getRow(fila).getCell(columna).border = {
            top: {
              style: 'thin',
              color: { argb: grisBorde }
            },
            left: {
              style: 'thin',
              color: { argb: grisBorde }
            },
            bottom: {
              style: 'thin',
              color: { argb: grisBorde }
            },
            right: {
              style: 'thin',
              color: { argb: grisBorde }
            }
          };

        }

      }

    };

    crearTarjeta(
      'A', 'B',
      'TOTAL MEDICAMENTOS',
      total,
      verdeClaro,
      verdeOscuro
    );

    crearTarjeta(
      'C', 'D',
      'MEDICAMENTOS ACTIVOS',
      activos,
      'FFEAF7EF',
      'FF16804E'
    );

    crearTarjeta(
      'E', 'F',
      'MEDICAMENTOS INACTIVOS',
      inactivos,
      amarilloClaro,
      amarilloTexto
    );

    crearTarjeta(
      'G', 'H',
      'SIN EXISTENCIAS',
      sinStock,
      rojoClaro,
      rojoTexto
    );

    resumen.getRow(7).height = 24;
    resumen.getRow(8).height = 28;
    resumen.getRow(9).height = 18;

    // ALCANCE DEL REPORTE

    resumen.mergeCells('A12:H12');

    resumen.getCell('A12').value =
      'ALCANCE DEL REPORTE';

    resumen.getCell('A12').font = {
      bold: true,
      size: 10,
      color: { argb: 'FFFFFFFF' }
    };

    resumen.getCell('A12').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: verdePrincipal }
    };

    resumen.getCell('A12').alignment = {
      vertical: 'middle',
      indent: 1
    };

    resumen.getRow(12).height = 24;

    resumen.mergeCells('A13:H14');

    resumen.getCell('A13').value =
      'Este documento contiene el inventario completo de medicamentos cargado desde el sistema, incluidos los registros activos e inactivos. La hoja "Inventario" permite filtrar, ordenar y revisar el detalle de cada registro.';

    resumen.getCell('A13').font = {
      size: 10,
      color: { argb: grisTexto }
    };

    resumen.getCell('A13').alignment = {
      wrapText: true,
      vertical: 'middle',
      horizontal: 'left',
      indent: 1
    };

    resumen.getCell('A13').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: verdeAlterno }
    };

    resumen.getRow(13).height = 30;
    resumen.getRow(14).height = 25;

    resumen.mergeCells('A16:H16');

    resumen.getCell('A16').value =
      `Documento generado automáticamente el ${this.obtenerFechaEmision(fecha)}.`;

    resumen.getCell('A16').font = {
      italic: true,
      size: 9,
      color: { argb: 'FF71877C' }
    };

    resumen.getCell('A16').alignment = {
      horizontal: 'right'
    };

    // --------------------------------------------------------
    // HOJA 2: INVENTARIO DETALLADO
    // --------------------------------------------------------

    const inventario = libro.addWorksheet('Inventario', {
      properties: {
  tabColor: { argb: verdeOscuro }
},
      views: [{
        state: 'frozen',
        ySplit: 5,
        activeCell: 'A6',
        showGridLines: false
      }]
    });

    inventario.columns = [
      { key: 'id', width: 10 },
      { key: 'nombre', width: 28 },
      { key: 'descripcion', width: 38 },
      { key: 'presentacion', width: 22 },
      { key: 'concentracion', width: 22 },
      { key: 'unidad', width: 17 },
      { key: 'precio', width: 18 },
      { key: 'stock', width: 18 },
      { key: 'estado', width: 16 }
    ];

    inventario.mergeCells('A1:I1');

    inventario.getCell('A1').value =
      'VETERINARIA ARÉVALO';

    inventario.getCell('A1').font = {
      name: 'Aptos Display',
      size: 17,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };

    inventario.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: verdeOscuro }
    };

    inventario.getCell('A1').alignment = {
      vertical: 'middle',
      indent: 1
    };

    inventario.getRow(1).height = 34;

    inventario.mergeCells('A2:I2');

    inventario.getCell('A2').value =
      'INVENTARIO DETALLADO DE MEDICAMENTOS';

    inventario.getCell('A2').font = {
      size: 11,
      bold: true,
      color: { argb: verdeOscuro }
    };

    inventario.getCell('A2').alignment = {
      vertical: 'middle',
      indent: 1
    };

    inventario.getRow(2).height = 24;

    inventario.mergeCells('A3:I3');

    inventario.getCell('A3').value =
      `Fecha de emisión: ${this.obtenerFechaEmision(fecha)}`;

    inventario.getCell('A3').font = {
      size: 9,
      color: { argb: 'FF71877C' }
    };

    inventario.getCell('A3').alignment = {
      horizontal: 'right'
    };

    inventario.mergeCells('A4:I4');

    inventario.getCell('A4').value =
      `Total de registros: ${total} | Activos: ${activos} | Inactivos: ${inactivos} | Sin stock: ${sinStock}`;

    inventario.getCell('A4').font = {
      size: 9,
      bold: true,
      color: { argb: grisTexto }
    };

    // ENCABEZADOS DE INVENTARIO

    const encabezados = [
      'ID',
      'Medicamento',
      'Descripción',
      'Presentación',
      'Concentración',
      'Unidad de medida',
      'Precio unitario (USD)',
      'Stock disponible',
      'Estado'
    ];

    const filaEncabezados =
      inventario.addRow(encabezados);

    filaEncabezados.height = 30;

    filaEncabezados.eachCell((celda) => {

      celda.font = {
        name: 'Aptos',
        size: 10,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };

      celda.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: verdeOscuro }
      };

      celda.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };

      celda.border = {
        top: {
          style: 'thin',
          color: { argb: verdeOscuro }
        },
        bottom: {
          style: 'thin',
          color: { argb: verdeOscuro }
        }
      };

    });

    // REGISTROS

    medicamentos.forEach((medicamento, indice) => {

      const fila = inventario.addRow([

        medicamento.id,

        String(medicamento.nombre ?? ''),

        String(medicamento.descripcion ?? ''),

        String(medicamento.presentacion ?? ''),

        String(medicamento.concentracion ?? ''),

        String(medicamento.unidadMedida ?? ''),

        this.numero(medicamento.precioUnitario),

        this.numero(medicamento.stockDisponible),

        medicamento.activo ? 'Activo' : 'Inactivo'

      ]);

      fila.height = 25;

      fila.eachCell((celda, numeroColumna: number) => {

        celda.font = {
          name: 'Aptos',
          size: 10,
          color: { argb: grisTexto }
        };

        celda.alignment = {
          vertical: 'middle',
          wrapText:
            numeroColumna === 2 ||
            numeroColumna === 3 ||
            numeroColumna === 4 ||
            numeroColumna === 5
        };

        celda.border = {
          bottom: {
            style: 'thin',
            color: { argb: grisBorde }
          }
        };

        if (indice % 2 === 1) {

          celda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: verdeAlterno }
          };

        }

      });

      // FORMATO DE COLUMNAS

      fila.getCell(1).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      fila.getCell(7).numFmt = '"$"#,##0.00';

      fila.getCell(7).alignment = {
        horizontal: 'right',
        vertical: 'middle'
      };

      fila.getCell(8).numFmt = '#,##0.##';

      fila.getCell(8).alignment = {
        horizontal: 'right',
        vertical: 'middle'
      };

      fila.getCell(9).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      // ALERTA DE STOCK AGOTADO

      if (
        this.numero(medicamento.stockDisponible) <= 0
      ) {

        fila.getCell(8).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rojoClaro }
        };

        fila.getCell(8).font = {
          bold: true,
          color: { argb: rojoTexto }
        };

      }

      // ESTADO ACTIVO

      if (medicamento.activo) {

        fila.getCell(9).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: verdeClaro }
        };

        fila.getCell(9).font = {
          bold: true,
          color: { argb: 'FF16804E' }
        };

      } else {

        fila.getCell(9).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: amarilloClaro }
        };

        fila.getCell(9).font = {
          bold: true,
          color: { argb: amarilloTexto }
        };

      }

    });

    // FILTROS AUTOMÁTICOS

    inventario.autoFilter = {
      from: 'A5',
      to: `I${5 + medicamentos.length}`
    };

    // CONFIGURACIÓN DE IMPRESIÓN

    inventario.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2
      }
    };

    inventario.headerFooter.oddFooter =
      '&LVeterinaria Arévalo - Inventario de medicamentos&R&P de &N';

    inventario.pageSetup.printTitlesRow = '1:5';

    // GENERAR ARCHIVO XLSX

    const buffer = await libro.xlsx.writeBuffer();

    const archivo = new Blob(
      [buffer as BlobPart],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    this.descargarArchivo(
      archivo,
      `inventario-medicamentos-${this.obtenerSelloFecha(fecha)}.xlsx`
    );

  }

  // ========================================================
  // DESCARGAR ARCHIVO
  // ========================================================

  private descargarArchivo(
    archivo: Blob,
    nombre: string
  ): void {

    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = nombre;
    enlace.style.display = 'none';

    document.body.appendChild(enlace);

    enlace.click();

    enlace.remove();

    window.setTimeout(
      () => URL.revokeObjectURL(url),
      1500
    );

  }

  // ========================================================
  // 5. LISTADO DE MEDICAMENTOS
  // ========================================================

  medicamentos: MedicamentoAdmin[] = [];

  // ========================================================
  // 6. ESTADOS DE LA INTERFAZ
  // ========================================================

  cargando = false;

  exportando: 'pdf' | 'excel' | null = null;

  errorCarga = false;

  guardando = false;

  actualizandoEstadoId: number | null = null;

  mensajeError = '';

  mensajeExito = '';

  // ========================================================
  // 7. BUSCADOR Y FILTROS
  // ========================================================

  busqueda = '';

  filtroEstado: FiltroEstado = 'TODOS';

  ordenarPor = 'nombreAsc';

  // ========================================================
  // 8. FORMULARIO
  // ========================================================

  medicamentoForm: FormGroup;

  mostrarFormulario = false;

  medicamentoEditandoId: number | null = null;

  // ========================================================
  // 9. CONSTRUCTOR
  // ========================================================

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authServicio: AuthServicio,
    private notificacionesServicio: NotificacionesServicio,
    private cd: ChangeDetectorRef
  ) {

    this.medicamentoForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      descripcion: [
        '',
        Validators.maxLength(1000)
      ],

      presentacion: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      concentracion: [
        '',
        Validators.maxLength(100)
      ],

      unidadMedida: [
        '',
        [
          Validators.required,
          Validators.maxLength(30)
        ]
      ],

      precioUnitario: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999.99)
        ]
      ],

      stockDisponible: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999.99)
        ]
      ]

    });

  }

  // ========================================================
  // 10. INICIALIZACIÓN
  // ========================================================

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  // ========================================================
  // 11. AUTENTICACIÓN JWT
  // ========================================================

  private obtenerHeaders(): HttpHeaders {

    const token = this.authServicio.obtenerToken();

    return token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      : new HttpHeaders();

  }

  // ========================================================
  // 12. CONSULTAR MEDICAMENTOS
  // GET /api/medicamentos
  // ========================================================

  cargarMedicamentos(
    actualizacionManual: boolean = false
  ): void {

    if (
      this.cargando ||
      this.guardando ||
      this.actualizandoEstadoId !== null
    ) {
      return;
    }

    this.cargando = true;
    this.errorCarga = false;
    this.mensajeError = '';

    this.http.get<MedicamentoAdmin[]>(
      this.apiUrl,
      {
        headers: this.obtenerHeaders()
      }
    ).pipe(
      timeout(this.tiempoMaximo)
    ).subscribe({

      next: respuesta => {

        this.medicamentos = Array.isArray(respuesta)
          ? respuesta
              .filter(medicamento =>
                medicamento !== null &&
                medicamento.id !== null &&
                medicamento.id !== undefined &&
                Number(medicamento.id) > 0 &&
                String(medicamento.nombre ?? '').trim() !== ''
              )
              .sort((a, b) =>
                String(a.nombre).localeCompare(
                  String(b.nombre),
                  'es'
                )
              )
          : [];

        this.cargando = false;
        this.errorCarga = false;

        if (actualizacionManual) {

          this.mensajeExito =
            'El catálogo de medicamentos se actualizó correctamente.';

          this.notificacionesServicio.agregar(
            'Catálogo actualizado',
            'Se consultaron nuevamente los medicamentos registrados.',
            'info'
          );

        }

        this.cd.detectChanges();

      },

      error: error => {

        console.error(
          'Error al consultar medicamentos:',
          error
        );

        this.cargando = false;
        this.errorCarga = true;

        this.mensajeError =
          error?.status === 0
            ? 'No se pudo conectar con Spring Boot. Comprueba que el backend esté encendido.'
            : this.obtenerMensajeError(
                error,
                'No se pudieron cargar los medicamentos.'
              );

        this.notificacionesServicio.agregar(
          'Error al consultar medicamentos',
          this.mensajeError,
          'error'
        );

        this.cd.detectChanges();

      }

    });

  }

  // ========================================================
  // 13. OBTENER MENSAJES DEL BACKEND
  // ========================================================

  private obtenerMensajeError(
    error: any,
    mensajePredeterminado: string
  ): string {

    const respuesta = error?.error;

    if (typeof respuesta === 'string') {
      return respuesta;
    }

    return (
      respuesta?.mensaje ||
      respuesta?.message ||
      mensajePredeterminado
    );

  }

  // ========================================================
  // 14. ESTADÍSTICAS DEL INVENTARIO
  // ========================================================

  get totalMedicamentos(): number {
    return this.medicamentos.length;
  }

  get totalActivos(): number {

    return this.medicamentos.filter(
      medicamento => medicamento.activo === true
    ).length;

  }

  get totalInactivos(): number {

    return this.medicamentos.filter(
      medicamento => medicamento.activo === false
    ).length;

  }

  get totalSinStock(): number {

    return this.medicamentos.filter(
      medicamento =>
        this.numero(medicamento.stockDisponible) === 0
    ).length;

  }

  // ========================================================
  // 15. NORMALIZAR TEXTO
  // ========================================================

  private normalizarTexto(valor: unknown): string {

    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

  }

  // ========================================================
  // 16. BUSCAR, FILTRAR Y ORDENAR
  // ========================================================

  get medicamentosFiltrados(): MedicamentoAdmin[] {

    const texto = this.normalizarTexto(this.busqueda);

    let resultado = this.medicamentos.filter(
      medicamento => {

        const contenido = this.normalizarTexto([
          medicamento.id,
          medicamento.nombre,
          medicamento.descripcion,
          medicamento.presentacion,
          medicamento.concentracion,
          medicamento.unidadMedida
        ].join(' '));

        const coincideBusqueda =
          contenido.includes(texto);

        const coincideEstado =
          this.filtroEstado === 'TODOS' ||
          (
            this.filtroEstado === 'ACTIVOS' &&
            medicamento.activo
          ) ||
          (
            this.filtroEstado === 'INACTIVOS' &&
            !medicamento.activo
          );

        return coincideBusqueda && coincideEstado;

      }
    );

    resultado = [...resultado].sort((a, b) => {

      if (this.ordenarPor === 'precioAsc') {
        return this.numero(a.precioUnitario) -
          this.numero(b.precioUnitario);
      }

      if (this.ordenarPor === 'precioDesc') {
        return this.numero(b.precioUnitario) -
          this.numero(a.precioUnitario);
      }

      if (this.ordenarPor === 'stockAsc') {
        return this.numero(a.stockDisponible) -
          this.numero(b.stockDisponible);
      }

      if (this.ordenarPor === 'stockDesc') {
        return this.numero(b.stockDisponible) -
          this.numero(a.stockDisponible);
      }

      const comparacion =
        String(a.nombre).localeCompare(
          String(b.nombre),
          'es',
          {
            sensitivity: 'base'
          }
        );

      return this.ordenarPor === 'nombreDesc'
        ? -comparacion
        : comparacion;

    });

    return resultado;

  }

  // ========================================================
  // 17. LIMPIAR FILTROS
  // ========================================================

  limpiarFiltros(): void {

    this.busqueda = '';
    this.filtroEstado = 'TODOS';
    this.ordenarPor = 'nombreAsc';

  }

  // ========================================================
  // 18. CONVERTIR VALORES A NÚMERO
  // ========================================================

  numero(
    valor: number | string | null | undefined
  ): number {

    const resultado = Number(valor);

    return Number.isFinite(resultado)
      ? resultado
      : 0;

  }

  // ========================================================
  // 19. VALIDAR CAMPOS DEL FORMULARIO
  // ========================================================

  campoInvalido(nombre: string): boolean {

    const control = this.medicamentoForm.get(nombre);

    return !!control &&
      control.invalid &&
      (
        control.touched ||
        control.dirty
      );

  }

  // ========================================================
  // 20. COMPROBAR OPERACIONES EN CURSO
  // ========================================================

  get hayOperacionEnCurso(): boolean {

    return this.guardando ||
      this.actualizandoEstadoId !== null;

  }

  // ========================================================
  // 21. NUEVO MEDICAMENTO
  // ========================================================

  nuevoMedicamento(): void {

    if (this.hayOperacionEnCurso) {
      return;
    }

    this.medicamentoEditandoId = null;

    this.medicamentoForm.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      concentracion: '',
      unidadMedida: '',
      precioUnitario: 0,
      stockDisponible: 0
    });

    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;

  }

  // ========================================================
  // 22. EDITAR MEDICAMENTO
  // ========================================================

  editarMedicamento(
    medicamento: MedicamentoAdmin
  ): void {

    if (this.hayOperacionEnCurso) {
      return;
    }

    this.medicamentoEditandoId = medicamento.id;

    this.medicamentoForm.reset({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion ?? '',
      presentacion: medicamento.presentacion,
      concentracion: medicamento.concentracion ?? '',
      unidadMedida: medicamento.unidadMedida,
      precioUnitario: this.numero(
        medicamento.precioUnitario
      ),
      stockDisponible: this.numero(
        medicamento.stockDisponible
      )
    });

    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;

  }

  // ========================================================
  // 23. VALIDAR DECIMALES
  // ========================================================

  private decimalValido(valor: unknown): boolean {

    const texto = String(valor ?? '')
      .trim()
      .replace(',', '.');

    return /^\d{1,10}(?:\.\d{1,2})?$/.test(texto);

  }

  // ========================================================
  // 24. GUARDAR MEDICAMENTO
  // ========================================================

  guardarMedicamento(): void {

    if (this.hayOperacionEnCurso || this.cargando) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.medicamentoForm.markAllAsTouched();

    if (this.medicamentoForm.invalid) {

      this.mensajeError =
        'Completa correctamente todos los campos obligatorios.';

      return;

    }

    const valores = this.medicamentoForm.getRawValue();

    if (
      !this.decimalValido(valores.precioUnitario) ||
      !this.decimalValido(valores.stockDisponible)
    ) {

      this.mensajeError =
        'El precio y el stock admiten máximo dos decimales y no pueden ser negativos.';

      return;

    }

    const nombre =
      String(valores.nombre ?? '').trim();

    const presentacion =
      String(valores.presentacion ?? '').trim();

    const unidadMedida =
      String(valores.unidadMedida ?? '').trim();

    if (!nombre || !presentacion || !unidadMedida) {

      this.mensajeError =
        'Nombre, presentación y unidad de medida son obligatorios.';

      return;

    }

    const precio = Number(
      String(valores.precioUnitario).trim().replace(',', '.')
    );

    const stock = Number(
      String(valores.stockDisponible).trim().replace(',', '.')
    );

    if (
      !Number.isFinite(precio) ||
      !Number.isFinite(stock) ||
      precio < 0 ||
      stock < 0
    ) {

      this.mensajeError =
        'El precio y el stock deben ser valores numéricos no negativos.';

      return;

    }

    const datos = {

      nombre,

      descripcion:
        String(valores.descripcion ?? '').trim() || null,

      presentacion,

      concentracion:
        String(valores.concentracion ?? '').trim() || null,

      unidadMedida: unidadMedida.toUpperCase(),

      precioUnitario: precio,

      stockDisponible: stock

    };

    const editando =
      this.medicamentoEditandoId !== null;

    this.guardando = true;

    const peticion = editando

      ? this.http.put(
          `${this.apiUrl}/${this.medicamentoEditandoId}`,
          datos,
          {
            headers: this.obtenerHeaders()
          }
        )

      : this.http.post(
          this.apiUrl,
          datos,
          {
            headers: this.obtenerHeaders()
          }
        );

    peticion.pipe(
      timeout(this.tiempoMaximo)
    ).subscribe({

      next: () => {

        this.guardando = false;
        this.cerrarFormulario();

        this.mensajeExito = editando
          ? 'Medicamento actualizado correctamente.'
          : 'Medicamento registrado correctamente.';

        this.notificacionesServicio.agregar(
          editando
            ? 'Medicamento actualizado'
            : 'Medicamento registrado',
          this.mensajeExito,
          'exito'
        );

        this.cargarMedicamentos();
        this.cd.detectChanges();

      },

      error: error => {

        console.error(
          'Error al guardar medicamento:',
          error
        );

        this.guardando = false;

        this.mensajeError =
          error?.status === 0
            ? 'No se pudo conectar con Spring Boot.'
            : this.obtenerMensajeError(
                error,
                'No se pudo guardar el medicamento.'
              );

        this.notificacionesServicio.agregar(
          'Error al guardar medicamento',
          this.mensajeError,
          'error'
        );

        this.cd.detectChanges();

      }

    });

  }

  // ========================================================
  // 25. ACTIVAR O DESACTIVAR MEDICAMENTO
  // ========================================================

  cambiarEstado(
    medicamento: MedicamentoAdmin
  ): void {

    if (this.hayOperacionEnCurso || this.cargando) {
      return;
    }

    const activar = !medicamento.activo;

    const accion = activar
      ? 'activar'
      : 'desactivar';

    const confirmado = window.confirm(
      `¿Estás seguro de ${accion} el medicamento "${medicamento.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.actualizandoEstadoId = medicamento.id;

    this.mensajeError = '';
    this.mensajeExito = '';

    const endpoint = activar
      ? 'activar'
      : 'desactivar';

    this.http.put(
      `${this.apiUrl}/${medicamento.id}/${endpoint}`,
      {},
      {
        headers: this.obtenerHeaders()
      }
    ).pipe(
      timeout(this.tiempoMaximo)
    ).subscribe({

      next: () => {

        this.actualizandoEstadoId = null;

        this.mensajeExito = activar
          ? 'Medicamento activado correctamente.'
          : 'Medicamento desactivado correctamente.';

        this.notificacionesServicio.agregar(
          activar
            ? 'Medicamento activado'
            : 'Medicamento desactivado',
          `${medicamento.nombre}: ${this.mensajeExito}`,
          'exito'
        );

        this.cargarMedicamentos();
        this.cd.detectChanges();

      },

      error: error => {

        console.error(
          'Error al cambiar estado:',
          error
        );

        this.actualizandoEstadoId = null;

        this.mensajeError =
          error?.status === 0
            ? 'No se pudo conectar con Spring Boot.'
            : this.obtenerMensajeError(
                error,
                'No se pudo modificar el estado del medicamento.'
              );

        this.notificacionesServicio.agregar(
          'Error al cambiar estado',
          this.mensajeError,
          'error'
        );

        this.cd.detectChanges();

      }

    });

  }

  // ========================================================
  // 26. CERRAR FORMULARIO
  // ========================================================

  cerrarFormulario(): void {

    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.medicamentoEditandoId = null;

    this.medicamentoForm.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      concentracion: '',
      unidadMedida: '',
      precioUnitario: 0,
      stockDisponible: 0
    });

  }

  // ========================================================
  // 27. IDENTIFICAR MEDICAMENTOS EN ANGULAR
  // ========================================================

  identificarMedicamento(
    _index: number,
    medicamento: MedicamentoAdmin
  ): number {

    return medicamento.id;

  }

}
