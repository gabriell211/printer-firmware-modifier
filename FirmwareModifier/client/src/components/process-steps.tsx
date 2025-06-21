interface ProcessStepsProps {
  currentStep: number;
}

export function ProcessSteps({ currentStep }: ProcessStepsProps) {
  const steps = [
    { number: 1, label: "Upload Firmware" },
    { number: 2, label: "Inserir Serial" },
    { number: 3, label: "Processar" },
    { number: 4, label: "Download" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-8 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ${
                  step.number <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium ${
                  step.number <= currentStep
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-px bg-gray-300 ml-8"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
