import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCamera } from '@/hooks/useCamera';
import { ArrowLeft, Camera, CheckCircle, User, Eye, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceVerificationProps {
  onBack: () => void;
  onSuccess: (faceData: string, isMatched: boolean) => void;
  documentData?: any;
  verificationMethod?: 'digilocker' | 'documents';
}

export const FaceVerification: React.FC<FaceVerificationProps> = ({
  onBack,
  onSuccess,
  documentData,
  verificationMethod,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const [step, setStep] = useState<'instructions' | 'camera' | 'processing'>('instructions');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [showCameraPopup, setShowCameraPopup] = useState(false);

  const instructions = [
    { text: 'Look straight at the camera', icon: Eye },
    { text: 'Blink your eyes', icon: Eye },
    { text: 'Turn your head slightly left', icon: RotateCcw },
    { text: 'Turn your head slightly right', icon: RotateCcw },
    { text: 'Smile naturally', icon: User }
  ];

  useEffect(() => {
    if (step === 'camera' && instructionIndex < instructions.length) {
      const timer = setTimeout(() => {
        setInstruction(instructions[instructionIndex].text);
        setInstructionIndex(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // When all instructions are done, clear instruction and auto-capture
    if (step === 'camera' && instructionIndex >= instructions.length && isActive) {
      setInstruction('');
      // Automatically capture photo and proceed
      (async () => {
        const result = await capturePhoto();
        if (result) {
          setCapturedImage(result.dataUrl);
          stopCamera();
          setShowCameraPopup(false);
          setStep('processing');
          await new Promise(resolve => setTimeout(resolve, 2000));
          toast({
            title: "Face Verification Complete",
            description: "Your identity has been verified successfully",
          });
          onSuccess(result.dataUrl, true);
        }
      })();
    }
  }, [step, instructionIndex, isActive]);

  const handleStartVerification = async () => {
    setShowCameraPopup(true);
    setStep('camera');
    await startCamera();
    setInstruction(instructions[0].text);
    setInstructionIndex(1);
  };

  const handleCaptureComplete = async () => {
    const result = await capturePhoto();
    if (result) {
      setCapturedImage(result.dataUrl);
      stopCamera();
      setShowCameraPopup(false);
      setStep('processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Face Verification Complete",
        description: "Your identity has been verified successfully",
      });
      onSuccess(result.dataUrl, true);
    }
  };

  const handleCloseCameraPopup = () => {
    setShowCameraPopup(false);
    stopCamera();
    setStep('instructions');
    setInstructionIndex(0);
    setInstruction('');
  };

  const handleRetry = () => {
    setStep('instructions');
    setInstructionIndex(0);
    setInstruction('');
    setCapturedImage(null);
    stopCamera();
    setShowCameraPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Button>
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">{t('verifyFace')}</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          {step === 'instructions' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('verifyFace')}
                </h3>
                <p className="text-muted-foreground">
                  {t('lookAtCamera')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 rounded-lg border p-4">
                  <h4 className="font-semibold text-foreground mb-3">Follow these steps:</h4>
                  <div className="space-y-3">
                    {instructions.map((instr, index) => {
                      const IconComponent = instr.icon;
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{instr.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="camera"
                  size="xl"
                  onClick={handleStartVerification}
                  className="w-full"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Start Verification
                </Button>
              </div>
            </div>
          )}

          {/* Camera Popup */}
          {showCameraPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-sm relative flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseCameraPopup}
                  className="absolute top-3 right-3"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="w-full flex flex-col items-center pt-6 pb-4 px-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t('verifyFace')}
                  </h3>
                  <p className="text-primary font-medium animate-pulse mb-2">
                    {instruction}
                  </p>
                  <div className="relative w-full flex items-center justify-center mb-4">
                    <div className="rounded-lg overflow-hidden border border-primary/20 shadow-lg bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-72 h-72 object-cover bg-black"
                        style={{ borderRadius: '0.75rem' }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    {instructions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          idx < instructionIndex ? 'bg-success' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-6 animate-slide-up">
              <div className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto animate-pulse-success">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white animate-spin rounded-full"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Verifying...
                </h3>
                <p className="text-muted-foreground">
                  Checking liveness and matching your face
                </p>
              </div>
              {capturedImage && (
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-success/20">
                  <img
                    src={capturedImage}
                    alt="Captured face"
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleRetry}
                className="w-full"
              >
                {t('retry')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};