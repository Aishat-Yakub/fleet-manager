import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface FuelRequestFormProps {
  formData: {
    vehicle_id: string;
    litres: string;
    reason: string;
    bank: string;
    account: string;
    name: string;
    account_details?: string;
  };
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  vehicles?: Array<{ id: number; plate_number: string; model: string }>;
}

export const FuelRequestForm = ({
  formData,
  isLoading,
  error,
  onSubmit,
  onInputChange,
  onCancel,
}: FuelRequestFormProps) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev: Record<string, boolean>) => ({ ...prev, [field]: true }));
  };

  const isFormValid = formData.vehicle_id && formData.litres && formData.reason;
  const showError = (field: string) => touched[field] && !formData[field as keyof typeof formData];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                onBlur={() => handleBlur('name')}
                placeholder="Enter your name"
                required
                disabled={isLoading}
              />
              {showError('name') && (
                <p className="text-sm text-red-600">Your name is required</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle_id" className="flex items-center">
                Vehicle ID
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="vehicle_id"
                name="vehicle_id"
                type="text"
                value={formData.vehicle_id}
                onChange={onInputChange}
                onBlur={() => handleBlur('vehicle_id')}
                placeholder="Enter vehicle ID"
                required
                disabled={isLoading}
              />
              {showError('vehicle_id') && (
                <p className="text-sm text-red-600">Vehicle ID is required</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="litres" className="flex items-center">
            Litres
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="litres"
              name="litres"
              type="number"
              min="1"
              step="0.1"
              value={formData.litres}
              onChange={onInputChange}
              onBlur={() => handleBlur('litres')}
              placeholder="0.0"
              className="pl-10"
              required
              disabled={isLoading}
            />
            <span className="absolute left-3 top-2.5 text-muted-foreground">L</span>
          </div>
          {showError('litres') && (
            <p className="text-sm text-red-600">Please enter a valid amount</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason" className="flex items-center">
          Reason
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={onInputChange}
          onBlur={() => handleBlur('reason')}
          placeholder="Please provide a reason for this fuel request..."
          rows={3}
          className="min-h-[100px]"
          required
          disabled={isLoading}
        />
        {showError('reason') && (
          <p className="text-sm text-red-600">Please provide a reason</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="bank">Bank Name</Label>
          <Input
            id="bank"
            name="bank"
            value={formData.bank || ''}
            onChange={onInputChange}
            onBlur={() => handleBlur('bank')}
            placeholder="Enter bank name"
            required
            disabled={isLoading}
          />
          {showError('bank') && (
            <p className="text-sm text-red-600">Bank name is required</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="account">Account Number</Label>
          <Input
            id="account"
            name="account"
            type="number"
            value={formData.account || ''}
            onChange={onInputChange}
            onBlur={() => handleBlur('account')}
            placeholder="Enter account number"
            required
            disabled={isLoading}
          />
          {showError('account') && (
            <p className="text-sm text-red-600">Account number is required</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account_details">Account Details (Optional)</Label>
        <Textarea
          id="account_details"
          name="account_details"
          value={formData.account_details || ''}
          onChange={onInputChange}
          placeholder="Enter account details for reimbursement (if applicable)"
          rows={2}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </div>
    </form>
  );
};
