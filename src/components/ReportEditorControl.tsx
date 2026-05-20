import React, { useState } from "react";
import {
  FileText,
  User,
  Activity,
  Beaker,
  Award,
  Plus,
  Trash2,
  Copy,
  Save,
  ChevronDown,
  Info,
  CheckCircle,
  FileCheck,
  Globe,
  Upload,
  UserCheck
} from "lucide-react";
import { MedicalReport, PatientDetails, PhysicalExamination, LabInvestigations, SignatureConfig } from "../types";
import { MALE_FIT_PRESET, FEMALE_FIT_PRESET, TEMPLATE_REPORT } from "../defaultData";

interface ReportEditorControlProps {
  currentReport: MedicalReport;
  reportsList: MedicalReport[];
  onSelectReport: (id: string) => void;
  onSaveReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  onAddNewReport: (type: "male" | "female" | "blank") => void;
  onDuplicateReport: (report: MedicalReport) => void;
  onUpdateReport: (updatedReport: MedicalReport) => void;
  onDownloadPDF: () => void;
  isInlineEditMode: boolean;
  onToggleInlineEditMode: () => void;
  isGeneratingPdf?: boolean;
}

type TabType = "general" | "patient" | "physical" | "lab" | "signatures";

export default function ReportEditorControl({
  currentReport,
  reportsList,
  onSelectReport,
  onSaveReport,
  onDeleteReport,
  onAddNewReport,
  onDuplicateReport,
  onUpdateReport,
  onDownloadPDF,
  isInlineEditMode,
  onToggleInlineEditMode,
  isGeneratingPdf = false,
}: ReportEditorControlProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Local helper to update nested structures
  const updatePatient = (fieldUpdates: Partial<PatientDetails>) => {
    onUpdateReport({
      ...currentReport,
      patient: { ...currentReport.patient, ...fieldUpdates },
    });
  };

  const updatePhysical = (fieldUpdates: Partial<PhysicalExamination>) => {
    onUpdateReport({
      ...currentReport,
      physical: { ...currentReport.physical, ...fieldUpdates },
    });
  };

  const updateLabs = (fieldUpdates: Partial<LabInvestigations>) => {
    onUpdateReport({
      ...currentReport,
      labs: { ...currentReport.labs, ...fieldUpdates },
    });
  };

  const updateSignatures = (fieldUpdates: Partial<SignatureConfig>) => {
    onUpdateReport({
      ...currentReport,
      signatures: { ...currentReport.signatures, ...fieldUpdates },
    });
  };

  // Image Upload helper in the sidebar too
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePatient({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm h-full overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="p-4 bg-slate-900 text-white flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold tracking-tight">Report Control Panel</h2>
        </div>
        <p className="text-[11px] text-slate-300">
          Replicate the Al-Jabbar medical certificate. Fully customize dates, values, names, or stamps below.
        </p>

        {/* Primary PDF Trigger */}
        <button
          onClick={onDownloadPDF}
          disabled={isGeneratingPdf}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white font-bold text-xs rounded-lg shadow-sm transition-all focus:outline-none ${
            isGeneratingPdf
              ? "bg-slate-700 opacity-75 cursor-wait"
              : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 cursor-pointer"
          }`}
        >
          {isGeneratingPdf ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4" />
              Download A4 PDF Report
            </>
          )}
        </button>
      </div>

      {/* 2. TAB CONTROLLER BAR */}
      <div className="flex border-b border-gray-200 bg-slate-50 overflow-x-auto text-xs scrollbar-none antialiased">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "general"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          General
        </button>
        <button
          onClick={() => setActiveTab("patient")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "patient"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Patient
        </button>
        <button
          onClick={() => setActiveTab("physical")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "physical"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Physical
        </button>
        <button
          onClick={() => setActiveTab("lab")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "lab"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Beaker className="w-3.5 h-3.5" />
          Labs
        </button>
        <button
          onClick={() => setActiveTab("signatures")}
          className={`flex-1 py-3 px-2 text-center font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[75px] ${
            activeTab === "signatures"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Signatures
        </button>
      </div>

      {/* 3. SCROLLABLE TAB CONTENT PANEL */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4 text-xs font-sans text-gray-700">
        
        {/* ==================== TAB: GENERAL (Reports List & Presets) ==================== */}
        {activeTab === "general" && (
          <div className="space-y-4">
            
            {/* Quick Edit Mode Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-blue-900 text-xs block">Double Editing Options:</span>
                <span className="text-blue-800 text-[11px] leading-relaxed block">
                  You can edit values using the form tabs here, <strong>or</strong> turn on <strong>Direct Paper Edit Mode</strong> below and type directly onto the certificate form!
                </span>
                <button
                  onClick={onToggleInlineEditMode}
                  className={`mt-1.5 py-1 px-3 text-[10.5px] font-bold rounded-md shadow-sm border transition-colors cursor-pointer flex items-center gap-1 ${
                    isInlineEditMode
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isInlineEditMode ? "Direct Sheet Editing: ON" : "Turn ON Direct Sheet Editing"}
                </button>
              </div>
            </div>

            {/* Presets and Reports Section */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-xs uppercase tracking-tight">
                Create / Load Templates
              </span>

              {/* Template generator buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onAddNewReport("male")}
                  className="py-2 px-1 text-center bg-sky-50 text-sky-700 font-bold border border-sky-200 hover:bg-sky-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Male Preset
                </button>
                <button
                  onClick={() => onAddNewReport("female")}
                  className="py-2 px-1 text-center bg-pink-50 text-pink-700 font-bold border border-pink-200 hover:bg-pink-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Female Preset
                </button>
                <button
                  onClick={() => onAddNewReport("blank")}
                  className="py-2 px-1 text-center bg-gray-50 text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] transition-colors cursor-pointer flex flex-col items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Blank Form
                </button>
              </div>
            </div>

            {/* File Records Manager */}
            <div className="border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-900 block mb-2 text-xs uppercase tracking-tight flex items-center justify-between">
                <span>Saved Reports ({reportsList.length})</span>
                <span className="text-[10px] text-gray-400 font-normal">Stored in local browser</span>
              </span>

              {reportsList.length === 0 ? (
                <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No custom records saved yet. Adjust any details and save!
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-1.5 bg-slate-50/50 scrollbar-thin">
                  {reportsList.map((report) => (
                    <div
                      key={report.id}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors text-[11px] ${
                        currentReport.id === report.id
                          ? "bg-blue-50 border border-blue-200 text-blue-900 font-bold"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-transparent"
                      }`}
                    >
                      <button
                        onClick={() => onSelectReport(report.id)}
                        className="flex-1 text-left font-semibold truncate focus:outline-none cursor-pointer"
                      >
                        {report.patient.fullName || "Unnamed"} ({report.patient.destinationCountry || "N/A"})
                        <span className="block text-[9px] text-gray-400 font-normal">
                          {report.patient.regNo} | {report.patient.examDate}
                        </span>
                      </button>

                      <div className="flex items-center gap-1 pl-2">
                        <button
                          onClick={() => onDuplicateReport(report)}
                          title="Duplicate"
                          className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(report.id)}
                          title="Delete"
                          className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Current Report */}
            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => onSaveReport(currentReport)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Report File
              </button>
            </div>

          </div>
        )}

        {/* ==================== TAB: PATIENT DETAILS ==================== */}
        {activeTab === "patient" && (
          <div className="space-y-3.5">
            <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-tight">Patient Personal Metrics</span>

            {/* Photo upload row */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-gray-200">
              <div className="w-14 h-16 border border-gray-300 bg-white rounded overflow-hidden flex items-center justify-center">
                {currentReport.patient.photoUrl ? (
                  <img
                    src={currentReport.patient.photoUrl}
                    alt="Current upload preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold block text-[11px] text-gray-800">Add Patient Photo</span>
                <span className="text-[9px] text-gray-400 block mb-1">Upload headshot or passport picture</span>
                <label className="inline-flex items-center gap-1.5 py-1 px-3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-[10px] border border-gray-300 rounded shadow-sm cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Reg No</label>
                <input
                  type="text"
                  value={currentReport.patient.regNo}
                  onChange={(e) => updatePatient({ regNo: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Date Of Exam</label>
                <input
                  type="text"
                  value={currentReport.patient.examDate}
                  onChange={(e) => updatePatient({ examDate: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={currentReport.patient.fullName}
                onChange={(e) => updatePatient({ fullName: e.target.value.toUpperCase() })}
                className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Father's Name</label>
                <input
                  type="text"
                  value={currentReport.patient.fatherName}
                  onChange={(e) => updatePatient({ fatherName: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Mother's Name</label>
                <input
                  type="text"
                  value={currentReport.patient.motherName}
                  onChange={(e) => updatePatient({ motherName: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/20 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Sex</label>
                <select
                  value={currentReport.patient.sex}
                  onChange={(e) => updatePatient({ sex: e.target.value })}
                  className="w-full py-1.5 px-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-white"
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Date Of Birth</label>
                <input
                  type="text"
                  value={currentReport.patient.dob}
                  onChange={(e) => updatePatient({ dob: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Passport No</label>
                <input
                  type="text"
                  value={currentReport.patient.passportNo}
                  onChange={(e) => updatePatient({ passportNo: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20 uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Agency</label>
                <input
                  type="text"
                  value={currentReport.patient.agency}
                  onChange={(e) => updatePatient({ agency: e.target.value.toUpperCase() })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold bg-slate-50/20 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                Destination Country
              </label>
              <input
                type="text"
                value={currentReport.patient.destinationCountry}
                onChange={(e) => updatePatient({ destinationCountry: e.target.value.toUpperCase() })}
                className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-extrabold text-blue-900 bg-blue-50/10 uppercase"
              />
            </div>

          </div>
        )}

        {/* ==================== TAB: PHYSICAL EXAMS ==================== */}
        {activeTab === "physical" && (
          <div className="space-y-3.5">
            <span className="font-bold text-gray-900 block mb-1 text-xs uppercase tracking-tight">Physical Parameters</span>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Height</label>
                <input
                  type="text"
                  value={currentReport.physical.height}
                  onChange={(e) => updatePhysical({ height: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Weight</label>
                <input
                  type="text"
                  value={currentReport.physical.weight}
                  onChange={(e) => updatePhysical({ weight: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Pulse</label>
                <input
                  type="text"
                  value={currentReport.physical.pulse}
                  onChange={(e) => updatePhysical({ pulse: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Blood Pressure</label>
                <input
                  type="text"
                  value={currentReport.physical.bloodPressure}
                  onChange={(e) => updatePhysical({ bloodPressure: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Heart</label>
                <input
                  type="text"
                  value={currentReport.physical.heart}
                  onChange={(e) => updatePhysical({ heart: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Liver</label>
                <input
                  type="text"
                  value={currentReport.physical.liver}
                  onChange={(e) => updatePhysical({ liver: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Spleen</label>
                <input
                  type="text"
                  value={currentReport.physical.spleen}
                  onChange={(e) => updatePhysical({ spleen: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Ear, Nose & Throat (ENT)</label>
                <input
                  type="text"
                  value={currentReport.physical.ent}
                  onChange={(e) => updatePhysical({ ent: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Eye Left (LT)</label>
                <input
                  type="text"
                  value={currentReport.physical.eyeLeft}
                  onChange={(e) => updatePhysical({ eyeLeft: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Eye Right (RT)</label>
                <input
                  type="text"
                  value={currentReport.physical.eyeRight}
                  onChange={(e) => updatePhysical({ eyeRight: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Skin</label>
                <input
                  type="text"
                  value={currentReport.physical.skin}
                  onChange={(e) => updatePhysical({ skin: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Physical Quality</label>
                <input
                  type="text"
                  value={currentReport.physical.physicalCondition}
                  onChange={(e) => updatePhysical({ physicalCondition: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">ECG</label>
                <input
                  type="text"
                  value={currentReport.physical.ecg}
                  onChange={(e) => updatePhysical({ ecg: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Chest P/A View</label>
                <input
                  type="text"
                  value={currentReport.physical.chestP_A_View}
                  onChange={(e) => updatePhysical({ chestP_A_View: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: LAB INVESTIGATIONS ==================== */}
        {activeTab === "lab" && (
          <div className="space-y-4">
            
            {/* Serology Section */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-[11px] uppercase tracking-wide border-b border-gray-200 pb-1 text-blue-800">
                1. Serology
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">HBsAg</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.hbsag}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, hbsag: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">VDRL</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.vdrl}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, vdrl: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">TPHA</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.tpha}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, tpha: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Blood Group</label>
                  <input
                    type="text"
                    value={currentReport.labs.serology.bloodGroup}
                    onChange={(e) => updateLabs({
                      serology: { ...currentReport.labs.serology, bloodGroup: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Biochemical, Hematology, Urine */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-[11px] uppercase tracking-wide border-b border-gray-200 pb-1 text-blue-800">
                2. Biochemical, Hematology, Urine
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">S. Bilirubin (BIOC)</label>
                  <input
                    type="text"
                    value={currentReport.labs.biochemical.sBilirubin}
                    onChange={(e) => updateLabs({
                      biochemical: { ...currentReport.labs.biochemical, sBilirubin: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Sugar Random (BIOC)</label>
                  <input
                    type="text"
                    value={currentReport.labs.biochemical.sugarRandom}
                    onChange={(e) => updateLabs({
                      biochemical: { ...currentReport.labs.biochemical, sugarRandom: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Hemoglobin (HEMA)</label>
                  <input
                    type="text"
                    value={currentReport.labs.hematology.hemoglobin}
                    onChange={(e) => updateLabs({
                      hematology: { hemoglobin: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Pregnancy Test (URINE)</label>
                  <input
                    type="text"
                    value={currentReport.labs.urine.pregnancyTest}
                    onChange={(e) => updateLabs({
                      urine: { pregnancyTest: e.target.value }
                    })}
                    className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB: SIGNATURES & MEDICAL OUTCOME ==================== */}
        {activeTab === "signatures" && (
          <div className="space-y-4">
            
            {/* Fit Medical Outcome Box */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <span className="font-bold text-gray-950 block text-[11px] uppercase tracking-wide flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Medical Outcome Assessment
              </span>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">FIT STATUS DISPLAY</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateReport({ ...currentReport, fitStatus: "FIT" });
                    }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      currentReport.fitStatus === "FIT"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    FIT
                  </button>
                  <button
                    onClick={() => {
                      onUpdateReport({ ...currentReport, fitStatus: "UNFIT" });
                    }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      currentReport.fitStatus === "UNFIT"
                        ? "bg-red-100 text-red-800 border-red-400"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    UNFIT
                  </button>
                </div>
                
                {/* Custom input in case they want a custom label like "RE-EXAMINE" */}
                <input
                  type="text"
                  placeholder="Or enter custom label (e.g., RE-EXAMINE)"
                  value={currentReport.fitStatus}
                  onChange={(e) => onUpdateReport({ ...currentReport, fitStatus: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold mt-2 bg-white"
                />
              </div>
            </div>

            {/* Stamp / Signs Toggles */}
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <span className="font-bold text-gray-950 block text-[11px] uppercase tracking-wide">
                Seal & Signatures Options
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showCheckedSignature}
                    onChange={(e) => updateSignatures({ showCheckedSignature: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Technologist Signature</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showCenterStamp}
                    onChange={(e) => updateSignatures({ showCenterStamp: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Circular Hospital Stamp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                  <input
                    type="checkbox"
                    checked={currentReport.signatures.showDoctorSignature}
                    onChange={(e) => updateSignatures({ showDoctorSignature: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show Doctor Signature</span>
                </label>
              </div>
            </div>

            {/* Staff detailed override inputs */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900 block text-[10.5px] uppercase">
                Staff Names customization
              </span>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600">Technician Signee</label>
                <input
                  type="text"
                  value={currentReport.signatures.checkedByName}
                  onChange={(e) => updateSignatures({ checkedByName: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none text-[11px] font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600">Authorized Doctor</label>
                <input
                  type="text"
                  value={currentReport.signatures.doctorName}
                  onChange={(e) => updateSignatures({ doctorName: e.target.value })}
                  className="w-full py-1 px-2 border border-gray-300 rounded focus:outline-none text-[11px] font-medium"
                />
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4. FOOTER CREDENTIALS NOTATION */}
      <div className="p-3 bg-slate-50 border-t border-gray-200 text-center text-[10px] font-medium text-gray-400 flex flex-col items-center justify-center gap-1.5">
        <span>Al-Jabbar Medical Center Report Manager</span>
        <span className="text-[9px] text-gray-300">A4 Dimensions: 210mm × 297mm formatted</span>
      </div>

    </div>
  );
}
