import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Card, CardContent } from '../ui/card'
import useInvoiceConfigStore from '../../store/invoiceConfigStore'

const TableColumnsModal = () => {
  const { tableFields, toggleTableField } = useInvoiceConfigStore()
  const [isOpen, setIsOpen] = useState(false)

  // Solo las columnas opcionales que realmente importan
  const columns = [
    {
      key: 'showCode',
      label: 'Código del Producto',
      description: 'SKU o código interno del producto',
      icon: '🏷️',
    },
    {
      key: 'showDiscount',
      label: 'Descuento por Item',
      description: 'Descuento aplicado individualmente por producto (%)',
      icon: '🏷️',
      note: 'Requiere activar descuentos en configuración',
    },
  ]

  const enabledCount = columns.filter(
    (col) => tableFields[col.key as keyof typeof tableFields],
  ).length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          ⚙️ Columnas Opcionales
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📋 Configurar Columnas de la Tabla
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Personaliza qué información mostrar en tu factura.
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {columns.map((column) => {
            const isEnabled =
              tableFields[column.key as keyof typeof tableFields]

            return (
              <Card
                key={column.key}
                className={`transition-all cursor-pointer ${
                  isEnabled
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  toggleTableField(column.key as keyof typeof tableFields)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{column.icon}</span>
                      <div>
                        <h4 className="font-medium">{column.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {column.description}
                        </p>
                        {'note' in column && column.note && (
                          <p className="text-xs text-amber-600 mt-1">
                            💡 {column.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEnabled ? (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {enabledCount} de {columns.length} columnas opcionales activas
          </div>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            ✅ Aplicar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TableColumnsModal
