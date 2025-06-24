import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

import useInvoiceStore from '../store/invoiceStore'
import useTemplateStore from '../store/templateStore'
import useInvoiceConfigStore from '../store/invoiceConfigStore'
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations'
import InvoiceConfig from '../components/invoice/InvoiceConfig'
import TableColumnsModal from '../components/invoice/TableColumnsModal'
import ProductsModal from '../components/invoice/ProductsModal'
import { Toast, useToast } from '../components/ui/toast'
import { SimplePDFDownloadButton } from '../components/invoice/SimplePDFInvoice'

// Componente para el formulario (columna izquierda)
const InvoiceForm = () => {
  const { emisor, receptor, updateEmisor, updateReceptor } = useInvoiceStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la Factura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Datos del Emisor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            🏢 Tu Empresa
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Nombre de tu empresa"
              value={emisor.companyName}
              onChange={(e) => updateEmisor('companyName', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="Dirección completa"
              value={emisor.companyAddress}
              onChange={(e) => updateEmisor('companyAddress', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="CUIT (XX-XXXXXXXX-X)"
              value={emisor.companyCuit}
              onChange={(e) => updateEmisor('companyCuit', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="Teléfono (opcional)"
              value={emisor.companyPhone}
              onChange={(e) => updateEmisor('companyPhone', e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        {/* Datos del Receptor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            👤 Cliente a Facturar
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Nombre o razón social del cliente"
              value={receptor.clientName}
              onChange={(e) => updateReceptor('clientName', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="Dirección del cliente"
              value={receptor.clientAddress}
              onChange={(e) => updateReceptor('clientAddress', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="CUIT/CUIL del cliente"
              value={receptor.clientCuit}
              onChange={(e) => updateReceptor('clientCuit', e.target.value)}
              className="h-11"
            />
            <Input
              placeholder="Email del cliente (opcional)"
              value={receptor.clientEmail}
              onChange={(e) => updateReceptor('clientEmail', e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para la vista previa (columna centro)
const InvoicePreview = () => {
  const { emisor, receptor } = useInvoiceStore()
  const { selectedTemplate } = useTemplateStore()
  const {
    tableFields,
    showDiscount,
    showPaymentMethod,
    paymentMethods,
    ivaType,
    globalDiscount,
  } = useInvoiceConfigStore()
  const {
    subtotalFormatted,
    ivaFormatted,
    totalFormatted,
    globalDiscountFormatted,
    itemsWithDiscounts,
  } = useInvoiceCalculations()

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Vista Previa</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          id="invoice-preview"
          className={`invoice-preview p-12 border rounded-lg shadow-sm bg-white template-${selectedTemplate} min-h-[800px]`}
        >
          {/* Header de la factura - Logo y empresa arriba izquierda */}
          <div className="invoice-header mb-8">
            <div className="flex items-start gap-4 mb-6">
              {emisor.logo && (
                <img
                  src={emisor.logo}
                  alt="Logo empresa"
                  className="company-logo w-40 h-40 object-contain"
                />
              )}
              <div>
                {/* Solo mostrar FACTURA si no hay logo */}
                {!emisor.logo && (
                  <h1 className="text-3xl font-bold mb-2">FACTURA</h1>
                )}
                <div className={emisor.logo ? 'mt-2' : ''}>
                  <p className="text-lg font-semibold">
                    {emisor.companyName || 'Tu Empresa'}
                  </p>
                  <p className="text-gray-600">
                    {emisor.companyAddress || 'Dirección de tu empresa'}
                  </p>
                  <p className="text-gray-600">
                    CUIT: {emisor.companyCuit || 'XX-XXXXXXXX-X'}
                  </p>
                  {emisor.companyPhone && (
                    <p className="text-gray-600">Tel: {emisor.companyPhone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Datos del cliente + Forma de pago */}
          <div className="mb-8 flex justify-between items-start">
            {/* Cliente a la izquierda */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">Facturar a:</h3>
              <div className="client-section">
                <p className="font-semibold text-base">
                  {receptor.clientName || 'Nombre del Cliente'}
                </p>
                <p className="text-gray-600">
                  {receptor.clientAddress || 'Dirección del cliente'}
                </p>
                <p className="text-gray-600">
                  CUIT: {receptor.clientCuit || 'XX-XXXXXXXX-X'}
                </p>
                {receptor.clientEmail && (
                  <p className="text-gray-600">Email: {receptor.clientEmail}</p>
                )}
              </div>
            </div>

            {/* Forma de pago a la derecha */}
            {showPaymentMethod && (
              <div className="w-72 bg-gray-50 p-4 rounded-lg ml-8">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                  Forma de Pago:
                </h4>
                <div className="space-y-2">
                  {paymentMethods.map((pm, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {pm.method || 'Método'}
                      </span>
                      <span className="font-medium">
                        ${pm.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabla de items dinámica */}
          <div className="mb-6">
            <table className="items-table">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  {tableFields.showCode && (
                    <th className="text-left py-2 font-semibold w-20">
                      Código
                    </th>
                  )}
                  {tableFields.showDescription && (
                    <th className="text-left py-2 font-semibold">
                      Descripción
                    </th>
                  )}
                  {tableFields.showQuantity && (
                    <th className="text-center py-2 font-semibold w-20">
                      Cant.
                    </th>
                  )}
                  {tableFields.showUnitPrice && (
                    <th className="text-right py-2 font-semibold w-24">
                      Precio
                    </th>
                  )}
                  {showDiscount && tableFields.showDiscount && (
                    <th className="text-right py-2 font-semibold w-20">
                      Desc.
                    </th>
                  )}
                  {tableFields.showTotal && (
                    <th className="text-right py-2 font-semibold w-24">
                      Total
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {itemsWithDiscounts.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    {tableFields.showCode && (
                      <td className="py-3">{item.code || '-'}</td>
                    )}
                    {tableFields.showDescription && (
                      <td className="py-3">
                        {item.description || 'Descripción del servicio'}
                      </td>
                    )}
                    {tableFields.showQuantity && (
                      <td className="py-3 text-center">{item.quantity}</td>
                    )}
                    {tableFields.showUnitPrice && (
                      <td className="py-3 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                    )}
                    {showDiscount && tableFields.showDiscount && (
                      <td className="py-3 text-right">
                        {item.discount > 0 ? `${item.discount}%` : '-'}
                      </td>
                    )}
                    {tableFields.showTotal && (
                      <td className="py-3 text-right">
                        ${item.itemSubtotal.toFixed(2)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales con descuentos */}
          <div className="flex justify-end">
            <div className="totals-section">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{subtotalFormatted}</span>
              </div>

              {showDiscount && globalDiscount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Descuento Global ({globalDiscount}%):</span>
                  <span>-{globalDiscountFormatted}</span>
                </div>
              )}

              <div className="flex justify-between py-2">
                <span>
                  IVA (
                  {ivaType === 'exento'
                    ? '0'
                    : ivaType === 'reducido'
                      ? '10.5'
                      : '21'}
                  %):
                </span>
                <span>{ivaFormatted}</span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
                <span>Total:</span>
                <span>{totalFormatted}</span>
              </div>
            </div>
          </div>

          {/* Forma de pago - ELIMINADA (solo aparece al lado de "Facturar a:") */}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para items mejorado
const ItemsSection = () => {
  const { items } = useInvoiceStore()

  return (
    <div className="space-y-4">
      {/* Botones de configuración arriba */}
      <div className="flex justify-end gap-2">
        <ProductsModal />
        <TableColumnsModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📦 Productos y Servicios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {/* Vista simplificada - Usar modal para edición completa */}
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="space-y-3">
              <div className="text-2xl">📦</div>
              <div>
                <p className="font-medium text-gray-900">
                  {items.length} producto{items.length !== 1 ? 's' : ''}{' '}
                  agregado{items.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Usa el modal para gestionar tus productos con mayor comodidad
                </p>
              </div>

              {/* Preview rápido de items */}
              {items.length > 0 && (
                <div className="mt-4 space-y-2">
                  {items.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className="text-xs text-gray-600 bg-white px-3 py-1 rounded border"
                    >
                      {item.description || `Producto ${index + 1}`} -
                      {item.quantity}x ${item.price} = $
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{items.length - 3} producto
                      {items.length - 3 !== 1 ? 's' : ''} más...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para subir logo
const LogoUploader = () => {
  const { emisor, updateEmisor } = useInvoiceStore()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 2MB.')
        return
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        updateEmisor('logo', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    updateEmisor('logo', null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Empresarial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            {emisor.logo ? (
              <div className="space-y-2">
                <img
                  src={emisor.logo}
                  alt="Logo"
                  className="max-h-20 mx-auto object-contain"
                />
                <p className="text-sm text-gray-600">Click para cambiar</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <p className="font-medium">Subir Logo</p>
                <p className="text-sm text-gray-500">PNG, JPG hasta 2MB</p>
              </div>
            )}
          </label>
          {emisor.logo && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeLogo}
              className="mt-2"
            >
              Quitar Logo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente selector de plantillas
const TemplateSelector = () => {
  const { selectedTemplate, availableTemplates, setTemplate } =
    useTemplateStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plantillas</CardTitle>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Demo:</strong> Solo la plantilla Clásica genera PDFs
            completos. Las otras plantillas requieren backend con Puppeteer para
            PDFs de alta fidelidad.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableTemplates.map((template) => (
          <div
            key={template.id}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${template.id !== 'classic' ? 'opacity-75' : ''}`}
            onClick={() => setTemplate(template.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Componente principal
function HomePage() {
  const { toast, hideToast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Facturama MVP - Demo
            </h1>
            <div className="flex gap-3">
              <SimplePDFDownloadButton />
            </div>
          </div>
        </div>
      </header>

      {/* Layout Full Width - Profesional */}
      <div className="mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1800px] mx-auto">
          {/* Columna 1: Formulario + Logo (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <LogoUploader />
            <InvoiceForm />
            <ItemsSection />
          </div>

          {/* Columna 2: Vista Previa Full (7 cols) */}
          <div className="lg:col-span-7">
            <InvoicePreview />
          </div>

          {/* Columna 3: Configuraciones (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <TemplateSelector />
            <InvoiceConfig />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
