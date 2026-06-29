const requiredSecret = (name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET') => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  if (process.env.NODE_ENV === 'production' && value.length < 32) {
    throw new Error(`${name} must contain at least 32 characters in production`);
  }
  return value;
};

export const accessSecret = () => requiredSecret('JWT_ACCESS_SECRET');
export const refreshSecret = () => requiredSecret('JWT_REFRESH_SECRET');
export const jwtIssuer = () => process.env.JWT_ISSUER || 'best5-api';
export const jwtAudience = () => process.env.JWT_AUDIENCE || 'best5-admin';
