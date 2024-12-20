export interface ValidatorResult {
  [validatorName: string]: {
    error: boolean;
    message?: string;
    defaultMessage?: string;
  };
}

export type ValidatorFn = (value: any) => ValidatorResult;

function required(value: any): ValidatorResult {
  if (value === '' || value == null) {
    return { required: { error: true, message: 'Veld moet ingevuld zijn' } };
  }
  return { required: { error: false } };
}

function minLength(minLength: number): ValidatorFn {
  return function (value): ValidatorResult {
    if (value == null || value.length < minLength) {
      return {
        minLength: {
          error: true,
          message: `Veld moet ${minLength} lang zijn`,
        },
      };
    }
    return { minLength: { error: false } };
  };
}

function maxLength(maxLength: number,): ValidatorFn {
  return function (value): ValidatorResult {
    if (value != null && value.length > maxLength) {
      return {
        maxLength: {
          error: true,
          message: `Field maximum length is ${maxLength}`,
        },
      };
    }
    return { maxLength: { error: false } };
  };
}

function pattern(pattern: RegExp, customMessage?: string): ValidatorFn {
  return function (value): ValidatorResult {
    if (value != null && !pattern.test(value)) {
      return {
        pattern: {
          error: true,
          message: customMessage || 'Invalid input format',
        },
      };
    }
    return { pattern: { error: false } };
  };
}


function between(value: any): ValidatorResult {
  const intValue = parseInt(value);
  if (isNaN(intValue) || intValue < 1 || intValue > 5) {
    return {
      between1And5: {
        error: true,
        message: 'Value must be between 1 and 5',
      },
    };
  }
  return { between1And5: { error: false } };
}

export const Validators = {
  required,
  minLength,
  maxLength,
  pattern,
  between
};