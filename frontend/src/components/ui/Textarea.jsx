import React from 'react';

export function Textarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          {label} {required && <span className="text-neutral-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-none border border-neutral-900 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-colors font-sans"
        {...props}
      />
    </div>
  );
}
