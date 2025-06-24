import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import useInvoiceStore from '../store/invoiceStore'

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { emisor, receptor } = useInvoiceStore()

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Buscar el elemento de la vista previa
      const element = document.getElementById('invoice-preview')
      if (!element) {
        throw new Error('No se encontró el elemento de vista previa')
      }

      // Configurar html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor calidad
        useCORS: true, // Para manejar imágenes
        allowTaint: true,
        backgroundColor: null, // Transparente
        logging: false, // Sin logs en consola
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      // Crear PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('portrait', 'mm', 'a4')

      // Calcular dimensiones para ajustar al A4
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Mantener proporción
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio

      // Centrar la imagen
      const x = (pdfWidth - finalWidth) / 2
      const y = (pdfHeight - finalHeight) / 2

      // Agregar imagen al PDF
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

      // Generar nombre del archivo
      const clientName = receptor.clientName || 'Cliente'
      const companyName = emisor.companyName || 'Empresa'
      const date = new Date().toISOString().split('T')[0]
      const fileName = `Factura_${companyName}_${clientName}_${date}.pdf`

      // Descargar PDF
      pdf.save(fileName)

      return true
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generatePDF,
    isGenerating,
  }
}
