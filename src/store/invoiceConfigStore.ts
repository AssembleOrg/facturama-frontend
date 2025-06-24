import { create } from 'zustand'

interface InvoiceConfig {
  // Configuración de IVA
  ivaRate: number // 0, 0.105, 0.21
  ivaType: 'exento' | 'reducido' | 'general'

  // Configuración de descuentos
  showDiscount: boolean
  globalDiscount: number // Porcentaje de descuento global

  // Configuración de forma de pago
  showPaymentMethod: boolean
  paymentMethods: Array<{
    method: string
    amount: number
    percentage: number
  }>

  // Configuración de campos de tabla
  tableFields: {
    showCode: boolean
    showDescription: boolean
    showQuantity: boolean
    showUnitPrice: boolean
    showDiscount: boolean
    showTotal: boolean
  }

  // Layout configuración (eliminado - siempre datos emisor junto al logo)
}

interface InvoiceConfigStore extends InvoiceConfig {
  // Acciones IVA
  setIvaRate: (rate: number, type: 'exento' | 'reducido' | 'general') => void

  // Acciones descuentos
  toggleDiscount: () => void
  setGlobalDiscount: (discount: number) => void

  // Acciones forma de pago
  togglePaymentMethod: () => void
  updatePaymentMethod: (
    index: number,
    field: string,
    value: string | number,
  ) => void
  addPaymentMethod: () => void
  removePaymentMethod: (index: number) => void

  // Acciones campos de tabla
  toggleTableField: (field: keyof InvoiceConfig['tableFields']) => void

  // Acciones layout (eliminado)

  // Reset
  resetConfig: () => void
}

const defaultConfig: InvoiceConfig = {
  ivaRate: 0.21,
  ivaType: 'general',
  showDiscount: false,
  globalDiscount: 0,
  showPaymentMethod: false,
  paymentMethods: [{ method: 'Efectivo', amount: 0, percentage: 0 }],
  tableFields: {
    showCode: false,
    showDescription: true,
    showQuantity: true,
    showUnitPrice: true,
    showDiscount: false,
    showTotal: true,
  },
}

const useInvoiceConfigStore = create<InvoiceConfigStore>((set, get) => ({
  ...defaultConfig,

  // === ACCIONES IVA ===
  setIvaRate: (rate, type) => set({ ivaRate: rate, ivaType: type }),

  // === ACCIONES DESCUENTOS ===
  toggleDiscount: () => set((state) => ({ showDiscount: !state.showDiscount })),
  setGlobalDiscount: (discount) => set({ globalDiscount: discount }),

  // === ACCIONES FORMA DE PAGO ===
  togglePaymentMethod: () =>
    set((state) => ({ showPaymentMethod: !state.showPaymentMethod })),

  updatePaymentMethod: (index, field, value) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.map((pm, i) =>
        i === index ? { ...pm, [field]: value } : pm,
      ),
    })),

  addPaymentMethod: () =>
    set((state) => ({
      paymentMethods: [
        ...state.paymentMethods,
        { method: '', amount: 0, percentage: 0 },
      ],
    })),

  removePaymentMethod: (index) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.filter((_, i) => i !== index),
    })),

  // === ACCIONES CAMPOS TABLA ===
  toggleTableField: (field) =>
    set((state) => ({
      tableFields: {
        ...state.tableFields,
        [field]: !state.tableFields[field],
      },
    })),

  // === ACCIONES LAYOUT (eliminado) ===

  // === RESET ===
  resetConfig: () => set(defaultConfig),
}))

export default useInvoiceConfigStore
