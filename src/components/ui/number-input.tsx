import * as React from 'react'
import { cn } from '../../lib/utils'

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onValueChange?: (value: number) => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onValueChange, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      // Si está vacío, pasar 0 pero mantener el input vacío visualmente
      const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0
      onValueChange?.(numericValue)
      onChange?.(e)
    }

    // Mostrar string vacío si el valor es 0, para evitar el problema del "015"
    const displayValue = value === 0 ? '' : value

    return (
      <input
        type="number"
        value={displayValue}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Ocultar las flechitas en navegadores webkit
          '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          // Firefox
          '[&]:[-moz-appearance:textfield]',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }
