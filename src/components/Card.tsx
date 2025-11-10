"use client";

import { useRef } from "react";
import type { Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isSelected?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  isDisabled?: boolean;
  isInDeck?: boolean;
  showHoverActions?: boolean;
}

export default function Card({
  card,
  onClick,
  isSelected = false,
  showRemove = false,
  onRemove,
  isDisabled = false,
  isInDeck = false,
  showHoverActions = false,
}: CardProps) {
  const imgRef = useRef<HTMLImageElement>(null);


  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative w-full aspect-[2/3] rounded-xl overflow-hidden group
        transition-all duration-200
        border ${isSelected ? 'border-white/40' : isInDeck ? 'border-green-500/50' : 'border-white/8'}
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        bg-[var(--bg-surface)]
        ${isInDeck ? 'ring-2 ring-green-500/30' : ''}
      `}
      onClick={handleClick}
      style={{
        boxShadow: isSelected 
          ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4)' 
          : isInDeck
          ? '0 0 0 1px rgba(34, 197, 94, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* In Deck indicator */}
      {isInDeck && !showRemove && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-medium z-20 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          In Deck
        </div>
      )}

      {/* Unavailable indicator */}
      {isDisabled && !isInDeck && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-medium z-20">
          Unavailable
        </div>
      )}

      {/* Remove card button */}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 w-4 h-4 rounded-md bg-[var(--bg-surface-elevated)] border border-white/10 hover:border-white/20 text-white/70 hover:text-white flex items-center justify-center text-sm font-medium z-20 hover:bg-white/5 transition-all"
        >
          ×
        </button>
      )}

      {/* Hover actions - Plus icon */}
      {showHoverActions && !isDisabled && !isInDeck && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )}

      {/* Hover actions - Add to deck button */}
      {showHoverActions && !isDisabled && !isInDeck && (
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            className="w-full py-2 px-4 rounded-lg text-gray-800 text-sm font-medium hover:opacity-100 transition-all pointer-events-auto shadow-lg bg-[linear-gradient(135deg,#CECFF7,#D8BCEB,#E6BEC6)]"
          >
            Add to deck
          </button>
        </div>
      )}

      {/* Overlay for unavailable cards */}
      {isDisabled && (
        <div className="absolute inset-0 bg-black/40 z-[5] rounded-xl pointer-events-none" />
      )}

      {/* Top section - name and symbol */}
      <div className={`absolute top-0 left-0 right-0 ${showRemove ? 'p-1.5' : 'p-3'} bg-gradient-to-b from-[var(--bg-surface)]/95 to-transparent z-10`}>
        <div className="flex items-center justify-between">
          <div className={`${showRemove ? 'text-[10px]' : 'text-xs'} font-medium text-white/80 uppercase tracking-wider`}>
            {card.symbol}
          </div>
          
        </div>
        <div className={`${showRemove ? 'text-[10px]' : 'text-xs'} font-medium text-white/80 uppercase tracking-wider`}>
          {card.name}
        </div>
      </div>

      {/* Center section - token image */}
      <div className={`absolute inset-0 flex items-center justify-center ${showRemove ? 'pt-11 pb-9 px-1.5' : 'pt-14 pb-20 px-3'}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Oval container for image with shadow */}
          <div 
            className="relative w-full h-full rounded-2xl overflow-hidden z-10 bg-white/5"
          >
            {/* Image cropped to oval boundaries */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={card.logo_url}
              alt={card.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom section - statistics */}
      <div className={`absolute bottom-0 left-0 right-0 ${showRemove ? 'p-1.5' : 'p-3'} bg-gradient-to-t from-[var(--bg-surface)]/95 to-transparent z-10`}>
        <div className="flex items-center justify-between">
          <div className={`${showRemove ? 'text-[9px]' : 'text-xs'} text-white/60 font-medium`}>WEIGHT</div>
          <div className={`${showRemove ? 'text-sm' : 'text-xl'} font-semibold text-white`}>
            {card.baseScore}
          </div>
        </div>
        <div className={`${showRemove ? 'mt-1' : 'mt-2'} ${showRemove ? 'h-0.5' : 'h-1'} bg-white/5 rounded-full overflow-hidden`}>
          <div 
            className="h-full rounded-full transition-all duration-500 bg-white/20"
            style={{ 
              width: `${(card.baseScore / 100) * 100}%`,
            }}
          />
        </div>
      </div>

    </div>
  );
}

