import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ProgressTracker from "./ProgressTracker";
import Step1AadhaarVerification from "./steps/Step1AadhaarVerification";
import Step2BasicDetails from "./steps/Step2BasicDetails";
import Step3BusinessDetails from "./steps/Step3BusinessDetails";
import { createSubmission, saveStep1, saveStep2, saveStep3 } from "@/lib/api";

const stepTitles = [
  "Aadhaar Verification",
  "Basic Details",
  "Business Details", 
  "Additional Details",
  "Final Submission"
];

// Form schemas for each step
const step1Schema = z.object({
  aadhaarNumber: z
    .string()
    .min(12, "Aadhaar number must be 12 digits")
    .max(12, "Aadhaar number must be 12 digits")
    .regex(/^\d+$/, "Aadhaar number must contain only digits"),
  entrepreneurName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  consent: z.boolean().refine(val => val === true, {
    message: "You must provide consent to proceed"
  }),
  // PAN Verification fields
  typeOfOrganisation: z.string().min(1, "Please select type of organisation"),
  panNumber: z
    .string()
    .length(10, "PAN must be 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"),
  panHolderName: z
    .string()
    .min(2, "Name must be at least 2 characters"),
  dobOrDoi: z
    .string()
    .min(1, "Date of birth/incorporation is required"),
  panConsent: z.boolean().refine(val => val === true, {
    message: "You must provide PAN consent to proceed"
  })
});

