import useInvoiceStore from '../../store/invoiceStore'
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations'

export const BasicInvoicePreview = () => {
  const { emisor, receptor, items } = useInvoiceStore()
  const {
    subtotalFormatted,
    ivaFormatted,
    totalFormatted,
    itemsWithDiscounts,
  } = useInvoiceCalculations()

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      padding: '30px',
      width: '794px', // A4 width en pixels (210mm * 3.78)
      height: '1123px', // A4 height en pixels (297mm * 3.78)
      border: '1px solid #cccccc',
      borderRadius: '8px',
      margin: '0 auto',
      boxSizing: 'border-box' as const,
      overflow: 'hidden',
    },
    header: {
      marginBottom: '30px',
      borderBottom: '2px solid #333333',
      paddingBottom: '20px',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px',
      marginBottom: '20px',
    },
    logo: {
      width: '120px',
      height: '120px',
      objectFit: 'contain' as const,
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0 0 15px 0',
      color: '#333333',
    },
    companyInfo: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333333',
    },
    section: {
      marginBottom: '25px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333333',
    },
    clientInfo: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '5px',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: '20px',
    },
    tableHeader: {
      backgroundColor: '#333333',
      color: '#ffffff',
    },
    tableCell: {
      padding: '10px',
      border: '1px solid #cccccc',
      fontSize: '14px',
    },
    tableCellRight: {
      padding: '10px',
      border: '1px solid #cccccc',
      fontSize: '14px',
      textAlign: 'right' as const,
    },
    totalsSection: {
      marginLeft: 'auto',
      width: '300px',
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '5px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      fontSize: '14px',
    },
    totalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      fontSize: '16px',
      fontWeight: 'bold',
      borderTop: '2px solid #333333',
      marginTop: '10px',
    },
  }

  return (
    <div id="basic-invoice-preview" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          {emisor.logo && (
            <img src={emisor.logo} alt="Logo empresa" style={styles.logo} />
          )}
          <div>
            {!emisor.logo && <h1 style={styles.title}>FACTURA</h1>}
            <div style={styles.companyInfo}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {emisor.companyName || 'Tu Empresa'}
              </div>
              <div>{emisor.companyAddress || 'Dirección de tu empresa'}</div>
              <div>CUIT: {emisor.companyCuit || 'XX-XXXXXXXX-X'}</div>
              {emisor.companyPhone && <div>Tel: {emisor.companyPhone}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Cliente */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Facturar a:</div>
        <div style={styles.clientInfo}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {receptor.clientName || 'Nombre del Cliente'}
          </div>
          <div>{receptor.clientAddress || 'Dirección del cliente'}</div>
          <div>CUIT: {receptor.clientCuit || 'XX-XXXXXXXX-X'}</div>
          {receptor.clientEmail && <div>Email: {receptor.clientEmail}</div>}
        </div>
      </div>

      {/* Tabla de productos */}
      <div style={styles.section}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableCell}>Descripción</th>
              <th style={styles.tableCellRight}>Cantidad</th>
              <th style={styles.tableCellRight}>Precio Unit.</th>
              <th style={styles.tableCellRight}>Total</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithDiscounts.map((item) => (
              <tr key={item.id}>
                <td style={styles.tableCell}>
                  {item.description || 'Producto/Servicio'}
                </td>
                <td style={styles.tableCellRight}>{item.quantity}</td>
                <td style={styles.tableCellRight}>
                  ${item.price.toLocaleString()}
                </td>
                <td style={styles.tableCellRight}>
                  ${item.itemTotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div style={styles.totalsSection}>
        <div style={styles.totalRow}>
          <span>Subtotal:</span>
          <span>{subtotalFormatted}</span>
        </div>
        <div style={styles.totalRow}>
          <span>IVA (21%):</span>
          <span>{ivaFormatted}</span>
        </div>
        <div style={styles.totalFinal}>
          <span>TOTAL:</span>
          <span>{totalFormatted}</span>
        </div>
      </div>
    </div>
  )
}
