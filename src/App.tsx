import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  RotateCcw,
  PlusCircle,
  FileDown,
  Sparkles,
  Info,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { MedicalReport } from "./types";
import { TEMPLATE_REPORT, MALE_FIT_PRESET, FEMALE_FIT_PRESET } from "./defaultData";
import { downloadReportAsPDF } from "./utils/pdfExporter";
import ReportHeader from "./components/ReportHeader";
import PatientMeta from "./components/PatientMeta";
import PhysicalExamTable from "./components/PhysicalExamTable";
import LabTable from "./components/LabTable";
import SealAndSignatures from "./components/SealAndSignatures";
import ReportEditorControl from "./components/ReportEditorControl";

// Safe LocalStorage utility wrapper to avoid SecurityError in restricted frames (e.g. GitHub/Netlify custom sandboxes)
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access denied. Falling back to in-memory store.", e);
      return (window as any).__memStorage?.[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage write denied. Saving in-memory.", e);
      if (!(window as any).__memStorage) {
        (window as any).__memStorage = {};
      }
      (window as any).__memStorage[key] = value;
    }
  }
};

export default function App() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [isInlineEdit, setIsInlineEdit] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // 1. Initial State Loading from LocalStorage or Fallback Defaults
  useEffect(() => {
    const saved = safeStorage.getItem("aljabbar_reports_db");
    if (saved) {
      try {
        const parsed: MedicalReport[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setReports(parsed);
          setSelectedReportId(parsed[0].id);
          return;
        }
      } catch (err) {
        console.error("Error parsing saved reports", err);
      }
    }

    // Default Fallback
    const initialList = [TEMPLATE_REPORT];
    setReports(initialList);
    setSelectedReportId(TEMPLATE_REPORT.id);
    safeStorage.setItem("aljabbar_reports_db", JSON.stringify(initialList));
  }, []);

  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0] || TEMPLATE_REPORT;

  // Helper trigger alert notifications
  const triggerAlert = (text: string, type: "success" | "info" = "success") => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // 2. State persistence & sync function
  const saveAllReports = (updatedReports: MedicalReport[]) => {
    setReports(updatedReports);
    safeStorage.setItem("aljabbar_reports_db", JSON.stringify(updatedReports));
  };

  const handleUpdateReport = (updated: MedicalReport) => {
    const updatedList = reports.map((r) => (r.id === updated.id ? updated : r));
    saveAllReports(updatedList);
  };

  const handleSaveReportExplicitly = (report: MedicalReport) => {
    handleUpdateReport(report);
    triggerAlert(`Report for ${report.patient.fullName || "Patient"} successfully saved!`);
  };

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    triggerAlert(`Loaded record: ${reports.find((r) => r.id === id)?.patient.fullName || "Report"}`);
  };

  const handleDeleteReport = (id: string) => {
    if (reports.length <= 1) {
      triggerAlert("Cannot delete the only remaining report. Create a new one first!", "info");
      return;
    }
    const filtered = reports.filter((r) => r.id !== id);
    saveAllReports(filtered);
    if (selectedReportId === id) {
      setSelectedReportId(filtered[0].id);
    }
    triggerAlert("Patient report deleted successfully", "success");
  };

  const handleAddNewReport = (type: "male" | "female" | "blank") => {
    const freshId = `report-${Date.now()}`;
    let basePreset: Omit<MedicalReport, "id" | "createdAt" | "title">;

    if (type === "male") {
      basePreset = MALE_FIT_PRESET;
    } else if (type === "female") {
      basePreset = FEMALE_FIT_PRESET;
    } else {
      // Blank
      basePreset = {
        patient: {
          regNo: "AJ-26-XXXX",
          examDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "."),
          fullName: "",
          fatherName: "",
          motherName: "",
          passportNo: "",
          dob: "",
          sex: "MALE",
          agency: "",
          photoUrl: "",
          destinationCountry: "",
        },
        physical: {
          height: "",
          weight: "",
          pulse: "",
          bloodPressure: "",
          heart: "",
          liver: "",
          spleen: "",
          eyeLeft: "",
          eyeRight: "",
          ent: "",
          skin: "",
          physicalCondition: "",
          ecg: "",
          chestP_A_View: "",
        },
        labs: {
          serology: { hbsag: "", vdrl: "", tpha: "", bloodGroup: "" },
          biochemical: { sBilirubin: "", sugarRandom: "" },
          hematology: { hemoglobin: "" },
          urine: { pregnancyTest: "" },
        },
        fitStatus: "FIT",
        remarks: "",
        signatures: {
          checkedByName: "Md. Shohel Rana",
          checkedByTitle1: "DMT in Laboratory Medicine",
          checkedByTitle2: "Al-Jabbar Medical Center",
          doctorName: "DR. ALI AHSAN",
          doctorTitle1: "MBBS, DMU (SUB), MPH (C.M) BSMMU",
          doctorTitle2: "Medical Officer",
          doctorTitle3: "Al-Jabbar Medical Center",
          showCheckedSignature: true,
          showDoctorSignature: true,
          showCenterStamp: true,
        },
      };
    }

    const newLabel = basePreset.patient.fullName || `New Patient ${reports.length + 1}`;
    const newReport: MedicalReport = {
      ...basePreset,
      id: freshId,
      title: `${newLabel}`,
      createdAt: new Date().toISOString(),
    };

    const expandedList = [newReport, ...reports];
    saveAllReports(expandedList);
    setSelectedReportId(freshId);
    triggerAlert(`Created new ${type} patient report!`);
  };

  const handleDuplicateReport = (report: MedicalReport) => {
    const cloneId = `report-${Date.now()}`;
    const cloned: MedicalReport = {
      ...JSON.parse(JSON.stringify(report)),
      id: cloneId,
      createdAt: new Date().toISOString(),
      patient: {
        ...report.patient,
        fullName: `${report.patient.fullName} (COPY)`,
        regNo: `${report.patient.regNo}-C`,
      },
      title: `${report.patient.fullName} (COPY)`,
    };

    saveAllReports([cloned, ...reports]);
    setSelectedReportId(cloneId);
    triggerAlert(`Duplicated report for ${report.patient.fullName}`);
  };

  // 3. Trigger PDF Download workflow using client-side canvas renderer
  const handleDownloadPDF = async () => {
    if (isGeneratingPdf) return;

    // Construct a beautiful filename using the patient's name and registration number
    const safeName = currentReport.patient.fullName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Report";
    const safeReg = currentReport.patient.regNo.trim().replace(/[^a-zA-Z0-9]/g, "-") || "Record";
    const filename = `AL_JABBAR_${safeName}_${safeReg}.pdf`.toUpperCase();

    setIsGeneratingPdf(true);
    triggerAlert("উচ্চমানের পিডিএফ রিপোর্ট তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", "info");

    // Wait a brief moment to allow alert rendering and clean layout calculation before taking the canvas screenshot
    setTimeout(async () => {
      try {
        const success = await downloadReportAsPDF("medical-report-sheet", filename);
        if (success) {
          triggerAlert("পিডিএফ ফাইলটি সফলভাবে ডাউনলোড হয়েছে!", "success");
        } else {
          // Graceful fallback to browser print if canvas render has environment issues (e.g., inside third party sandbox)
          triggerAlert("পিডিএফ তৈরিতে সমস্যা হচ্ছে। সরাসরি ব্রাউজার প্রিন্ট ডায়ালগ খোলা হচ্ছে...", "info");
          window.print();
        }
      } catch (err) {
        console.error("PDF engine crash, fallback to print() invoked:", err);
        window.print();
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to restore the default template? This will erase local history.")) {
      const defaultList = [TEMPLATE_REPORT];
      setReports(defaultList);
      setSelectedReportId(TEMPLATE_REPORT.id);
      safeStorage.setItem("aljabbar_reports_db", JSON.stringify(defaultList));
      triggerAlert("System reset to Al-Jabbar original medical report template.", "info");
    }
  };

  // Helper getters for Fit Box styling
  const getFitBoxStyles = () => {
    const status = (currentReport.fitStatus || "").trim().toUpperCase();
    if (status === "FIT") {
      return {
        text: "FIT",
        colorClass: "text-emerald-700 font-extrabold",
        borderClass: "border-2 border-slate-900 bg-emerald-50/10",
      };
    } else if (status === "UNFIT") {
      return {
        text: "UNFIT",
        colorClass: "text-red-700 font-extrabold",
        borderClass: "border-2 border-dashed border-red-600 bg-red-50/5",
      };
    } else {
      return {
        text: status,
        colorClass: "text-amber-700 font-extrabold",
        borderClass: "border-2 double border-slate-800 bg-amber-50/10",
      };
    }
  };

  const fitStyle = getFitBoxStyles();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* ==================== 1. FLOATING BANNER ALERTS ==================== */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-lg bg-slate-900 text-white font-medium text-xs antialiased max-w-sm"
          >
            {alertMessage.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
            )}
            <span className="leading-snug">{alertMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 2. APP GLOBAL TOP NAVIGATION (no-print) ==================== */}
      <header className="no-print bg-white border-b border-gray-200 z-10 w-full sticky top-0 px-4 md:px-8 py-3.5 flex flex-row justify-between items-center select-none shadow-sm/5%">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-1.5 bg-blue-600 rounded-lg text-white font-extrabold text-sm tracking-tighter flex items-center gap-1 shadow-inner select-none uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            AMC
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm md:text-base leading-none tracking-tight">
              Al-Jabbar Report Portal
            </h1>
            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-none mt-1">
              Medical Examination Sheet Customizer & PDF Exporter
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          {/* Quick toggle mode info */}
          <button
            onClick={() => setIsInlineEdit(!isInlineEdit)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isInlineEdit
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-700 border-gray-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isInlineEdit ? "Direct Sheet Edit: ON" : "Direct Sheet Edit: OFF"}
          </button>

          {/* Quick PDF button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-bold rounded-lg transition-all ${
              isGeneratingPdf
                ? "bg-slate-700 opacity-75 cursor-wait text-slate-300"
                : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                Wait...
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5" />
                Print/PDF
              </>
            )}
          </button>

          {/* Reset Template */}
          <button
            onClick={handleResetToDefaults}
            title="Reset system to default template"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ==================== 3. MAIN WORKSPACE CONTAINER ==================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 select-none leading-none">
        
        {/* ==================== LEFT COLUMN: WORKSHOP SIDEBAR (no-print) ==================== */}
        <section className="no-print w-full lg:w-[380px] h-[calc(100vh-100px)] min-h-[500px] lg:sticky lg:top-[85px] flex-shrink-0">
          <ReportEditorControl
            currentReport={currentReport}
            reportsList={reports}
            onSelectReport={handleSelectReport}
            onSaveReport={handleSaveReportExplicitly}
            onDeleteReport={handleDeleteReport}
            onAddNewReport={handleAddNewReport}
            onDuplicateReport={handleDuplicateReport}
            onUpdateReport={handleUpdateReport}
            onDownloadPDF={handleDownloadPDF}
            isInlineEditMode={isInlineEdit}
            onToggleInlineEditMode={() => setIsInlineEdit(!isInlineEdit)}
            isGeneratingPdf={isGeneratingPdf}
          />
        </section>

        {/* ==================== RIGHT COLUMN: PRINT ENGINE CANVAS ==================== */}
        <section className="flex-1 flex flex-col items-center justify-start overflow-visible min-w-0">
          
          {/* Quick Workspace Guide Banner (no-print) */}
          <div className="no-print w-full max-w-[210mm] mb-3 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5 shadow-sm/5%">
            <Info className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px] text-teal-800 leading-relaxed">
              <span className="font-bold text-teal-900 text-xs block">Export Instruction for Users:</span>
              <span>
                To download your report as a perfect PDF, click <strong>Print/PDF</strong>. In the print dialogue, choose <strong>Save as PDF</strong> as the Destination, select <strong>A4 Portrait</strong>, turn on <strong>Background graphics</strong>, and set margins to <strong>None</strong> for spectacular results.
              </span>
            </div>
          </div>

          {/* PHYSICAL A4 SIZE CONTAINER SHEET */}
          <div className="w-full overflow-x-auto p-1 py-4 flex justify-center bg-slate-200/50 border border-slate-300 rounded-2xl scrollbar-none shadow-inner w-full">
            <div
              id="medical-report-sheet"
              className="print-area w-[210mm] h-[297mm] bg-white text-gray-900 border border-gray-400 shadow-xl relative select-text flex flex-col justify-between"
              style={{
                boxSizing: "border-box",
                padding: "15mm 20mm 15mm 20mm", // standard physical margin padding
              }}
            >
              
              {/* Report Inner Flex Container */}
              <div className="w-full flex-1 flex flex-col">
                
                {/* A. Header Medical Branding */}
                <ReportHeader
                  centerName={currentReport.signatures.doctorTitle3 || "AL-JABBAR MEDICAL CENTER"}
                  isEditable={isInlineEdit}
                  onUpdate={(updates) => {
                    handleUpdateReport({
                      ...currentReport,
                      signatures: {
                        ...currentReport.signatures,
                        doctorTitle3: updates.centerName || currentReport.signatures.doctorTitle3,
                      },
                    });
                  }}
                />

                {/* B. Patient Meta Rows & Photo Box */}
                <PatientMeta
                  patient={currentReport.patient}
                  isEditable={isInlineEdit}
                  onUpdate={(fields) => {
                    handleUpdateReport({
                      ...currentReport,
                      patient: { ...currentReport.patient, ...fields },
                    });
                  }}
                  destinationCountry={currentReport.patient.destinationCountry}
                  onUpdateCountry={(country) => {
                    handleUpdateReport({
                      ...currentReport,
                      patient: { ...currentReport.patient, destinationCountry: country },
                    });
                  }}
                />

                {/* C. Physical & Labs Dual Side-by-Side Tables Grid */}
                <div className="w-full flex flex-row gap-5 items-start mt-4">
                  {/* Left Column: Physical Exam */}
                  <PhysicalExamTable
                    data={currentReport.physical}
                    isEditable={isInlineEdit}
                    onUpdate={(fields) => {
                      handleUpdateReport({
                        ...currentReport,
                        physical: { ...currentReport.physical, ...fields },
                      });
                    }}
                  />

                  {/* Right Column: Lab investigations */}
                  <LabTable
                    data={currentReport.labs}
                    isEditable={isInlineEdit}
                    onUpdate={(fields) => {
                      handleUpdateReport({
                        ...currentReport,
                        labs: { ...currentReport.labs, ...fields },
                      });
                    }}
                  />
                </div>

                {/* D. Bottom Fit Status Block */}
                <div className="w-full flex flex-col items-center mt-5">
                  <span className="font-sans text-[12.5px] font-[500] text-gray-800 leading-tight">
                    This Person is Found Medically,
                  </span>
                  
                  {/* Double Interactive Centered Fit State Border Box */}
                  <div className={`mt-1.5 px-12 py-1 flex items-center justify-center min-w-[140px] ${fitStyle.borderClass}`}>
                    {isInlineEdit ? (
                      <input
                        type="text"
                        value={currentReport.fitStatus}
                        onChange={(e) => handleUpdateReport({ ...currentReport, fitStatus: e.target.value.toUpperCase() })}
                        className="text-center font-bold tracking-widest text-[16px] border-none bg-transparent w-full focus:outline-none uppercase text-green-700 text-[#1e40af]"
                        placeholder="FIT"
                      />
                    ) : (
                      <span className={`text-[16px] font-[950] tracking-widest leading-none ${fitStyle.colorClass}`}>
                        {fitStyle.text}
                      </span>
                    )}
                  </div>

                  <span className="mt-1.5 font-sans text-[11px] font-[500] text-gray-500 select-all leading-none">
                    For the above mentioned tests
                  </span>
                </div>

                {/* E. Verified Signatures & Seals segment */}
                <SealAndSignatures
                  config={currentReport.signatures}
                  isEditable={isInlineEdit}
                  onUpdate={(fields) => {
                    handleUpdateReport({
                      ...currentReport,
                      signatures: { ...currentReport.signatures, ...fields },
                    });
                  }}
                />

              </div>

              {/* F. Print-Only Flat Sticky Blue Banner at bottom of A4 */}
              <div className="w-full mt-4 bg-[#1352a2] text-white text-center py-1.5 select-all text-[11px] font-sans font-[600] tracking-wider rounded-sm shadow-sm flex items-center justify-center leading-none">
                WWW.ALJABBARMEDICAL.COM
              </div>

            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
