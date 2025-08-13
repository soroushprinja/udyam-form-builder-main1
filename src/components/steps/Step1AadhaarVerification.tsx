import { UseFormReturn } from "react-hook-form";
import { Step1Data } from "../UdyamForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Step1Props {
  form: UseFormReturn<Step1Data>;
  onSubmit: (data: Step1Data) => void;
  formData?: Step1Data;
}

const Step1AadhaarVerification = ({ form, onSubmit, formData }: Step1Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = form;

  const consentValue = watch("consent");
  const aadhaarNumber = watch("aadhaarNumber");
  const entrepreneurName = watch("entrepreneurName");
  const panNumber = watch("panNumber");
  const [panValidationStatus, setPanValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [aadhaarDisplay, setAadhaarDisplay] = useState("");
  
  // Show PAN section only when Aadhaar and name are filled
  const showPanSection = aadhaarNumber && entrepreneurName && aadhaarNumber.length >= 12;

  const formatAadhaarNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Take only first 12 digits
    const truncated = digits.substring(0, 12);
    // Add spaces every 4 digits
    return truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-digits
    const digits = inputValue.replace(/\D/g, '');
    // Take only first 12 digits
    const truncated = digits.substring(0, 12);
    
    // Set the raw value (12 digits) for form validation
    setValue("aadhaarNumber", truncated);
    
    // Update the display value with formatting
    setAadhaarDisplay(formatAadhaarNumber(truncated));
  };

  // Initialize display value when form data changes
  useEffect(() => {
    if (formData?.aadhaarNumber) {
      setAadhaarDisplay(formatAadhaarNumber(formData.aadhaarNumber));
    }
  }, [formData?.aadhaarNumber]);

  const validatePAN = async () => {
    if (!panNumber || panNumber.length !== 10) {
      setPanValidationStatus('invalid');
      return;
    }

    setPanValidationStatus('validating');
    
    // Simulate PAN validation API call
    setTimeout(() => {
      // Mock validation logic - in real app, this would call a PAN verification API
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (panRegex.test(panNumber)) {
        setPanValidationStatus('valid');
        toast.success("PAN validation successful!");
      } else {
        setPanValidationStatus('invalid');
        toast.error("Invalid PAN format");
      }
    }, 1500);
  };

  const getPanValidationMessage = () => {
    switch (panValidationStatus) {
      case 'validating':
        return <span className="text-blue-600">Validating PAN...</span>;
      case 'valid':
        return <span className="text-green-600">✓ PAN validated successfully</span>;
      case 'invalid':
        return <span className="text-red-600">✗ Invalid PAN format</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Form Header */}
      <div className="form-header">
        Aadhaar Verification With OTP
      </div>

      {/* Form Content */}
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Aadhaar Number Field */}
            <div>
              <Label className="form-field-label">
                1. Aadhaar Number / आधार संख्या
                <span className="form-field-required">*</span>
              </Label>
              <Input
                {...register("aadhaarNumber")}
                placeholder="Your Aadhaar No"
                className="form-field-input"
                maxLength={14} // 12 digits + 2 spaces
                onChange={handleAadhaarChange}
                value={aadhaarDisplay}
              />
              {errors.aadhaarNumber && (
                <p className="form-field-error">{errors.aadhaarNumber.message}</p>
              )}
            </div>

            {/* Entrepreneur Name Field */}
            <div>
              <Label className="form-field-label">
                2. Name of Entrepreneur / उद्यमी का नाम
                <span className="form-field-required">*</span>
              </Label>
              <Input
                {...register("entrepreneurName")}
                placeholder="Name as per Aadhaar"
                className="form-field-input"
              />
              {errors.entrepreneurName && (
                <p className="form-field-error">{errors.entrepreneurName.message}</p>
              )}
            </div>
          </div>

          {/* Information Points */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Aadhaar number shall be required for Udyam Registration.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>
                  In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN (as per applicability of CGST Act 2017 and as notified by the ministry of MSME{" "}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    vide S.O. 1055(E) dated 05th March 2021
                  </a>
                  ) and PAN along with its Aadhaar number.
                </span>
              </li>
            </ul>
          </Card>

          {/* Consent Checkbox */}
          <div className="checkbox-container">
            <Checkbox
              id="consent"
              checked={consentValue}
              onCheckedChange={(checked) => setValue("consent", !!checked)}
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="checkbox-label">
              <span>
                I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as allotted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, एतद्द्वारा भारत सरकार के सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय को अपने आधार संख्या का उपयोग करने के लिए सहमति देता हूं। एनआईसी / सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
              </span>
            </Label>
          </div>
          
          {errors.consent && (
            <p className="form-field-error">{errors.consent.message}</p>
          )}

          {/* PAN Verification Section - Only shows when Aadhaar details are filled */}
          {showPanSection && (
            <div>
              {/* PAN Verification Header */}
              <div className="form-header bg-green-600">
                PAN Verification
              </div>

              <div className="form-content">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Type of Organisation */}
                  <div>
                    <Label className="form-field-label">
                      3. Type of Organisation / संगठन का प्रकार
                      <span className="form-field-required">*</span>
                    </Label>
                    <Select
                      value={watch("typeOfOrganisation")}
                      onValueChange={(value) => setValue("typeOfOrganisation", value)}
                    >
                      <SelectTrigger className="form-field-input">
                        <SelectValue placeholder="Type of Organisation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proprietorship">Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                        <SelectItem value="huf">Hindu Undivided Family</SelectItem>
                        <SelectItem value="cooperative">Cooperative Society</SelectItem>
                        <SelectItem value="society">Society</SelectItem>
                        <SelectItem value="trust">Trust</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.typeOfOrganisation && (
                      <p className="form-field-error">{errors.typeOfOrganisation.message}</p>
                    )}
                  </div>

                  {/* PAN Number */}
                  <div>
                    <Label className="form-field-label">
                      4. PAN / पैन
                      <span className="form-field-required">*</span>
                    </Label>
                    <Input
                      {...register("panNumber")}
                      placeholder="ENTER PAN NUMBER"
                      className="form-field-input uppercase"
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setValue("panNumber", value);
                      }}
                    />
                    {errors.panNumber && (
                      <p className="form-field-error">{errors.panNumber.message}</p>
                    )}
                  </div>

                  {/* Name of PAN Holder */}
                  <div>
                    <Label className="form-field-label">
                      4.1.1 Name of PAN Holder / पैन धारक का नाम
                      <span className="form-field-required">*</span>
                    </Label>
                    <Input
                      {...register("panHolderName")}
                      placeholder="Name as per PAN"
                      className="form-field-input"
                    />
                    {errors.panHolderName && (
                      <p className="form-field-error">{errors.panHolderName.message}</p>
                    )}
                  </div>

                  {/* DOB or DOI as per PAN */}
                  <div>
                    <Label className="form-field-label">
                      4.1.2 DOB or DOI as per PAN / पैन के अनुसार जन्म दिनांक या निगमन दिनांक
                      <span className="form-field-required">*</span>
                    </Label>
                    <Input
                      {...register("dobOrDoi")}
                      type="date"
                      className="form-field-input"
                    />
                    {errors.dobOrDoi && (
                      <p className="form-field-error">{errors.dobOrDoi.message}</p>
                    )}
                  </div>
                </div>

                {/* PAN Consent Checkbox */}
                <div className="checkbox-container mt-6">
                  <Checkbox
                    id="panConsent"
                    checked={watch("panConsent")}
                    onCheckedChange={(checked) => setValue("panConsent", !!checked)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="panConsent" className="checkbox-label">
                    <span>
                      I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for using my data information available in the Income Tax Returns and also from other Government organisations, for MSME classification and other official purposes, in pursuance of the MSMED Act, 2006.
                    </span>
                  </Label>
                </div>
                
                {errors.panConsent && (
                  <p className="form-field-error">{errors.panConsent.message}</p>
                )}

                {/* PAN Validate Button */}
                <div className="flex justify-start mt-4">
                  <Button 
                    type="button" 
                    className="btn-primary"
                    onClick={validatePAN}
                    disabled={!panNumber || panNumber.length !== 10 || panValidationStatus === 'validating'}
                  >
                    {panValidationStatus === 'validating' ? 'Validating...' : 'PAN Validate'}
                  </Button>
                  {panValidationStatus !== 'idle' && (
                    <div className="ml-4 flex items-center">
                      {getPanValidationMessage()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" className="btn-primary">
              {showPanSection ? "Submit & Continue" : "Validate & Generate OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1AadhaarVerification;