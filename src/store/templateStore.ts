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
  selectedTemplate: 'classic',

  availableTemplates: [
    {
      id: 'classic',
      name: '✅ Clásico',
      className: 'template-classic',
      description: 'Diseño tradicional - PDF funcional',
    },
    {
      id: 'modern',
      name: '🚧 Moderno',
      className: 'template-modern',
      description: 'Requiere backend para PDF completo',
    },
    {
      id: 'minimal',
      name: '🚧 Minimalista',
      className: 'template-minimal',
      description: 'Requiere backend para PDF completo',
    },
  ],

  setTemplate: (templateId) => set({ selectedTemplate: templateId }),
}))

export default useTemplateStore
