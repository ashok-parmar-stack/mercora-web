"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, X, Check, Zap, RefreshCw } from 'lucide-react';

export interface CustomSelectOption {
  id: string;
  label: string;
  subLabel?: string;
  badge?: string;
  badgeColor?: string;
  extra?: any;
}

export interface CustomLocationSelectProps {
  label: string;
  tierNumber: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  placeholder?: string;
  value?: string;
  options: CustomSelectOption[];
  onChange: (value: string, option?: CustomSelectOption) => void;
  disabled?: boolean;
  loading?: boolean;
  onSyncInline?: () => void;
  syncingInline?: boolean;
  syncButtonLabel?: string;
  className?: string;
}

export function CustomLocationSelect({
  label,
  tierNumber,
  icon: Icon,
  iconColor,
  placeholder = 'Select option...',
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  onSyncInline,
  syncingInline = false,
  syncButtonLabel,
  className = '',
}: CustomLocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [options, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
        scrollOptionIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
        scrollOptionIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      e.preventDefault();
      const chosen = filteredOptions[focusedIndex];
      onChange(chosen.id, chosen);
      setIsOpen(false);
    }
  };

  const scrollOptionIntoView = (index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-option-item]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative flex flex-col gap-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-600 text-[10px] font-mono flex items-center justify-center font-bold">
            {tierNumber}
          </span>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <span>{label}</span>
        </label>

        {onSyncInline && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSyncInline();
            }}
            disabled={syncingInline}
            className="text-[10px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-brand-50 transition-colors cursor-pointer"
            title={syncButtonLabel || 'Fetch from Government LGD'}
          >
            <RefreshCw className={`w-2.5 h-2.5 ${syncingInline ? 'animate-spin' : ''}`} />
            <span>{syncingInline ? 'Syncing...' : syncButtonLabel || 'Sync LGD'}</span>
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full min-h-[42px] px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between gap-2 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white shadow-xs'
            : selectedOption
            ? 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 shadow-2xs'
            : 'border-gray-200 bg-gray-50/50 hover:bg-white text-gray-500 hover:border-gray-300 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption ? (
            <>
              <span className="font-semibold text-gray-900 truncate">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 ${
                    selectedOption.badgeColor || 'bg-brand-50 text-brand-700 border border-brand-200'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 text-gray-400">
          {selectedOption && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div ref={listRef} className="overflow-y-auto divide-y divide-gray-50 p-1 flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.id === value;
                const isFocused = index === focusedIndex;
                return (
                  <button
                    key={opt.id}
                    data-option-item
                    type="button"
                    onClick={() => {
                      onChange(opt.id, opt);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 font-bold'
                        : isFocused
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-700 font-medium'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{opt.label}</span>
                      {opt.subLabel && <span className="text-[10px] text-gray-400 font-normal truncate">{opt.subLabel}</span>}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {opt.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                            opt.badgeColor || 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <span>No results found for &ldquo;{search || label}&rdquo;</span>
                {onSyncInline && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSyncInline();
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    {syncButtonLabel || 'Sync from LGD'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