const step2Schema = z.object({
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  emailAddress: z
    .string()
    .email("Please enter a valid email address"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required"),
  gender: z
    .enum(["male", "female", "other"], {
      required_error: "Please select your gender"
    }),
  socialCategory: z
    .string()
    .min(1, "Please select your social category"),
  physicallyHandicapped: z
    .enum(["yes", "no"], {
      required_error: "Please specify if physically handicapped"
    })
});

const step3Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.enum(["manufacturing", "service", "trading"], {
    required_error: "Please select business type"
  }),
  businessCategory: z.string().min(1, "Please select business category"),
  businessAddress: z.string().min(10, "Address must be at least 10 characters"),
  businessCity: z.string().min(2, "City must be at least 2 characters"),
  businessState: z.string().min(1, "Please select state"),
  businessPincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  businessPhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  businessEmail: z.string().email("Please enter a valid email address"),
  businessWebsite: z.string().url().optional().or(z.literal("")),
  businessDescription: z.string().min(20, "Description must be at least 20 characters"),
  investmentInPlant: z.number().min(0, "Investment cannot be negative"),
  investmentInEquipment: z.number().min(0, "Investment cannot be negative"),
  totalInvestment: z.number().min(0, "Total investment cannot be negative"),
  employmentGenerated: z.number().min(0, "Employment count cannot be negative"),
  dateOfCommencement: z.string().min(1, "Date of commencement is required"),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please enter a valid GSTIN").optional().or(z.literal("")),
  udyogAadhaar: z.string().min(1, "Udyog Aadhaar is required"),
  emIID: z.string().min(1, "EM-II ID is required"),
  bankAccountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  bankBranch: z.string().min(2, "Branch name must be at least 2 characters"),
  bankIFSCCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"),
  bankAccountType: z.enum(["savings", "current", "overdraft"], {
    required_error: "Please select account type"
  }),
  nomineeName: z.string().min(2, "Nominee name must be at least 2 characters"),
  nomineeRelationship: z.string().min(1, "Please select relationship"),
  nomineeAddress: z.string().min(10, "Nominee address must be at least 10 characters"),
  nomineePhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  nomineeEmail: z.string().email("Please enter a valid email address"),
  nomineePAN: z.string().length(10, "PAN must be 10 characters").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"),
  nomineeAadhaar: z.string().length(12, "Aadhaar must be 12 digits").regex(/^\d+$/, "Aadhaar must contain only digits"),
  nomineeConsent: z.boolean().refine(val => val === true, {
    message: "You must provide nominee consent to proceed"
  })
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

const UdyamForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    step1?: Step1Data;
    step2?: Step2Data;
    step3?: Step3Data;
  }>({});

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      aadhaarNumber: "",
      entrepreneurName: "",
      consent: false,
      typeOfOrganisation: "",
      panNumber: "",
      panHolderName: "",
      dobOrDoi: "",
      panConsent: false
    }
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      mobileNumber: "",
      emailAddress: "",
      dateOfBirth: "",
      gender: undefined,
      socialCategory: "",
      physicallyHandicapped: undefined
    }
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      businessName: "",
      businessType: undefined,
      businessCategory: "",
      businessAddress: "",
      businessCity: "",
      businessState: "",
      businessPincode: "",
      businessPhone: "",
      businessEmail: "",
      businessWebsite: "",
      businessDescription: "",
      investmentInPlant: 0,
      investmentInEquipment: 0,
      totalInvestment: 0,
      employmentGenerated: 0,
      dateOfCommencement: "",
      gstin: "",
      udyogAadhaar: "",
      emIID: "",
      bankAccountNumber: "",
      bankName: "",
      bankBranch: "",
      bankIFSCCode: "",
      bankAccountType: undefined,
      nomineeName: "",
      nomineeRelationship: "",
      nomineeAddress: "",
      nomineePhone: "",
      nomineeEmail: "",
      nomineePAN: "",
      nomineeAadhaar: "",
      nomineeConsent: false
    }
  });

  useEffect(() => {
    // Initialize or reuse submission id in localStorage
    const cached = localStorage.getItem('submissionId');
    if (cached) {
      setSubmissionId(cached);
      return;
    }
    createSubmission()
      .then(({ id }) => {
        localStorage.setItem('submissionId', id);
        setSubmissionId(id);
      })
      .catch(() => {
        toast.error("Unable to initialize submission");
      });
  }, []);

  const handleStep1Submit = async (data: Step1Data) => {
    if (!submissionId) {
      toast.error("Submission not ready. Please try again.");
      return;
    }
    try {
      await saveStep1(submissionId, data as any);
      toast.success("Verification successful! Moving to next step...");
      setFormData(prev => ({ ...prev, step1: data }));
      setCurrentStep(2);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Step 1");
    }
  };

  const handleStep2Submit = async (data: Step2Data) => {
    if (!submissionId) {
      toast.error("Submission not ready. Please try again.");
      return;
    }
    try {
      await saveStep2(submissionId, data as any);
      setFormData(prev => ({ ...prev, step2: data }));
      setCurrentStep(3);
      toast.success("Step 2 completed successfully! Moving to next step...");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Step 2");
    }
  };

  const handleStep3Submit = async (data: Step3Data) => {
    if (!submissionId) {
      toast.error("Submission not ready. Please try again.");
      return;
    }
    try {
      await saveStep3(submissionId, data as any);
      setFormData(prev => ({ ...prev, step3: data }));
      toast.success("Step 3 completed successfully! Moving to next step...");
      setCurrentStep(4);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save Step 3");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gov-text mb-2">
            UDYAM REGISTRATION FORM
          </h1>
          <p className="text-gov-text-light text-lg">
            For New Enterprise who are not Registered yet as MSME
          </p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker 
          currentStep={currentStep} 
          totalSteps={5} 
          stepTitles={stepTitles} 
        />

        {/* Form Steps */}
        <div className="form-container">
          {currentStep === 1 && (
            <Step1AadhaarVerification
              form={step1Form}
              onSubmit={handleStep1Submit}
              formData={formData.step1}
            />
          )}
          
          {currentStep === 2 && (
            <Step2BasicDetails
              form={step2Form}
              onSubmit={handleStep2Submit}
              onPrevious={handlePrevStep}
              formData={formData.step2}
            />
          )}

          {currentStep === 3 && (
            <Step3BusinessDetails
              form={step3Form}
              onSubmit={handleStep3Submit}
              onPrevious={handlePrevStep}
              formData={formData.step3}
            />
          )}

          {currentStep === 4 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Additional Details & Final Submission
              </h2>
              <p className="text-gray-600 mb-6">
                This step will include additional business details, compliance information, 
                and final submission. Coming soon!
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handlePrevStep}
                  className="btn-secondary"
                >
                  Previous Step
                </Button>
                <Button
                  onClick={() => setCurrentStep(5)}
                  className="btn-primary"
                >
                  Continue to Final Step
                </Button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Final Review & Submission
              </h2>
              <p className="text-gray-600 mb-6">
                Review all your information and submit your Udyam registration application.
                Coming soon!
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handlePrevStep}
                  className="btn-secondary"
                >
                  Previous Step
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Form completed! (Demo ends here)");
                    console.log("Complete Form Data:", formData);
                  }}
                  className="btn-primary"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Information */}
        <div className="mt-8 bg-gov-header rounded-lg shadow-lg">
          <div className="px-6 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">UDYAM REGISTRATION</h3>
                <p className="text-white/90 text-sm">
                  Ministry of MSME
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">Our Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                      CHAMPIONS
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                      MSME Schemes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                      Grievance Portal
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Video</h4>
                <div className="bg-white/10 rounded-md p-4">
                  <p className="text-white/80 text-sm">
                    Watch our registration tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UdyamForm;