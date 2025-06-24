import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface InvoiceItem {
  id: number
  code: string
  description: string
  quantity: number
  price: number
  discount: number // Porcentaje de descuento por item
}

interface Emisor {
  companyName: string
  companyAddress: string
  companyCuit: string
  companyPhone: string
  logo: string | null
}

interface Receptor {
  clientName: string
  clientAddress: string
  clientCuit: string
  clientEmail: string
}

interface InvoiceStore {
  // Estado
  emisor: Emisor
  receptor: Receptor
  items: Array<InvoiceItem>

  // Acciones Emisor
  updateEmisor: (field: keyof Emisor, value: string | null) => void

  // Acciones Receptor
  updateReceptor: (field: keyof Receptor, value: string) => void

  // Acciones Items
  updateItem: (
    id: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => void
  addItem: () => void
  removeItem: (id: number) => void

  // Acciones Globales
  resetInvoice: () => void
}

const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    (set) => ({
      // === ESTADO INICIAL ===
      emisor: {
        companyName: 'Mi Empresa S.A.',
        companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
        companyCuit: '20-12345678-9',
        companyPhone: '+54 11 4567-8900',
        logo: null,
      },

      receptor: {
        clientName: 'Cliente Demo S.R.L.',
        clientAddress: 'Florida 456, CABA, Argentina',
        clientCuit: '30-87654321-2',
        clientEmail: 'cliente@demo.com',
      },

      items: [
        {
          id: 1,
          code: 'SERV001',
          description: 'Desarrollo de sitio web',
          quantity: 1,
          price: 50000,
          discount: 0,
        },
        {
          id: 2,
          code: 'SERV002',
          description: 'Mantenimiento mensual',
          quantity: 3,
          price: 15000,
          discount: 10,
        },
      ],

      // === ACCIONES EMISOR ===
      updateEmisor: (field, value) =>
        set(
          (state) => ({
            emisor: { ...state.emisor, [field]: value },
          }),
          false,
          'updateEmisor',
        ),

      // === ACCIONES RECEPTOR ===
      updateReceptor: (field, value) =>
        set(
          (state) => ({
            receptor: { ...state.receptor, [field]: value },
          }),
          false,
          'updateReceptor',
        ),

      // === ACCIONES ITEMS ===
      updateItem: (id, field, value) =>
        set(
          (state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, [field]: value } : item,
            ),
          }),
          false,
          'updateItem',
        ),

      addItem: () =>
        set(
          (state) => ({
            items: [
              ...state.items,
              {
                id: Date.now(),
                code: '',
                description: '',
                quantity: 1,
                price: 0,
                discount: 0,
              },
            ],
          }),
          false,
          'addItem',
        ),

      removeItem: (id) =>
        set(
          (state) => ({
            items: state.items.filter((item) => item.id !== id),
          }),
          false,
          'removeItem',
        ),

      // === ACCIONES GLOBALES ===
      resetInvoice: () =>
        set(
          {
            emisor: {
              companyName: '',
              companyAddress: '',
              companyCuit: '',
              companyPhone: '',
              logo: null,
            },
            receptor: {
              clientName: '',
              clientAddress: '',
              clientCuit: '',
              clientEmail: '',
            },
            items: [
              {
                id: 1,
                code: '',
                description: '',
                quantity: 1,
                price: 0,
                discount: 0,
              },
            ],
          },
          false,
          'resetInvoice',
        ),
    }),
    { name: 'invoice-store' },
  ),
)

export default useInvoiceStore
