import { UseFormReturn } from "react-hook-form";
import { Step3Data } from "@/schemas/step3Schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface Step3Props {
  form: UseFormReturn<Step3Data>;
  onSubmit: (data: Step3Data) => void;
  onPrevious: () => void;
  formData?: Step3Data;
}

const Step3BusinessDetails = ({ form, onSubmit, onPrevious, formData }: Step3Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleNumberChange = (field: keyof Step3Data, e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setValue(field, formatted);
  };

  return (
    <div>
      {/* Form Header */}
      <div className="form-header">
        Business Details & Bank Information / व्यवसाय विवरण और बैंक जानकारी
      </div>

      {/* Form Content */}
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Business Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Business Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <Label className="form-field-label">
                  Business Name / व्यवसाय का नाम
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("businessName")}
                  placeholder="Enter business name"
                  className="form-field-input"
                />
                {errors.businessName && (
                  <p className="form-field-error">{errors.businessName.message}</p>
                )}
              </div>

              {/* Business Type */}
              <div>
                <Label className="form-field-label">
                  Business Type / व्यवसाय का प्रकार
                  <span className="form-field-required">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("businessType", value as any)}>
                  <SelectTrigger className="form-field-input">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="form-field-error">{errors.businessType.message}</p>
                )}
              </div>

              {/* Business Category */}
              <div>
                <Label className="form-field-label">
                  Business Category / व्यवसाय श्रेणी
                  <span className="form-field-required">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("businessCategory", value)}>
                  <SelectTrigger className="form-field-input">
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro Enterprise</SelectItem>
                    <SelectItem value="small">Small Enterprise</SelectItem>
                    <SelectItem value="medium">Medium Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessCategory && (
                  <p className="form-field-error">{errors.businessCategory.message}</p>
                )}
              </div>

              {/* Business Address */}
              <div className="md:col-span-2">
                <Label className="form-field-label">
                  Business Address / व्यवसाय का पता
                  <span className="form-field-required">*</span>
                </Label>
                <Textarea
                  {...register("businessAddress")}
                  placeholder="Enter complete business address"
                  className="form-field-input"
                  rows={3}
                />
                {errors.businessAddress && (
                  <p className="form-field-error">{errors.businessAddress.message}</p>
                )}
              </div>

              {/* City, State, Pincode */}
              <div>
                <Label className="form-field-label">
                  City / शहर
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("businessCity")}
                  placeholder="Enter city"
                  className="form-field-input"
                />
                {errors.businessCity && (
                  <p className="form-field-error">{errors.businessCity.message}</p>
                )}
              </div>

              <div>
                <Label className="form-field-label">
                  State / राज्य
                  <span className="form-field-required">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("businessState", value)}>
                  <SelectTrigger className="form-field-input">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="up">Uttar Pradesh</SelectItem>
                    <SelectItem value="westbengal">West Bengal</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="andhrapradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessState && (
                  <p className="form-field-error">{errors.businessState.message}</p>
                )}
              </div>

              <div>
                <Label className="form-field-label">
                  Pincode / पिन कोड
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("businessPincode")}
                  placeholder="Enter 6-digit pincode"
                  className="form-field-input"
                  maxLength={6}
                  onChange={(e) => handleNumberChange("businessPincode", e)}
                />
                {errors.businessPincode && (
                  <p className="form-field-error">{errors.businessPincode.message}</p>
                )}
              </div>

              {/* Business Contact */}
              <div>
                <Label className="form-field-label">
                  Business Phone / व्यवसाय का फोन
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("businessPhone")}
                  placeholder="Enter business phone number"
                  className="form-field-input"
                  maxLength={10}
                  onChange={(e) => handleNumberChange("businessPhone", e)}
                />
                {errors.businessPhone && (
                  <p className="form-field-error">{errors.businessPhone.message}</p>
                )}
              </div>

              {/* Business Email */}
              <div>
                <Label className="form-field-label">
                  Business Email / व्यवसाय का ईमेल
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("businessEmail")}
                  type="email"
                  placeholder="business@example.com"
                  className="form-field-input"
                />
                {errors.businessEmail && (
                  <p className="form-field-error">{errors.businessEmail.message}</p>
                )}
              </div>

              {/* Business Website */}
              <div>
                <Label className="form-field-label">
                  Business Website / व्यवसाय की वेबसाइट
                </Label>
                <Input
                  {...register("businessWebsite")}
                  type="url"
                  placeholder="https://www.example.com"
                  className="form-field-input"
                />
                {errors.businessWebsite && (
                  <p className="form-field-error">{errors.businessWebsite.message}</p>
                )}
              </div>

              {/* Business Description */}
              <div className="md:col-span-2">
                <Label className="form-field-label">
                  Business Description / व्यवसाय का विवरण
                  <span className="form-field-required">*</span>
                </Label>
                <Textarea
                  {...register("businessDescription")}
                  placeholder="Describe your business activities, products, and services"
                  className="form-field-input"
                  rows={4}
                />
                {errors.businessDescription && (
                  <p className="form-field-error">{errors.businessDescription.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Investment & Employment Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Investment & Employment</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Investment in Plant */}
              <div>
                <Label className="form-field-label">
                  Investment in Plant & Machinery / प्लांट और मशीनरी में निवेश
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("investmentInPlant", { valueAsNumber: true })}
                  type="number"
                  placeholder="Enter amount in INR"
                  className="form-field-input"
                  min="0"
                />
                {errors.investmentInPlant && (
                  <p className="form-field-error">{errors.investmentInPlant.message}</p>
                )}
              </div>

              {/* Investment in Equipment */}
              <div>
                <Label className="form-field-label">
                  Investment in Equipment / उपकरण में निवेश
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("investmentInEquipment", { valueAsNumber: true })}
                  type="number"
                  placeholder="Enter amount in INR"
                  className="form-field-input"
                  min="0"
                />
                {errors.investmentInEquipment && (
                  <p className="form-field-error">{errors.investmentInEquipment.message}</p>
                )}
              </div>

              {/* Total Investment */}
              <div>
                <Label className="form-field-label">
                  Total Investment / कुल निवेश
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("totalInvestment", { valueAsNumber: true })}
                  type="number"
                  placeholder="Enter total amount in INR"
                  className="form-field-input"
                  min="0"
                />
                {errors.totalInvestment && (
                  <p className="form-field-error">{errors.totalInvestment.message}</p>
                )}
              </div>

              {/* Employment Generated */}
              <div>
                <Label className="form-field-label">
                  Employment Generated / उत्पन्न रोजगार
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("employmentGenerated", { valueAsNumber: true })}
                  type="number"
                  placeholder="Number of employees"
                  className="form-field-input"
                  min="0"
                />
                {errors.employmentGenerated && (
                  <p className="form-field-error">{errors.employmentGenerated.message}</p>
                )}
              </div>

              {/* Date of Commencement */}
              <div>
                <Label className="form-field-label">
                  Date of Commencement / व्यवसाय शुरू करने की तिथि
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("dateOfCommencement")}
                  type="date"
                  className="form-field-input"
                />
                {errors.dateOfCommencement && (
                  <p className="form-field-error">{errors.dateOfCommencement.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Bank Account Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bank Account Number */}
              <div>
                <Label className="form-field-label">
                  Bank Account Number / बैंक खाता संख्या
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("bankAccountNumber")}
                  placeholder="Enter account number"
                  className="form-field-input"
                  onChange={(e) => handleNumberChange("bankAccountNumber", e)}
                />
                {errors.bankAccountNumber && (
                  <p className="form-field-error">{errors.bankAccountNumber.message}</p>
                )}
              </div>

              {/* Bank Name */}
              <div>
                <Label className="form-field-label">
                  Bank Name / बैंक का नाम
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("bankName")}
                  placeholder="Enter bank name"
                  className="form-field-input"
                />
                {errors.bankName && (
                  <p className="form-field-error">{errors.bankName.message}</p>
                )}
              </div>

              {/* Bank Branch */}
              <div>
                <Label className="form-field-label">
                  Bank Branch / बैंक की शाखा
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("bankBranch")}
                  placeholder="Enter branch name"
                  className="form-field-input"
                />
                {errors.bankBranch && (
                  <p className="form-field-error">{errors.bankBranch.message}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <Label className="form-field-label">
                  IFSC Code / आईएफएससी कोड
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("bankIFSCCode")}
                  placeholder="Enter IFSC code"
                  className="form-field-input"
                  maxLength={11}
                  onChange={(e) => setValue("bankIFSCCode", e.target.value.toUpperCase())}
                />
                {errors.bankIFSCCode && (
                  <p className="form-field-error">{errors.bankIFSCCode.message}</p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <Label className="form-field-label">
                  Account Type / खाता प्रकार
                  <span className="form-field-required">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("bankAccountType", value as any)}>
                  <SelectTrigger className="form-field-input">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="current">Current Account</SelectItem>
                    <SelectItem value="overdraft">Overdraft Account</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankAccountType && (
                  <p className="form-field-error">{errors.bankAccountType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nominee Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Nominee Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nominee Name */}
              <div>
                <Label className="form-field-label">
                  Nominee Name / नामांकित व्यक्ति का नाम
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("nomineeName")}
                  placeholder="Enter nominee name"
                  className="form-field-input"
                />
                {errors.nomineeName && (
                  <p className="form-field-error">{errors.nomineeName.message}</p>
                )}
              </div>

              {/* Nominee Relationship */}
              <div>
                <Label className="form-field-label">
                  Relationship / रिश्ता
                  <span className="form-field-required">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("nomineeRelationship", value)}>
                  <SelectTrigger className="form-field-input">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nomineeRelationship && (
                  <p className="form-field-error">{errors.nomineeRelationship.message}</p>
                )}
              </div>

              {/* Nominee Address */}
              <div className="md:col-span-2">
                <Label className="form-field-label">
                  Nominee Address / नामांकित व्यक्ति का पता
                  <span className="form-field-required">*</span>
                </Label>
                <Textarea
                  {...register("nomineeAddress")}
                  placeholder="Enter complete nominee address"
                  className="form-field-input"
                  rows={3}
                />
                {errors.nomineeAddress && (
                  <p className="form-field-error">{errors.nomineeAddress.message}</p>
                )}
              </div>

              {/* Nominee Phone */}
              <div>
                <Label className="form-field-label">
                  Nominee Phone / नामांकित व्यक्ति का फोन
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("nomineePhone")}
                  placeholder="Enter nominee phone number"
                  className="form-field-input"
                  maxLength={10}
                  onChange={(e) => handleNumberChange("nomineePhone", e)}
                />
                {errors.nomineePhone && (
                  <p className="form-field-error">{errors.nomineePhone.message}</p>
                )}
              </div>

              {/* Nominee Email */}
              <div>
                <Label className="form-field-label">
                  Nominee Email / नामांकित व्यक्ति का ईमेल
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("nomineeEmail")}
                  type="email"
                  placeholder="nominee@example.com"
                  className="form-field-input"
                />
                {errors.nomineeEmail && (
                  <p className="form-field-error">{errors.nomineeEmail.message}</p>
                )}
              </div>

              {/* Nominee PAN */}
              <div>
                <Label className="form-field-label">
                  Nominee PAN / नामांकित व्यक्ति का पैन
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("nomineePAN")}
                  placeholder="Enter nominee PAN"
                  className="form-field-input"
                  maxLength={10}
                  onChange={(e) => setValue("nomineePAN", e.target.value.toUpperCase())}
                />
                {errors.nomineePAN && (
                  <p className="form-field-error">{errors.nomineePAN.message}</p>
                )}
              </div>

              {/* Nominee Aadhaar */}
              <div>
                <Label className="form-field-label">
                  Nominee Aadhaar / नामांकित व्यक्ति का आधार
                  <span className="form-field-required">*</span>
                </Label>
                <Input
                  {...register("nomineeAadhaar")}
                  placeholder="Enter nominee Aadhaar"
                  className="form-field-input"
                  maxLength={12}
                  onChange={(e) => handleNumberChange("nomineeAadhaar", e)}
                />
                {errors.nomineeAadhaar && (
                  <p className="form-field-error">{errors.nomineeAadhaar.message}</p>
                )}
              </div>
            </div>

            {/* Nominee Consent */}
            <div className="checkbox-container">
              <Checkbox
                id="nomineeConsent"
                checked={watch("nomineeConsent")}
                onCheckedChange={(checked) => setValue("nomineeConsent", !!checked)}
                className="mt-0.5"
              />
              <Label htmlFor="nomineeConsent" className="checkbox-label">
                <span>
                  I hereby declare that the nominee details provided above are true and correct. 
                  The nominee has been informed about their nomination and has given consent.
                </span>
              </Label>
            </div>
            {errors.nomineeConsent && (
              <p className="form-field-error">{errors.nomineeConsent.message}</p>
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

export default Step3BusinessDetails;
