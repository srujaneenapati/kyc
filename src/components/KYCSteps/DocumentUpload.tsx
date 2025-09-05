import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCamera } from '@/hooks/useCamera';
import { ArrowLeft, Camera, Upload, FileText, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onBack: () => void;
  onSuccess: (documentData: any) => void;
}

type DocType = 'aadhaar' | 'pan';

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onBack, onSuccess }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const camera = useCamera();
  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Store images for both documents
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<string | null>(null);

  // Camera state
  const [showCamera, setShowCamera] = useState(false);

  // Helper for camera actions
  const handleStartCamera = async (doc: DocType) => {
    setActiveDoc(doc);
    setShowCamera(true);
    await camera.startCamera();
  };

  const handleCapturePhoto = async () => {
    const result = await camera.capturePhoto();
    if (result && activeDoc) {
      if (activeDoc === 'aadhaar') setAadhaarImage(result.dataUrl);
      if (activeDoc === 'pan') setPanImage(result.dataUrl);
      camera.stopCamera();
      setShowCamera(false);
      toast({
        title: "Photo Captured",
        description: `${activeDoc === 'aadhaar' ? 'Aadhaar' : 'PAN'} photo captured successfully`,
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, doc: DocType) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (doc === 'aadhaar') setAadhaarImage(e.target?.result as string);
        if (doc === 'pan') setPanImage(e.target?.result as string);
        toast({
          title: "File Uploaded",
          description: `${doc === 'aadhaar' ? 'Aadhaar' : 'PAN'} uploaded successfully`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = (doc: DocType) => {
    if (doc === 'aadhaar') setAadhaarImage(null);
    if (doc === 'pan') setPanImage(null);
    setShowCamera(false);
    camera.stopCamera();
    setActiveDoc(null);
  };

  // Simulate OCR extraction for demo
  const extractDetailsFromImage = async (imageDataUrl: string, doc: DocType) => {
    if (!imageDataUrl) return { name: '', address: '', documentNumber: '' };
    if (doc === 'aadhaar') {
      return {
        name: "Ravi Kumar",
        address: "123, Main Road, Village, District, State - 123456",
        documentNumber: "1234 5678 9012"
      };
    } else {
      return {
        name: "Ravi Kumar",
        address: "",
        documentNumber: "ABCDE1234F"
      };
    }
  };

  const handleProcessDocument = async () => {
    if (!aadhaarImage || !panImage) return;
    setIsProcessing(true);

    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract details from both images
    const aadhaarDetails = await extractDetailsFromImage(aadhaarImage, 'aadhaar');
    const panDetails = await extractDetailsFromImage(panImage, 'pan');

    toast({
      title: "Documents Processed",
      description: "Both documents verified successfully",
    });

    const documentData = {
      name: aadhaarDetails.name,
      address: aadhaarDetails.address,
      aadhaar: { image: aadhaarImage, number: aadhaarDetails.documentNumber },
      pan: { image: panImage, number: panDetails.documentNumber }
    };

    onSuccess(documentData);
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
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">{t('uploadDocument')}</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-8">
          {/* Aadhaar Section */}
          <div className="space-y-4 animate-slide-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {t('aadhaarCard') || 'Aadhaar Card'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('aadhaarUploadDesc') || 'Upload or capture your Aadhaar card'}
              </p>
            </div>
            {!aadhaarImage && !showCamera && (
              <div className="flex gap-4">
                <Button
                  variant="camera"
                  size="lg"
                  onClick={() => handleStartCamera('aadhaar')}
                  className="flex-1"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t('takePhoto')}
                </Button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'aadhaar')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="aadhaar-upload"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <label htmlFor="aadhaar-upload" className="cursor-pointer">
                      <Upload className="w-5 h-5 mr-2" />
                      {t('gallery')}
                    </label>
                  </Button>
                </div>
              </div>
            )}
            {showCamera && activeDoc === 'aadhaar' && camera.isActive && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={camera.videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg shadow-lg"
                  />
                  {/* Document frame overlay */}
                  <div className="absolute inset-4 border-2 border-white/80 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleRetake('aadhaar')}
                    className="flex-1"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleCapturePhoto}
                    className="flex-1"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            )}
            {aadhaarImage && (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={aadhaarImage}
                    alt="Aadhaar"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleRetake('aadhaar')}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Retake/Reupload
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* PAN Section */}
          <div className="space-y-4 animate-slide-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {t('panCard') || 'PAN Card'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('panUploadDesc') || 'Upload or capture your PAN card'}
              </p>
            </div>
            {!panImage && !showCamera && (
              <div className="flex gap-4">
                <Button
                  variant="camera"
                  size="lg"
                  onClick={() => handleStartCamera('pan')}
                  className="flex-1"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t('takePhoto')}
                </Button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'pan')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="pan-upload"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <label htmlFor="pan-upload" className="cursor-pointer">
                      <Upload className="w-5 h-5 mr-2" />
                      {t('gallery')}
                    </label>
                  </Button>
                </div>
              </div>
            )}
            {showCamera && activeDoc === 'pan' && camera.isActive && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={camera.videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg shadow-lg"
                  />
                  {/* Document frame overlay */}
                  <div className="absolute inset-4 border-2 border-white/80 rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleRetake('pan')}
                    className="flex-1"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleCapturePhoto}
                    className="flex-1"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            )}
            {panImage && (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={panImage}
                    alt="PAN"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleRetake('pan')}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Retake/Reupload
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="space-y-4">
            <Button
              variant="success"
              size="lg"
              onClick={handleProcessDocument}
              disabled={!aadhaarImage || !panImage || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('continue')}
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {(camera.error) && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">{camera.error}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-white/60 rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              {t('docHelpText') || 'Ensure both documents are clear and all corners are visible'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};