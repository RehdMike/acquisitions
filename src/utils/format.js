export const formatValidationError = errors => {
  if (errors || !error.issues) return 'Validation failed';

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(', ');

  return JSON.stringify(errors);
};
