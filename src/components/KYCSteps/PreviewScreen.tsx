import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, CheckCircle, FileText, User } from 'lucide-react';

interface PreviewScreenProps {
  documentData: any;
  method: 'digilocker' | 'documents';
  onBack: () => void;
  onContinue: () => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  documentData,
  method,
  onBack,
  onContinue,
}) => {
  const { t } = useLanguage();

  // Try to extract name, aadhaar, address from documentData for both methods
  const name =
    method === 'digilocker'
      ? documentData?.name
      : documentData?.name || 'Sample Name';
  const aadhaar =
    method === 'digilocker'
      ? documentData?.aadhaar
      : documentData?.aadhaar?.number || documentData?.aadhaar?.documentNumber || 'XXXX XXXX XXXX';
  const address =
    method === 'digilocker'
      ? documentData?.address
      : documentData?.address || 'Sample Address';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Button>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">Preview Details</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-8 animate-slide-up">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Review Your Details
            </h3>
            <p className="text-muted-foreground">
              Please confirm your details before proceeding to face verification.
            </p>
          </div>

          <div className="bg-white/80 rounded-xl border p-6 space-y-6 shadow-card">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                <span className="text-base font-semibold text-foreground">Name</span>
              </div>
              <div className="pl-9 text-lg font-bold text-primary">{name}</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-base font-semibold text-foreground">Aadhaar Number</span>
              </div>
              <div className="pl-9 text-lg font-mono tracking-widest text-foreground">{aadhaar}</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-base font-semibold text-foreground">Address</span>
              </div>
              <div className="pl-9 text-base text-muted-foreground">{address}</div>
            </div>
            {method === 'documents' && (
              <>
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">Aadhaar Card</span>
                  </div>
                  {documentData?.aadhaar?.image && (
                    <img
                      src={documentData.aadhaar.image}
                      alt="Aadhaar"
                      className="w-full rounded-lg shadow mb-2"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">PAN Card</span>
                  </div>
                  {documentData?.pan?.image && (
                    <img
                      src={documentData.pan.image}
                      alt="PAN"
                      className="w-full rounded-lg shadow"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <Button
            variant="success"
            size="lg"
            onClick={onContinue}
            className="w-full"
          >
            Continue to Face Verification
          </Button>
        </div>
      </div>
    </div>
  );
};
