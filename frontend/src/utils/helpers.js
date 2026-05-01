export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

export const truncate = (str, len = 60) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getStatusColor = (status) => {
  const colors = {
    Pending: 'badge-warning',
    Processing: 'badge-primary',
    Shipped: 'badge-primary',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };
  return colors[status] || 'badge-primary';
};
