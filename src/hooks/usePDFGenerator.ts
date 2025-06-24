import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import useInvoiceStore from '../store/invoiceStore'

interface PDFGeneratorOptions {
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void
}

export const usePDFGenerator = (options?: PDFGeneratorOptions) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { emisor, receptor, items } = useInvoiceStore()
  const { showToast } = options || {}

  const validateInvoiceData = () => {
    const errors = []

    if (!emisor.companyName.trim()) {
      errors.push('Nombre de la empresa es requerido')
    }

    if (!receptor.clientName.trim()) {
      errors.push('Nombre del cliente es requerido')
    }

    const validItems = items.filter(
      (item) => item.description.trim() && item.quantity > 0 && item.price > 0,
    )

    if (validItems.length === 0) {
      errors.push('Debe agregar al menos un producto/servicio válido')
    }

    return errors
  }

  // Solución simple: usar configuración básica que evite OKLCH
  const generatePDF = async () => {
    // Validar datos antes de generar
    const validationErrors = validateInvoiceData()
    if (validationErrors.length > 0) {
      const errorMessage = `Por favor complete los siguientes campos:\n\n${validationErrors.join('\n')}`
      if (showToast) {
        showToast(errorMessage, 'error')
      } else {
        alert(errorMessage)
      }
      return false
    }

    setIsGenerating(true)

    try {
      // Buscar el elemento de la vista previa (primero intentar la básica, luego la normal)
      let element = document.getElementById('basic-invoice-preview')
      if (!element) {
        element = document.getElementById('invoice-preview')
      }
      if (!element) {
        throw new Error('No se encontró el elemento de vista previa')
      }

      // Configuración para tamaño A4 exacto
      const canvas = await html2canvas(element, {
        scale: 3,
        width: 794, // A4 width en pixels (210mm * 3.78)
        height: 1123, // A4 height en pixels (297mm * 3.78)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (el) => {
          return el.tagName === 'SCRIPT' || el.tagName === 'STYLE'
        },
      })

      // Crear PDF con tamaño exacto
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('portrait', 'mm', 'a4')

      // Usar todo el espacio A4 (sin márgenes)
      const pdfWidth = 210 // A4 width en mm
      const pdfHeight = 297 // A4 height en mm

      // Agregar imagen ocupando toda la página
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST')

      // Nombre del archivo simple
      const fileName = `Factura_${Date.now()}.pdf`

      // Descargar PDF
      pdf.save(fileName)

      // Feedback positivo
      if (showToast) {
        showToast('PDF generado exitosamente! 🎉', 'success')
      } else {
        alert('✅ PDF generado exitosamente!')
      }

      return true
    } catch (error) {
      console.error('Error generando PDF:', error)

      const errorMessage =
        'Error al generar el PDF para la demo. En producción usaremos el backend con Puppeteer.'

      if (showToast) {
        showToast(errorMessage, 'error')
      } else {
        alert(errorMessage)
      }
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generatePDF,
    isGenerating,
    validateInvoiceData,
  }
}
