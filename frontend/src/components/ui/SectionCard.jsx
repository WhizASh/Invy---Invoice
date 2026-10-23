import React from 'react';

export function SectionCard({ title, badge, icon: Icon, children, className = '' }) {
  return (
    <div className={`border border-neutral-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      <div className="flex items-center justify-between border-b border-neutral-900 bg-neutral-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-neutral-900" />}
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{title}</h2>
        </div>
        {badge && (
          <span className="border border-neutral-900 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-900">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
