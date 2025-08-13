import { UseFormReturn } from "react-hook-form";
import { Step2Data } from "../UdyamForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

interface Step2Props {
  form: UseFormReturn<Step2Data>;
  onSubmit: (data: Step2Data) => void;
  onPrevious: () => void;
  formData?: Step2Data;
}

const Step2BasicDetails = ({ form, onSubmit, onPrevious, formData }: Step2Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

  const formatMobileNumber = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 10);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobileNumber(e.target.value);
    setValue("mobileNumber", formatted);
  };

  return (
    <div>
      {/* Form Header */}
      <div className="form-header">
        Basic Details / बुनियादी विवरण
      </div>

      {/* Form Content */}
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div>
              <Label className="form-field-label">
                Mobile Number / मोबाइल नंबर
                <span className="form-field-required">*</span>
              </Label>
              <Input
                {...register("mobileNumber")}
                placeholder="Enter 10-digit mobile number"
                className="form-field-input"
                maxLength={10}
                onChange={handleMobileChange}
                value={watch("mobileNumber") || ""}
              />
              {errors.mobileNumber && (
                <p className="form-field-error">{errors.mobileNumber.message}</p>
              )}
              <p className="form-field-help">
                OTP will be sent to this mobile number for verification
              </p>
            </div>

            {/* Email Address */}
            <div>
              <Label className="form-field-label">
                Email Address / ईमेल पता
                <span className="form-field-required">*</span>
              </Label>
              <Input
                {...register("emailAddress")}
                type="email"
                placeholder="your.email@example.com"
                className="form-field-input"
              />
              {errors.emailAddress && (
                <p className="form-field-error">{errors.emailAddress.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label className="form-field-label">
                Date of Birth / जन्म तिथि
                <span className="form-field-required">*</span>
              </Label>
              <Input
                {...register("dateOfBirth")}
                type="date"
                className="form-field-input"
              />
              {errors.dateOfBirth && (
                <p className="form-field-error">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Social Category */}
            <div>
              <Label className="form-field-label">
                Social Category / सामाजिक श्रेणी
                <span className="form-field-required">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("socialCategory", value)}>
                <SelectTrigger className="form-field-input">
                  <SelectValue placeholder="Select your social category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC (Other Backward Classes)</SelectItem>
                  <SelectItem value="sc">SC (Scheduled Caste)</SelectItem>
                  <SelectItem value="st">ST (Scheduled Tribe)</SelectItem>
                </SelectContent>
              </Select>
              {errors.socialCategory && (
                <p className="form-field-error">{errors.socialCategory.message}</p>
              )}
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <Label className="form-field-label">
              Gender / लिंग
              <span className="form-field-required">*</span>
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
              className="flex flex-wrap gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="text-sm font-medium">
                  Male / पुरुष
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="text-sm font-medium">
                  Female / महिला
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="text-sm font-medium">
                  Other / अन्य
                </Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="form-field-error">{errors.gender.message}</p>
            )}
          </div>

          {/* Physically Handicapped */}
          <div>
            <Label className="form-field-label">
              Physically Handicapped / शारीरिक रूप से विकलांग
              <span className="form-field-required">*</span>
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue("physicallyHandicapped", value as "yes" | "no")}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="handicapped-yes" />
                <Label htmlFor="handicapped-yes" className="text-sm font-medium">
                  Yes / हाँ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="handicapped-no" />
                <Label htmlFor="handicapped-no" className="text-sm font-medium">
                  No / नहीं
                </Label>
              </div>
            </RadioGroup>
            {errors.physicallyHandicapped && (
              <p className="form-field-error">{errors.physicallyHandicapped.message}</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              onClick={onPrevious}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Step</span>
            </Button>

            <Button type="submit" className="btn-primary">
              Continue to Next Step
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2BasicDetails;