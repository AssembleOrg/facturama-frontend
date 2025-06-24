import { useMemo } from 'react'
import useInvoiceStore from '../store/invoiceStore'
import useInvoiceConfigStore from '../store/invoiceConfigStore'

export const useInvoiceCalculations = () => {
  const items = useInvoiceStore((state) => state.items)
  const { ivaRate, showDiscount, globalDiscount } = useInvoiceConfigStore()

  return useMemo(() => {
    // Calcular subtotal con descuentos por item
    const itemsWithDiscounts = items.map((item) => {
      const itemTotal = Number(item.quantity) * Number(item.price)
      const itemDiscount = showDiscount
        ? (itemTotal * Number(item.discount)) / 100
        : 0
      const itemSubtotal = itemTotal - itemDiscount

      return {
        ...item,
        itemTotal,
        itemDiscount,
        itemSubtotal,
      }
    })

    const subtotalBeforeGlobalDiscount = itemsWithDiscounts.reduce(
      (sum, item) => {
        return sum + item.itemSubtotal
      },
      0,
    )

    // Aplicar descuento global
    const globalDiscountAmount = showDiscount
      ? (subtotalBeforeGlobalDiscount * globalDiscount) / 100
      : 0
    const subtotal = subtotalBeforeGlobalDiscount - globalDiscountAmount

    const iva = subtotal * ivaRate
    const total = subtotal + iva

    return {
      subtotal: Number(subtotal.toFixed(2)),
      iva: Number(iva.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemsCount: items.length,
      globalDiscountAmount: Number(globalDiscountAmount.toFixed(2)),
      itemsWithDiscounts,
      // Formatters para mostrar
      subtotalFormatted: `$${subtotal.toFixed(2)}`,
      ivaFormatted: `$${iva.toFixed(2)}`,
      totalFormatted: `$${total.toFixed(2)}`,
      globalDiscountFormatted: `$${globalDiscountAmount.toFixed(2)}`,
    }
  }, [items, ivaRate, showDiscount, globalDiscount])
}
