import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Step = {
  title: string;
  content: string;
};

type OnboardingContextType = {
  registerStep: (ref: React.RefObject<HTMLElement>) => void;
  currentStepIndex: number;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboardingStep() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingStep must be used within an OnboardingProvider");
  }
  return context;
}

export function OnboardingStep({ children }: { children: ReactNode }) {
  const { registerStep } = useOnboardingStep();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      registerStep(ref);
    }
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}

type OnboardingProps = {
  steps: Step[];
  onComplete?: () => void;
  children: ReactNode;
  enabled?: boolean;
  defaultStep?: number;
};

export function Onboarding({ steps, onComplete, children, enabled, defaultStep = 0 }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(defaultStep);
  const [stepRefs, setStepRefs] = useState<React.RefObject<HTMLElement>[]>([]);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const registerStep = (ref: React.RefObject<HTMLElement>) => {
    setStepRefs((prev) => [...prev, ref]);
  };

  useEffect(() => {
    if (stepRefs[currentStep] && stepRefs[currentStep].current) {
      setTargetElement(stepRefs[currentStep].current);
    }
  }, [currentStep, stepRefs]);

  useEffect(() => {
    if (!enabled) {
      setCurrentStep(defaultStep);
    }
  }, [enabled]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const contextValue = {
    registerStep,
    currentStepIndex: currentStep,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      {targetElement &&
        enabled &&
        createPortal(
          <OnboardingOverlay
            targetElement={targetElement}
            step={steps[currentStep]}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />,
          document.body
        )}
    </OnboardingContext.Provider>
  );
}

type OnboardingOverlayProps = {
  targetElement: HTMLElement;
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

function OnboardingOverlay({ targetElement, step, onNext, onPrev, isFirstStep, isLastStep }: OnboardingOverlayProps) {
  const { top, left, width, height } = targetElement.getBoundingClientRect();
  const padding = 10; // Padding around the highlighted area

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-300 ease-in-out"
        style={{
          clipPath: `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%,
            0% ${top - padding}px, ${left - padding}px ${top - padding}px, 
            ${left - padding}px ${top + height + padding}px, ${left + width + padding}px ${top + height + padding}px, 
            ${left + width + padding}px ${top - padding}px, 0% ${top - padding}px
          )`,
        }}
      />
      <div
        className="absolute transition-all duration-300 ease-in-out pointer-events-auto"
        style={{
          top: `${top - padding}px`,
          left: `${left - padding}px`,
          width: `${width + padding * 2}px`,
          height: `${height + padding * 2}px`,
        }}
      />
      <Card className="w-80 absolute pointer-events-auto" style={{ top: `${top + height + 20}px`, left: `${left}px` }}>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{step.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onPrev} disabled={isFirstStep} variant="outline">
            上一步
          </Button>
          <Button onClick={onNext}>{isLastStep ? "完成" : "下一步"}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
