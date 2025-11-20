/**
 * Format price to VND currency
 * @param price - Price value (can be string like "700.000 VND" or "700000" or number)
 * @returns Formatted price string in VND format
 */
export const formatPriceVND = (price: string | number | undefined | null): string => {
  if (!price) return '0 VND';
  
  // If it's already formatted with VND, return as is
  if (typeof price === 'string' && price.toUpperCase().includes('VND')) {
    return price;
  }
  
  // Extract numbers from string or convert number to string
  let numericValue: number;
  if (typeof price === 'number') {
    numericValue = price;
  } else {
    // Remove all non-digit characters except decimal point
    const cleaned = price.replace(/[^\d.]/g, '');
    numericValue = parseFloat(cleaned) || 0;
  }
  
  // Format with thousand separators
  const formatted = numericValue.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return `${formatted} VND`;
};

