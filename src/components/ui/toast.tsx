import React, { useEffect, useState } from 'react'
import { Button } from './button'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getToastStyles = () => {
    const baseStyles =
      'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md transition-all duration-300 transform'

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-600 text-white border border-green-700`
      case 'error':
        return `${baseStyles} bg-red-600 text-white border border-red-700`
      case 'info':
        return `${baseStyles} bg-blue-600 text-white border border-blue-700`
      default:
        return `${baseStyles} bg-gray-600 text-white border border-gray-700`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div className={getToastStyles()}>
      <span className="text-lg">{getIcon()}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-white hover:bg-white/20 h-6 w-6 p-0"
      >
        ×
      </Button>
    </div>
  )
}

// Hook para manejar toasts
export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    setToast({
      message,
      type,
      isVisible: true,
    })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}
