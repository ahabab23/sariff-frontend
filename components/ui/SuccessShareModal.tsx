"use client";
import React from "react";
import { WhatsAppShareButton } from "./WhatsAppShareButton";

interface SuccessShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: { label: string; value: string }[];
  whatsappPhone?: string;
  whatsappMessage?: string;
  whatsappLabel?: string;
}

export function SuccessShareModal({
  isOpen,
  onClose,
  title,
  details,
  whatsappPhone,
  whatsappMessage,
  whatsappLabel = "Share via WhatsApp",
}: SuccessShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-green-100">Action completed successfully</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 space-y-2">
          {details.map((d, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{d.label}</span>
              <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 pt-2 space-y-3">
          {whatsappPhone && whatsappMessage && (
            <WhatsAppShareButton
              phone={whatsappPhone}
              message={whatsappMessage}
              label={whatsappLabel}
              className="w-full justify-center"
            />
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
