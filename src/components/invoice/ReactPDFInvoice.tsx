// Este archivo no se usa en la demo simplificada - Solo para referencia futura
// import React from 'react'
import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import useInvoiceStore from '../../store/invoiceStore'
import useTemplateStore from '../../store/templateStore'
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations'

// Estilos base para PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    paddingBottom: 15,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  clientInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 5,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  clientDetails: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 3,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 8,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    padding: 8,
    minHeight: 30,
  },
  tableCell: {
    fontSize: 11,
    color: '#333333',
    textAlign: 'left',
  },
  tableCellRight: {
    fontSize: 11,
    color: '#333333',
    textAlign: 'right',
  },
  col1: { width: '50%' },
  col2: { width: '15%' },
  col3: { width: '20%' },
  col4: { width: '15%' },
  totalsSection: {
    marginLeft: 'auto',
    width: 200,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 12,
    color: '#333333',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#333333',
    paddingTop: 8,
    marginTop: 8,
  },
  totalFinalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
})

// Componente del documento PDF
const InvoicePDF = () => {
  const { emisor, receptor } = useInvoiceStore()
  const {
    subtotalFormatted,
    ivaFormatted,
    totalFormatted,
    itemsWithDiscounts,
  } = useInvoiceCalculations()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {/* Logo deshabilitado temporalmente por compatibilidad */}
            {/* {emisor.logo && <Image src={emisor.logo} style={styles.logo} />} */}
            <View style={styles.companyInfo}>
              <Text style={styles.title}>FACTURA</Text>
              <Text style={styles.companyName}>
                {emisor.companyName || 'Tu Empresa'}
              </Text>
              <Text style={styles.companyDetails}>
                {emisor.companyAddress || 'Dirección de tu empresa'}
              </Text>
              <Text style={styles.companyDetails}>
                CUIT: {emisor.companyCuit || 'XX-XXXXXXXX-X'}
              </Text>
              {emisor.companyPhone && (
                <Text style={styles.companyDetails}>
                  Tel: {emisor.companyPhone}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facturar a:</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {receptor.clientName || 'Nombre del Cliente'}
            </Text>
            <Text style={styles.clientDetails}>
              {receptor.clientAddress || 'Dirección del cliente'}
            </Text>
            <Text style={styles.clientDetails}>
              CUIT: {receptor.clientCuit || 'XX-XXXXXXXX-X'}
            </Text>
            {receptor.clientEmail && (
              <Text style={styles.clientDetails}>
                Email: {receptor.clientEmail}
              </Text>
            )}
          </View>
        </View>

        {/* Tabla de productos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>
              Descripción
            </Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Cantidad</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>
              Precio Unit.
            </Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
          </View>

          {itemsWithDiscounts.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {item.description || 'Producto/Servicio'}
              </Text>
              <Text style={[styles.tableCellRight, styles.col2]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCellRight, styles.col3]}>
                ${item.price.toLocaleString()}
              </Text>
              <Text style={[styles.tableCellRight, styles.col4]}>
                ${item.itemTotal.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Subtotal:</Text>
            <Text style={styles.totalText}>{subtotalFormatted}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>IVA (21%):</Text>
            <Text style={styles.totalText}>{ivaFormatted}</Text>
          </View>
          <View style={styles.totalFinal}>
            <Text style={styles.totalFinalText}>TOTAL:</Text>
            <Text style={styles.totalFinalText}>{totalFormatted}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Componente que renderiza el botón de descarga
export const ReactPDFDownloadButton = () => {
  const { emisor, receptor } = useInvoiceStore()

  const fileName = `Factura_${emisor.companyName || 'Empresa'}_${receptor.clientName || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`

  return (
    <PDFDownloadLink
      document={<InvoicePDF />}
      fileName={fileName}
      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generando PDF...</span>
          </>
        ) : (
          <>
            <span>⚡</span>
            <span>PDF Perfecto</span>
          </>
        )
      }
    </PDFDownloadLink>
  )
}

export default InvoicePDF
