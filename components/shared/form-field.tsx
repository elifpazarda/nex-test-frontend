import type { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: FieldError;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  description,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {description && !error && <p className="text-xs text-muted-foreground">{description}</p>}
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
