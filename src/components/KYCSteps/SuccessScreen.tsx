import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Download, Share, Home, XCircle, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface SuccessScreenProps {
  onComplete: () => void;
  isSuccess?: boolean;
  failureReason?: string;
  onRetry?: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onComplete,
  isSuccess = true,
  failureReason,
  onRetry,
}) => {
  const { t } = useLanguage();

  // Generate a fixed KYC reference for the session
  const [kycRef] = React.useState(() => {
    const stored = localStorage.getItem('kycRef');
    if (stored) return stored;
    const generated = `KYC-${Date.now().toString().slice(-8)}`;
    localStorage.setItem('kycRef', generated);
    return generated;
  });

  // Get user name from localStorage if available (set during verification)
  const [userName, setUserName] = React.useState<string>('');
  useEffect(() => {
    const docData = localStorage.getItem('kycUserName');
    if (docData) setUserName(docData);
  }, []);

  // Generate QR code data URL for KYC reference
  const [qrUrl, setQrUrl] = React.useState<string>('');
  useEffect(() => {
    QRCode.toDataURL(kycRef, { width: 128, margin: 1 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
  }, [kycRef]);

  useEffect(() => {
    if (isSuccess) {
      // Confetti animation effect
      const createConfetti = () => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 1000;
            animation: confetti-fall ${2 + Math.random() * 3}s ease-out forwards;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
          `;
          
          document.body.appendChild(confetti);
          
          setTimeout(() => {
            confetti.remove();
          }, 5000);
        }
      };

      // Add confetti animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      createConfetti();

      return () => {
        style.remove();
      };
    }
  }, [isSuccess]);

  // Helper for clean, structured PDF download with QR
  const generatePdfBlob = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor('#10b981');
    doc.text(t('success'), 40, 60);

    // Divider
    doc.setDrawColor('#10b981');
    doc.setLineWidth(1.5);
    doc.line(40, 75, 555, 75);

    // Main message
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor('#222');
    doc.text(
      userName
        ? `${t('kycCompleted')}, ${userName}!`
        : t('kycCompleted'),
      40,
      110
    );

    doc.setFontSize(13);
    doc.setTextColor('#444');
    doc.text(
      t('kycSuccessMsg') ||
        'Your identity verification has been completed successfully. You can now access all services.',
      40,
      135
    );

    // Verification Summary
    doc.setFontSize(15);
    doc.setTextColor('#10b981');
    doc.text(t('verificationSummary'), 40, 170);

    doc.setFontSize(12);
    doc.setTextColor('#222');
    doc.text(`${t('documentVerification')}: ${t('verified')}`, 60, 195);
    doc.text(`${t('faceVerification')}: ${t('verified')}`, 60, 215);

    // Reference ID
    doc.setFontSize(12);
    doc.setTextColor('#666');
    doc.text(`${t('referenceId')}: ${kycRef}`, 40, 250);

    // QR code
    if (qrUrl) {
      doc.addImage(qrUrl, 'PNG', 420, 180, 100, 100);
      doc.setFontSize(11);
      doc.setTextColor('#10b981');
      doc.text(t('scanQR') || 'Scan this QR to verify your KYC', 420, 295);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text(t('kycDataSecure'), 40, 320);

    // Branding
    doc.setFontSize(12);
    doc.setTextColor('#10b981');
    doc.text('Bharat KYC', 40, 350);

    return doc;
  };

  const handleDownload = async () => {
    const doc = await generatePdfBlob();
    doc.save('kyc-success.pdf');
  };

  const handleShare = async () => {
    try {
      const doc = await generatePdfBlob();
      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], 'kyc-success.pdf', { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'KYC Success Certificate',
          text: 'Here is my KYC verification certificate.',
          files: [file],
        });
      } else {
        alert('Sharing PDF is not supported on this device/browser. Please download and share manually.');
      }
    } catch (err) {
      alert('Failed to share PDF.');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isSuccess ? 'from-success/5 to-success/10' : 'from-destructive/5 to-destructive/10'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <>
              <CheckCircle className="w-6 h-6 text-success" />
              <span className="text-lg font-semibold text-success">KYC Complete</span>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-destructive" />
              <span className="text-lg font-semibold text-destructive">KYC Failed</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center space-y-8 animate-slide-up">
          {/* Success/Failure Animation */}
          <div className="relative">
            {isSuccess ? (
              <>
                <div className="w-32 h-32 bg-gradient-success rounded-full flex items-center justify-center mx-auto animate-bounce-in">
                  <CheckCircle className="w-20 h-20 text-white" />
                </div>
                <div className="absolute inset-0 w-32 h-32 bg-success/20 rounded-full mx-auto animate-ping"></div>
              </>
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
                <XCircle className="w-20 h-20 text-white" />
              </div>
            )}
          </div>

          {/* Show QR code on success */}
          {isSuccess && qrUrl && (
            <div className="flex flex-col items-center space-y-2">
              <img src={qrUrl} alt="KYC QR" className="mx-auto w-32 h-32" />
              <span className="text-xs text-muted-foreground">{t('scanQR') || 'Scan this QR to verify your KYC'}</span>
            </div>
          )}

          {/* Success/Failure Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              {isSuccess ? t('success') : 'Verification Failed'}
            </h1>
            <p className={`text-xl font-semibold ${isSuccess ? 'text-success' : 'text-destructive'}`}>
              {isSuccess
                ? userName
                  ? `${t('kycCompleted')}, ${userName}!`
                  : t('kycCompleted')
                : 'KYC Verification Failed'}
            </p>
            <p className="text-muted-foreground">
              {isSuccess 
                ? 'Your identity verification has been completed successfully. You can now access all services.'
                : failureReason || 'Verification could not be completed. Please try again.'
              }
            </p>
          </div>

          {/* Verification Summary */}
          <div className="bg-white/60 rounded-lg border p-6 space-y-4">
            <h3 className="font-semibold text-foreground mb-4">Verification Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Document Verification</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Verified</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Face Verification</span>
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Failed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isSuccess ? (
              <>
                <Button
                  variant="success"
                  size="xl"
                  onClick={onComplete}
                  className="w-full"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Continue to Dashboard
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="gap-2" onClick={handleDownload}>
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
                    <Share className="w-5 h-5" />
                    Share Status
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="default"
                  size="xl"
                  onClick={onRetry}
                  className="w-full"
                >
                  <RefreshCw className="w-6 h-6 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onComplete}
                  className="w-full"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Go to Home
                </Button>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {isSuccess ? (
                <>
                  Your KYC data is encrypted and stored securely.<br />
                  Reference ID: {kycRef}
                </>
              ) : (
                'If you continue to face issues, please contact support for assistance.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};