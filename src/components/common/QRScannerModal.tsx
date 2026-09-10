import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, QrCode, Camera, CheckCircle2, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { attendanceSessions, scanQRCode } = useCampus();
  const [tokenInput, setTokenInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeSession = attendanceSessions.find(s => s.isActive);

  useEffect(() => {
    if (isOpen && activeSession) {
      setTokenInput(activeSession.qrToken);
    }
  }, [isOpen, activeSession]);

  const handleScanSubmit = async (tokenToUse?: string) => {
    const finalToken = (tokenToUse || tokenInput).trim();
    if (!finalToken) {
      setErrorMsg('Please enter or scan a valid QR token.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    const result = await scanQRCode(finalToken);
    setIsProcessing(false);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      setCameraActive(false);
      return;
    }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setErrorMsg('Camera access is not available in this frame environment. Use one-click simulation below.');
      }
    } catch (e) {
      setErrorMsg('Camera permission not granted. Use the active QR code below.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Scan Attendance QR
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hold your camera towards faculty's dynamic screen or verify the active token.
          </p>
        </div>

        {/* Camera / Scanner Frame */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/40 p-4 mb-4 text-center">
          {cameraActive ? (
            <video ref={videoRef} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Camera Optical Scanner</p>
              <button
                onClick={toggleCamera}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                Enable Camera Feed
              </button>
            </div>
          )}

          {/* Scanner corner markers */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>
        </div>

        {/* Quick 1-Click Simulation for Active Faculty Session */}
        {activeSession ? (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Active Faculty Session Found
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeSession.subjectName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeSession.facultyName} • {activeSession.room}
                </p>
              </div>
              <button
                onClick={() => handleScanSubmit(activeSession.qrToken)}
                disabled={isProcessing}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Scan</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No active attendance session currently broadcast by faculty. You can manually enter token or ask faculty to start session.
          </div>
        )}

        {/* Manual Token Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Manual QR Token String
            </label>
            <input
              type="text"
              placeholder="e.g. QR-CS401-SESS-98231"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={() => handleScanSubmit()}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Verifying Token Signature...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Record Attendance</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
