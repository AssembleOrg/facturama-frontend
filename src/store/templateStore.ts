import { create } from 'zustand'

interface Template {
  id: string
  name: string
  className: string
  description: string
}

interface TemplateStore {
  selectedTemplate: string
  availableTemplates: Array<Template>
  setTemplate: (templateId: string) => void
}

const useTemplateStore = create<TemplateStore>((set) => ({
  selectedTemplate: 'minimal',

  availableTemplates: [
    {
      id: 'modern',
      name: 'Moderno',
      className: 'template-modern',
      description: 'Diseño moderno con gradientes y colores vibrantes',
    },
    {
      id: 'classic',
      name: 'Clásico',
      className: 'template-classic',
      description: 'Diseño tradicional y profesional',
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      className: 'template-minimal',
      description: 'Diseño limpio y elegante',
    },
  ],

  setTemplate: (templateId) => set({ selectedTemplate: templateId }),
}))

export default useTemplateStore
