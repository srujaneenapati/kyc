import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { WelcomeScreen } from './KYCSteps/WelcomeScreen';
import { MethodSelection } from './KYCSteps/MethodSelection';
import { DigiLockerFlow } from './KYCSteps/DigiLockerFlow';
import { DocumentUpload } from './KYCSteps/DocumentUpload';
import { FaceVerification } from './KYCSteps/FaceVerification';
import { SuccessScreen } from './KYCSteps/SuccessScreen';
import { PreviewScreen } from './KYCSteps/PreviewScreen';

type KYCStep = 'welcome' | 'method-selection' | 'digilocker' | 'documents' | 'preview' | 'face' | 'success' | 'failed';
type KYCMethod = 'digilocker' | 'documents';
type VerificationData = {
  method: KYCMethod;
  documentData?: any;
  faceData?: string;
};

export const KYCApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<KYCStep>('welcome');
  const [selectedMethod, setSelectedMethod] = useState<KYCMethod | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [failureReason, setFailureReason] = useState<string>('');

  const handleStepChange = (step: KYCStep) => {
    setCurrentStep(step);
  };

  const handleMethodSelection = (method: KYCMethod) => {
    setSelectedMethod(method);
    setVerificationData({ method });
    setCurrentStep(method);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'method-selection':
        setCurrentStep('welcome');
        break;
      case 'digilocker':
      case 'documents':
        setCurrentStep('method-selection');
        setSelectedMethod(null);
        setVerificationData(null);
        break;
      case 'face':
        setCurrentStep(selectedMethod || 'method-selection');
        break;
      default:
        break;
    }
  };

  const handleDocumentVerificationSuccess = (documentData: any) => {
    setVerificationData(prev => prev ? { ...prev, documentData } : null);
    setCurrentStep('preview');
  };

  const handlePreviewContinue = () => {
    setCurrentStep('face');
  };

  const handleFaceVerificationSuccess = (faceData: string, isMatched: boolean) => {
    setVerificationData(prev => prev ? { ...prev, faceData } : null);
    
    if (isMatched) {
      setCurrentStep('success');
    } else {
      setFailureReason('Face verification failed - face does not match with uploaded documents');
      setCurrentStep('failed');
    }
  };

  const handleComplete = () => {
    // Reset the flow or navigate to main app
    setCurrentStep('welcome');
    setSelectedMethod(null);
    setVerificationData(null);
    setFailureReason('');
  };

  const handleRetry = () => {
    setCurrentStep('method-selection');
    setSelectedMethod(null);
    setVerificationData(null);
    setFailureReason('');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {currentStep === 'welcome' && (
          <WelcomeScreen onNext={() => handleStepChange('method-selection')} />
        )}
        
        {currentStep === 'method-selection' && (
          <MethodSelection 
            onBack={handleBack}
            onSelectMethod={handleMethodSelection}
          />
        )}
        
        {currentStep === 'digilocker' && (
          <DigiLockerFlow
            onBack={handleBack}
            onSuccess={handleDocumentVerificationSuccess}
          />
        )}

        {currentStep === 'documents' && (
          <DocumentUpload
            onBack={handleBack}
            onSuccess={handleDocumentVerificationSuccess}
          />
        )}

        {currentStep === 'preview' && verificationData && (
          <PreviewScreen
            documentData={verificationData.documentData}
            method={verificationData.method}
            onBack={() => setCurrentStep(verificationData.method)}
            onContinue={handlePreviewContinue}
          />
        )}

        {currentStep === 'face' && verificationData && (
          <FaceVerification
            onBack={handleBack}
            onSuccess={handleFaceVerificationSuccess}
            documentData={verificationData.documentData}
            verificationMethod={verificationData.method}
          />
        )}
        
        {currentStep === 'success' && (
          <SuccessScreen onComplete={handleComplete} />
        )}
        
        {currentStep === 'failed' && (
          <SuccessScreen 
            onComplete={handleComplete} 
            isSuccess={false} 
            failureReason={failureReason}
            onRetry={handleRetry}
          />
        )}
      </div>
    </LanguageProvider>
  );
};