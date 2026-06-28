export const getProductImage = (product: { name: string; category?: { name: string; slug: string } }) => {
  const categoryName = product.category?.name || '';
  const nameLower = (product.name || '').toLowerCase();
  
  if (
    categoryName.includes('Iron') || 
    categoryName.includes('Material') || 
    categoryName.includes('Steel') || 
    nameLower.includes('steel') || 
    nameLower.includes('iron') || 
    nameLower.includes('girder') || 
    nameLower.includes('saria')
  ) {
    return '/images/products/iron_steel.jpg';
  }
  if (categoryName.includes('Cement') || nameLower.includes('cement')) {
    return '/images/products/cement.jpg';
  }
  if (categoryName.includes('Brick') || nameLower.includes('brick')) {
    return '/images/products/bricks.jpg';
  }
  if (
    categoryName.includes('Concrete') || 
    categoryName.includes('Bajri') || 
    nameLower.includes('stone') || 
    nameLower.includes('gravel') || 
    nameLower.includes('concrete') || 
    nameLower.includes('bajri') || 
    nameLower.includes('crush')
  ) {
    return '/images/products/concrete.jpg';
  }
  // Safe default: high-end monochrome industrial steel photo
  return '/images/products/iron_steel.jpg';
};
