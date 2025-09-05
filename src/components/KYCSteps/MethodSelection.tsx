import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Smartphone, FileText, Camera, ChevronRight } from 'lucide-react';

interface MethodSelectionProps {
  onBack: () => void;
  onSelectMethod: (method: 'digilocker' | 'documents') => void;
}

export const MethodSelection: React.FC<MethodSelectionProps> = ({ onBack, onSelectMethod }) => {
  const { t } = useLanguage();

  const methods = [
    {
      key: 'digilocker' as const,
      title: t('digilocker'),
      description: t('digilockerDesc'),
      icon: Smartphone,
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      key: 'documents' as const,
      title: t('documents'),
      description: t('documentsDesc'),
      icon: FileText,
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/50 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {t('chooseMethod')}
        </h2>
        <div className="w-20" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-slide-up">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {t('chooseMethod')}
            </h3>
            <p className="text-muted-foreground">
              {t('selectMethodDesc') || 'Select your document verification method. Face verification will follow next.'}
            </p>
          </div>

          {/* Method Cards */}
          <div className="space-y-4">
            {methods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.key}
                  className={`animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Button
                    variant="outline"
                    onClick={() => onSelectMethod(method.key)}
                    className="w-full h-20 p-0 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-4 w-full px-6">
                      <div className={`w-12 h-12 rounded-xl ${method.gradient} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {method.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-white/60 rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              {t('stepIndicator') || 'Step 1: Document verification → Step 2: Face verification → Step 3: Success'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};