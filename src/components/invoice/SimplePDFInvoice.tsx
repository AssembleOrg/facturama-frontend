// import React from 'react'
import {
  Document,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import useInvoiceStore from '../../store/invoiceStore'
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations'

// Estilos simples para PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    color: '#333333',
  },
  table: {
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    paddingVertical: 8,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 11,
    flex: 1,
    textAlign: 'center',
    color: '#333333',
  },
  totals: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-end',
    width: 200,
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
const SimplePDFInvoice = () => {
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
        {/* Título */}
        <Text style={styles.title}>FACTURA</Text>

        {/* Datos del Emisor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresa:</Text>
          <Text style={styles.text}>
            {emisor.companyName || 'Nombre de la empresa'}
          </Text>
          <Text style={styles.text}>
            {emisor.companyAddress || 'Dirección'}
          </Text>
          <Text style={styles.text}>
            CUIT: {emisor.companyCuit || 'XX-XXXXXXXX-X'}
          </Text>
          {emisor.companyPhone && (
            <Text style={styles.text}>Tel: {emisor.companyPhone}</Text>
          )}
        </View>

        {/* Datos del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente:</Text>
          <Text style={styles.text}>
            {receptor.clientName || 'Nombre del cliente'}
          </Text>
          <Text style={styles.text}>
            {receptor.clientAddress || 'Dirección del cliente'}
          </Text>
          <Text style={styles.text}>
            CUIT: {receptor.clientCuit || 'XX-XXXXXXXX-X'}
          </Text>
          {receptor.clientEmail && (
            <Text style={styles.text}>Email: {receptor.clientEmail}</Text>
          )}
        </View>

        {/* Tabla de productos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Descripción</Text>
            <Text style={styles.tableHeaderText}>Cant.</Text>
            <Text style={styles.tableHeaderText}>Precio</Text>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>

          {itemsWithDiscounts.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {item.description || 'Producto'}
              </Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>
                ${item.price.toLocaleString()}
              </Text>
              <Text style={styles.tableCell}>
                ${item.itemTotal.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
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

// Componente del botón de descarga
export const SimplePDFDownloadButton = () => {
  const fileName = `Factura_${Date.now()}.pdf`

  return (
    <PDFDownloadLink
      document={<SimplePDFInvoice />}
      fileName={fileName}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      {({ loading }) =>
        loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generando...</span>
          </>
        ) : (
          <>
            <span>📄</span>
            <span>PDF Simple</span>
          </>
        )
      }
    </PDFDownloadLink>
  )
}

export default SimplePDFInvoice
