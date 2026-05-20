import React from "react";
import { SignatureConfig } from "../types";

interface SealAndSignaturesProps {
  config: SignatureConfig;
  isEditable: boolean;
  onUpdate: (updatedConfig: Partial<SignatureConfig>) => void;
}

export default function SealAndSignatures({
  config,
  isEditable,
  onUpdate,
}: SealAndSignaturesProps) {
  return (
    <div className="w-full mt-6 grid grid-cols-3 gap-4 items-end text-center text-gray-950 font-sans text-[10px]">
      
      {/* 1. LEFT COLUMN: Checked By */}
      <div className="flex flex-col items-center relative min-h-[110px] justify-end">
        {/* Checked By Signature Block */}
        {config.showCheckedSignature && (
          <div className="absolute top-2 flex items-center justify-center select-none pointer-events-none">
            {/* Elegant Vector Checkmark Signature Graphic */}
            <svg
              className="w-24 h-12 opacity-85"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Swoosh stroke representing hand signature */}
              <path
                d="M10 20 C20 22, 28 8, 32 3 C34 1, 35 1, 36 3 C40 12, 45 28, 55 32 C65 35, 75 25, 88 15"
                stroke="#1e3a8a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12 C18 16, 25 24, 30 25 C35 26, 60 22, 70 18"
                stroke="#1e3a8a"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.75"
              />
            </svg>
          </div>
        )}

        <div className="w-full z-10 flex flex-col items-center">
          <span className="font-bold text-[11px] text-gray-700 tracking-wide border-b border-gray-400 pb-0.5 mb-1.5 px-6 leading-none">
            Checked By
          </span>

          {isEditable ? (
            <div className="flex flex-col gap-0.5 w-full px-1">
              <input
                type="text"
                value={config.checkedByName}
                onChange={(e) => onUpdate({ checkedByName: e.target.value })}
                className="w-full text-center font-bold text-[#1e3a8a] border border-dashed border-blue-200 rounded text-[9px] bg-slate-50 focus:outline-none"
                placeholder="Tech Name"
              />
              <input
                type="text"
                value={config.checkedByTitle1}
                onChange={(e) => onUpdate({ checkedByTitle1: e.target.value })}
                className="w-full text-center text-gray-500 border border-dashed border-gray-200 rounded text-[8px] bg-slate-50 focus:outline-none"
                placeholder="Title 1"
              />
              <input
                type="text"
                value={config.checkedByTitle2}
                onChange={(e) => onUpdate({ checkedByTitle2: e.target.value })}
                className="w-full text-center text-gray-400 border border-dashed border-gray-200 rounded text-[8px] bg-slate-50 focus:outline-none"
                placeholder="Title 2"
              />
            </div>
          ) : (
            <div className="flex flex-col select-all">
              <span className="font-bold text-[#1e40af] text-[10.5px] leading-tight">
                {config.checkedByName}
              </span>
              <span className="text-[8.5px] text-gray-500 font-semibold leading-tight mt-0.5">
                {config.checkedByTitle1}
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-none">
                {config.checkedByTitle2}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MIDDLE COLUMN: Center Stamp / Seal */}
      <div className="flex flex-col items-center justify-center relative min-h-[110px]">
        {config.showCenterStamp && (
          <div className="w-24 h-24 select-none flex items-center justify-center transition-transform hover:scale-105 duration-200">
            {/* Custom high fidelity hospital stamp SVG */}
            <svg
              className="w-full h-full opacity-80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Double outer circles */}
              <circle cx="50" cy="50" r="46" stroke="#1e3a8a" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="41" stroke="#1e3a8a" strokeWidth="1.2" />
              
              {/* Inner ring */}
              <circle cx="50" cy="50" r="28" stroke="#1e3a8a" strokeWidth="1.5" />
              
              {/* Center star */}
              <polygon
                points="50,38 53,44 60,45 55,50 56,57 50,53 44,57 45,50 40,45 47,44"
                fill="#1e3a8a"
              />
              
              {/* Deflector arches inside logo stamp */}
              <circle cx="50" cy="50" r="24" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2 2" />

              {/* Text arched along outer pathway */}
              <path
                id="stampPathTop"
                d="M 12,50 A 38,38 0 1,1 88,50"
                fill="none"
              />
              <text fontSize="8.2" fontWeight="900" fill="#1e3a8a" letterSpacing="0.8">
                <textPath href="#stampPathTop" startOffset="50%" textAnchor="middle">
                  AL-JABBAR MEDICAL CENTER
                </textPath>
              </text>

              <path
                id="stampPathBottom"
                d="M 88,50 A 38,38 0 1,1 12,50"
                fill="none"
              />
              <text fontSize="8" fontWeight="900" fill="#1e3a8a" letterSpacing="1.2">
                <textPath href="#stampPathBottom" startOffset="50%" textAnchor="middle">
                  ★ DHAKA ★
                </textPath>
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: Dr Ali Ahsan (Authorized) */}
      <div className="flex flex-col items-center relative min-h-[110px] justify-end">
        {/* Doctor Signature Graphic */}
        {config.showDoctorSignature && (
          <div className="absolute top-0 flex items-center justify-center select-none pointer-events-none">
            {/* Elegant cursive handwritten blue ink signature */}
            <svg
              className="w-24 h-14 opacity-90"
              viewBox="0 0 100 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Handwritten "Ahsan" flow */}
              <path
                d="M12 28 C16 10, 24 5, 27 12 C29 17, 30 35, 34 33 C38 31, 40 18, 44 23 C48 28, 49 33, 52 32 C55 31, 58 10, 62 14 C66 18, 64 30, 68 28 C74 24, 82 12, 92 18"
                stroke="#134e4a"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Crossed dash under-swipe */}
              <path
                d="M18 35 C28 34, 45 29, 78 26"
                stroke="#134e4a"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>
        )}

        <div className="w-full z-10 flex flex-col items-center">
          {/* Handwritten-looking authorized visual marker */}
          <span className="font-semibold text-[11px] text-gray-700 tracking-wide border-b border-gray-400 pb-0.5 mb-1.5 px-6 leading-none">
            Medical Officer
          </span>

          {isEditable ? (
            <div className="flex flex-col gap-0.5 w-full px-1">
              <input
                type="text"
                value={config.doctorName}
                onChange={(e) => onUpdate({ doctorName: e.target.value })}
                className="w-full text-center font-bold text-[#134e4a] border border-dashed border-teal-200 rounded text-[9px] bg-slate-50 focus:outline-none"
                placeholder="Doctor Name"
              />
              <input
                type="text"
                value={config.doctorTitle1}
                onChange={(e) => onUpdate({ doctorTitle1: e.target.value })}
                className="w-full text-center text-gray-500 border border-dashed border-gray-200 rounded text-[7.5px] bg-slate-50 focus:outline-none"
                placeholder="Titles Line 1"
              />
              <input
                type="text"
                value={config.doctorTitle2}
                onChange={(e) => onUpdate({ doctorTitle2: e.target.value })}
                className="w-full text-center text-gray-400 border border-dashed border-gray-200 rounded text-[8px] bg-slate-50 focus:outline-none"
                placeholder="Titles Line 2"
              />
              <input
                type="text"
                value={config.doctorTitle3}
                onChange={(e) => onUpdate({ doctorTitle3: e.target.value })}
                className="w-full text-center text-gray-400 border border-dashed border-gray-200 rounded text-[8px] bg-slate-50 focus:outline-none"
                placeholder="Titles Line 3"
              />
            </div>
          ) : (
            <div className="flex flex-col select-all">
              <span className="font-bold text-[#115e59] text-[10.5px] leading-tight">
                {config.doctorName}
              </span>
              <span className="text-[7.5px] text-gray-500 font-extrabold leading-tight mt-0.5 whitespace-normal max-w-full px-1">
                {config.doctorTitle1}
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-tight">
                {config.doctorTitle2}
              </span>
              <span className="text-[8.5px] text-gray-400 font-semibold leading-none">
                {config.doctorTitle3}
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
