import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          {label} {required && <span className="text-neutral-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-none border border-neutral-900 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-neutral-100 disabled:text-neutral-400 transition-colors font-sans"
        {...props}
      />
    </div>
  );
}
