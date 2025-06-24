import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { NumberInput } from '../ui/number-input'
import useInvoiceConfigStore from '../../store/invoiceConfigStore'

const InvoiceConfig = () => {
  const {
    ivaRate,
    ivaType,
    showDiscount,
    globalDiscount,
    showPaymentMethod,
    paymentMethods,
    tableFields,
    setIvaRate,
    toggleDiscount,
    setGlobalDiscount,
    togglePaymentMethod,
    updatePaymentMethod,
    addPaymentMethod,
    removePaymentMethod,
    toggleTableField,
  } = useInvoiceConfigStore()

  const ivaOptions = [
    { rate: 0, type: 'exento' as const, label: 'Exento (0%)' },
    { rate: 0.105, type: 'reducido' as const, label: 'Reducido (10.5%)' },
    { rate: 0.21, type: 'general' as const, label: 'General (21%)' },
  ]

  return (
    <div className="space-y-6">
      {/* Configuración de IVA */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de IVA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ivaOptions.map((option) => (
            <div
              key={option.type}
              className={`p-3 border rounded cursor-pointer transition-colors ${
                ivaType === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setIvaRate(option.rate, option.type)}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {ivaType === option.type && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configuración de Descuentos */}
      <Card>
        <CardHeader>
          <CardTitle>Descuentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Mostrar descuentos</span>
            <Button
              variant={showDiscount ? 'default' : 'outline'}
              size="sm"
              onClick={toggleDiscount}
            >
              {showDiscount ? 'Activado' : 'Desactivado'}
            </Button>
          </div>

          {showDiscount && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Descuento Global (%)
              </label>
              <NumberInput
                value={globalDiscount}
                onValueChange={setGlobalDiscount}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Campos de Tabla - Movido al modal */}

      {/* Configuración de Forma de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Forma de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Mostrar forma de pago</span>
            <Button
              variant={showPaymentMethod ? 'default' : 'outline'}
              size="sm"
              onClick={togglePaymentMethod}
            >
              {showPaymentMethod ? 'Activado' : 'Desactivado'}
            </Button>
          </div>

          {showPaymentMethod && (
            <div className="space-y-3">
              {paymentMethods.map((pm, index) => (
                <div
                  key={index}
                  className="space-y-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Método {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentMethod(index)}
                      disabled={paymentMethods.length === 1}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Efectivo, Transferencia, Tarjeta..."
                      value={pm.method}
                      onChange={(e) =>
                        updatePaymentMethod(index, 'method', e.target.value)
                      }
                      className="w-full"
                    />

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Monto ($)
                      </label>
                      <NumberInput
                        placeholder="0"
                        value={pm.amount}
                        onValueChange={(value) =>
                          updatePaymentMethod(index, 'amount', value)
                        }
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addPaymentMethod} variant="outline" size="sm">
                + Agregar Método
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Layout Options - Eliminado (siempre emisor junto al logo) */}
    </div>
  )
}

export default InvoiceConfig
