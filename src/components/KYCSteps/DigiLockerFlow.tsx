import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Smartphone, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DigiLockerFlowProps {
  onBack: () => void;
  onSuccess: (documentData: any) => void;
}

export const DigiLockerFlow: React.FC<DigiLockerFlowProps> = ({ onBack, onSuccess }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'processing'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAadhaarSubmit = async () => {
    if (aadhaarNumber.length !== 12) {
      toast({
        title: "Invalid Aadhaar",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Redirect to DigiLocker for real authentication
    const digiLockerUrl = `https://www.digilocker.gov.in/`;
    window.open(digiLockerUrl, '_blank');
    
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('otp');
    toast({
      title: "OTP Sent",
      description: "OTP has been sent to your registered mobile number",
    });
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setStep('processing');
    
    // Simulate DigiLocker verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const documentData = {
      name: "John Doe",
      aadhaar: aadhaarNumber,
      dateOfBirth: "01/01/1990",
      address: "Sample Address"
    };
    
    toast({
      title: "Document Verification Successful",
      description: "Your DigiLocker verification is complete. Proceeding to face verification.",
    });
    
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
          <Smartphone className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">{t('digilocker')}</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'aadhaar' ? 'bg-primary text-white' : 'bg-success text-white'
          }`}>
            {step === 'aadhaar' ? '1' : <CheckCircle className="w-4 h-4" />}
          </div>
          <div className="h-1 w-16 bg-muted">
            <div className={`h-full bg-primary transition-all duration-500 ${
              step !== 'aadhaar' ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'otp' ? 'bg-primary text-white' : 
            step === 'processing' ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
          }`}>
            {step === 'processing' ? <CheckCircle className="w-4 h-4" /> : '2'}
          </div>
          <div className="h-1 w-16 bg-muted">
            <div className={`h-full bg-primary transition-all duration-500 ${
              step === 'processing' ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'processing' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          {step === 'aadhaar' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('aadhaarNumber')}
                </h3>
                <p className="text-muted-foreground">
                  Enter your 12-digit Aadhaar number to fetch your details from DigiLocker
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="1234 5678 9012"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="h-14 text-center text-lg tracking-wider"
                  maxLength={12}
                />
                
                <Button
                  onClick={handleAadhaarSubmit}
                  disabled={aadhaarNumber.length !== 12 || isLoading}
                  className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    t('continue')
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('enterOTP')}
                </h3>
                <p className="text-muted-foreground">
                  Enter the 6-digit OTP sent to your registered mobile number
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-14 text-center text-lg tracking-wider"
                  maxLength={6}
                />
                
                <Button
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    t('continue')
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-6 animate-slide-up">
              <div className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto animate-pulse-success">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('processing')}
                </h3>
                <p className="text-muted-foreground">
                  Fetching your details from DigiLocker...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};