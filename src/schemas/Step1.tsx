import { UseFormReturn } from "react-hook-form";
import { FormData } from "../schemas/step1Schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step1Props {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  onPrevious?: () => void;
  formData?: FormData;
}

const Step1 = ({ form, onSubmit, onPrevious, formData }: Step1Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

  const aadhaar_consentValue = watch("aadhaar_consent");
  const checkboxValue = watch("checkbox");

  return (
    <div>
      {/* Form Header */}
      <div className="form-header">
        Aadhaar Verification
      </div>

      {/* Form Content */}
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Your Aadhaar No */}
          <div>
            <Label className="form-field-label">
              Your Aadhaar No
            </Label>
            <Input
              {...register("aadhaar_number")}
              placeholder="Your Aadhaar No"
              className="form-field-input"
            />
            {errors.aadhaar_number && (
              <p className="form-field-error">{errors.aadhaar_number.message}</p>
            )}
          </div>

          {/* Name as per Aadhaar */}
          <div>
            <Label className="form-field-label">
              Name as per Aadhaar
            </Label>
            <Input
              {...register("entrepreneur_name")}
              placeholder="Name as per Aadhaar"
              className="form-field-input"
            />
            {errors.entrepreneur_name && (
              <p className="form-field-error">{errors.entrepreneur_name.message}</p>
            )}
          </div>

          {/* I consent to the use of my Aadhaar number for Udyam registration */}
          <div>
            <Label className="form-field-label">
              I consent to the use of my Aadhaar number for Udyam registration
              <span className="form-field-required">*</span>
            </Label>
            <div className="checkbox-container">
              <Checkbox
                id="aadhaar_consent"
                checked={aadhaar_consentValue}
                onCheckedChange={(checked) => setValue("aadhaar_consent", !!checked)}
                className="mt-0.5"
              />
              <Label htmlFor="aadhaar_consent" className="checkbox-label">
                <span>I consent to the use of my Aadhaar number for Udyam registration</span>
              </Label>
            </div>
            {errors.aadhaar_consent && (
              <p className="form-field-error">{errors.aadhaar_consent.message}</p>
            )}
          </div>

          {/* checkbox */}
          <div>
            <Label className="form-field-label">
              checkbox
            </Label>
            <div className="checkbox-container">
              <Checkbox
                id="checkbox"
                checked={checkboxValue}
                onCheckedChange={(checked) => setValue("checkbox", !!checked)}
                className="mt-0.5"
              />
              <Label htmlFor="checkbox" className="checkbox-label">
                <span>checkbox</span>
              </Label>
            </div>
            {errors.checkbox && (
              <p className="form-field-error">{errors.checkbox.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" className="btn-primary">
              Continue to Next Step
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1;
