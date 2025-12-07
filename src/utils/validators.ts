export const isNonEmptyString = (v: any) => typeof v === 'string' && v.trim().length > 0;
export const isPositiveNumber = (v: any) => typeof v === 'number' && v > 0;
export const isValidRole = (v: any) => v === 'admin' || v === 'customer';
