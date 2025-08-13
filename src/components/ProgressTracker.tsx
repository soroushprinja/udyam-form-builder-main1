import { Check } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const ProgressTracker = ({ currentStep, totalSteps, stepTitles }: ProgressTrackerProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Registration Progress</h2>
      
      <div className="flex items-center justify-between">
        {stepTitles.slice(0, totalSteps).map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;
          const isLast = index === totalSteps - 1;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`step-indicator ${
                    isComplete
                      ? "step-complete"
                      : isActive
                      ? "step-active"
                      : "step-inactive"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive || isComplete
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    Step {stepNumber}
                  </p>
                  <p
                    className={`text-xs mt-1 max-w-24 ${
                      isActive || isComplete
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {title}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`step-connector ${
                    isComplete ? "complete" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gov-blue h-2 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;