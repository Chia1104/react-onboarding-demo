import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slot, Slottable } from "@radix-ui/react-slot";

type Step = {
  id: string;
  title: string;
  content: string;
  targetRef: React.RefObject<HTMLElement>;
};

type OnboardingContextType = {
  currentStepIndex: number;
} & Omit<OnboardingProps, "children">;

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboardingStep() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingStep must be used within an OnboardingProvider");
  }
  return context;
}

export function OnboardingStep({ children, id }: { children: ReactNode; id: string }) {
  const context = React.useContext(OnboardingContext);
  const targetRef = context?.steps.find((step) => step.id === id)?.targetRef;
  return (
    <Slot ref={targetRef}>
      <Slottable>{children}</Slottable>
    </Slot>
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
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (steps[currentStep] && steps[currentStep].targetRef.current) {
      setTargetElement(steps[currentStep].targetRef.current);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (!enabled) {
      setCurrentStep(defaultStep);
    }
  }, [enabled, defaultStep]);

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
    currentStepIndex: currentStep,
    steps,
    onComplete,
    enabled,
    defaultStep,
  } satisfies OnboardingContextType;

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
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-300 ease-in-out pointer-events-auto"
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
        className="absolute"
        style={{
          top: `${top - padding}px`,
          left: `${left - padding}px`,
          width: `${width + 2 * padding}px`,
          height: `${height + 2 * padding}px`,
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
