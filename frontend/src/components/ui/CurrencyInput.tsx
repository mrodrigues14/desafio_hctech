'use client';

import { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = 'Ex: R$ 50.000,00',
  className = '',
  disabled = false,
  label
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency(value));
      }
    }
  }, [value, isFocused]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatInputValue = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    const amount = parseInt(numbers) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const parseValue = (formattedValue: string): number => {
    const cleanValue = formattedValue.replace(/[^\d,]/g, '');
    
    if (!cleanValue) return 0;
    
    const numericValue = parseFloat(cleanValue.replace(',', '.'));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleInputChange = (inputValue: string) => {
    const formatted = formatInputValue(inputValue);
    setDisplayValue(formatted);
    
    const numericValue = parseValue(formatted);
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${className}`}
      />
    </div>
  );
}
