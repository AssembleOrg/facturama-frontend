import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { NumberInput } from '../ui/number-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Card, CardContent } from '../ui/card'
import useInvoiceStore from '../../store/invoiceStore'
import useInvoiceConfigStore from '../../store/invoiceConfigStore'

const ProductsModal = () => {
  const { items, updateItem, addItem, removeItem } = useInvoiceStore()
  const { tableFields, showDiscount } = useInvoiceConfigStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          📝 Gestionar Productos
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📦 Gestión de Productos y Servicios
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Administra tus productos con espacio completo. Todos los cambios se
            reflejan automáticamente en la factura.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Header de la tabla */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {tableFields.showCode && <div className="col-span-2">Código</div>}
              <div
                className={`${tableFields.showCode ? 'col-span-4' : 'col-span-6'}`}
              >
                Descripción del Producto/Servicio
              </div>
              <div className="col-span-2">Cantidad</div>
              <div className="col-span-2">Precio Unitario</div>
              {showDiscount && tableFields.showDiscount && (
                <div className="col-span-1">Descuento %</div>
              )}
              <div className="col-span-1 text-center">Acciones</div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <Card key={item.id} className="border-l-4 border-l-blue-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    {/* Código */}
                    {tableFields.showCode && (
                      <div className="col-span-2 space-y-2">
                        <label className="text-xs font-medium text-gray-500 block">
                          Código/SKU
                        </label>
                        <Input
                          placeholder="SKU001"
                          value={item.code}
                          onChange={(e) =>
                            updateItem(item.id, 'code', e.target.value)
                          }
                          className="h-10"
                        />
                      </div>
                    )}

                    {/* Descripción */}
                    <div
                      className={`${tableFields.showCode ? 'col-span-4' : 'col-span-6'} space-y-2`}
                    >
                      <label className="text-xs font-medium text-gray-500 block">
                        Descripción
                      </label>
                      <Input
                        placeholder="Ej: Consultoría de Marketing Digital - Paquete Premium"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, 'description', e.target.value)
                        }
                        className="h-10"
                      />
                    </div>

                    {/* Cantidad */}
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-medium text-gray-500 block">
                        Cantidad
                      </label>
                      <NumberInput
                        placeholder="1"
                        value={item.quantity}
                        onValueChange={(value) =>
                          updateItem(item.id, 'quantity', value)
                        }
                        className="h-10"
                        min="0"
                      />
                    </div>

                    {/* Precio */}
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-medium text-gray-500 block">
                        Precio Unitario
                      </label>
                      <NumberInput
                        placeholder="0"
                        value={item.price}
                        onValueChange={(value) =>
                          updateItem(item.id, 'price', value)
                        }
                        className="h-10"
                        min="0"
                        step="1"
                      />
                    </div>

                    {/* Descuento */}
                    {showDiscount && tableFields.showDiscount && (
                      <div className="col-span-1 space-y-2">
                        <label className="text-xs font-medium text-gray-500 block">
                          Desc. %
                        </label>
                        <NumberInput
                          placeholder="0"
                          value={item.discount}
                          onValueChange={(value) =>
                            updateItem(item.id, 'discount', value)
                          }
                          className="h-10"
                          min="0"
                          max="100"
                        />
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="col-span-1 space-y-2">
                      <label className="text-xs font-medium text-gray-500 block opacity-0">
                        .
                      </label>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Preview del total del item */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total del item:</span>
                      <span className="font-medium">
                        $
                        {(
                          item.quantity *
                          item.price *
                          (1 - item.discount / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Botón agregar */}
            <Button
              onClick={addItem}
              variant="outline"
              className="w-full h-14 text-base border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
            >
              + Agregar Nuevo Producto/Servicio
            </Button>
          </div>
        </div>

        {/* Footer con resumen */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {items.length} producto{items.length !== 1 ? 's' : ''} • Total: $
              {items
                .reduce(
                  (sum, item) =>
                    sum +
                    item.quantity * item.price * (1 - item.discount / 100),
                  0,
                )
                .toFixed(2)}
            </div>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              ✅ Continuar con la Factura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductsModal
