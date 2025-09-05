import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Shield, CheckCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">{t('appTitle') || 'Bharat KYC'}</span>
        </div>
        <Globe className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Hero Illustration */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('welcome')}
            </h1>
            <p className="text-muted-foreground text-center">
              {t('secureSimple') || 'Secure and simple verification process'}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">{t('secure') || 'Secure'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">{t('fast') || 'Fast'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">{t('trusted') || 'Trusted'}</p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {t('selectLanguage')}
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="h-12">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-sm text-muted-foreground">({lang.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onNext}
            size="lg"
            className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-lg font-semibold shadow-button"
          >
            {t('startKYC')}
          </Button>
        </div>
      </div>
    </div>
  );
};