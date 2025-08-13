import { UseFormReturn } from "react-hook-form";
import { FormData } from "../schemas/step2Schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step2Props {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  onPrevious?: () => void;
  formData?: FormData;
}

const Step2 = ({ form, onSubmit, onPrevious, formData }: Step2Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = form;


  return (
    <div>
      {/* Form Header */}
      <div className="form-header">
        PAN Verification
      </div>

      {/* Form Content */}
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              onClick={onPrevious}
              className="btn-secondary"
            >
              Previous Step
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

export default Step2;
