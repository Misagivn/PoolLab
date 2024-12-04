import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { 
  Product, 
  PaginatedResponse, 
  ProductFilters,
  CreateProductDTO,
  ProductDetail,
  UpdateProductDTO
} from '@/utils/types/product';
import { productApi } from '@/apis/product.api';

interface JWTPayload {
  storeId: string;
  [key: string]: any;
}

export const useProduct = () => {
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Detail State
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Update State
  const [updateLoading, setUpdateLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    groupName: 'all',
    status: 'all',
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const toast = useToast();

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1, pageSize, {
      ...filters,
      search: debouncedSearch
    });
  }, [debouncedSearch, filters.groupName, filters.status]);

  const getStoreId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const decoded = jwtDecode(token) as JWTPayload;
    if (!decoded.storeId) throw new Error('No store ID found in token');

    return decoded.storeId;
  }, []);

  const fetchProducts = useCallback(async (
    page: number = 1,
    size: number = pageSize,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);
      const storeId = getStoreId();

      const response = await productApi.getAllProducts(page, size, currentFilters);

      if (response.status === 200) {
        const filteredProducts = response.data.items.filter(
          (product: Product) => product.storeId === storeId
        );
        setProducts(filteredProducts);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.pageNumber);
        setTotalItems(response.data.totalItem);
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch products');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setProducts([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, pageSize, getStoreId, filters]);

  const fetchProductDetail = useCallback(async (id: string) => {
    try {
      setDetailLoading(true);
      const response = await productApi.getProductDetail(id);
      
      if (response.status === 200) {
        setSelectedProduct(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch product detail');
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setSelectedProduct(null);
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, [toast]);

  const updateProduct = useCallback(async (
    id: string,
    data: UpdateProductDTO
  ) => {
    try {
      setUpdateLoading(true);
      const storeId = getStoreId();
      
      const response = await productApi.updateProduct(id, {
        ...data,
        storeId
      });

      if (response.status === 200) {
        await fetchProducts(currentPage, pageSize);
        toast({
          title: 'Thành công',
          description: 'Cập nhật sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return response.data;
      }
      throw new Error(response.message || 'Failed to update product');
    } catch (err) {
      console.error('Error in updateProduct:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setUpdateLoading(false);
    }
  }, [toast, fetchProducts, currentPage, pageSize, getStoreId]);

  const createProduct = useCallback(async (data: CreateProductDTO) => {
    try {
      const storeId = getStoreId();
      const response = await productApi.createProduct({
        ...data,
        storeId
      });

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Thêm sản phẩm mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchProducts(currentPage, pageSize);
        return response.data;
      }
      throw new Error(response.message);
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm mới',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  }, [toast, fetchProducts, currentPage, pageSize, getStoreId]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await productApi.deleteProduct(id);

      if (response.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa sản phẩm thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const newPage = products.length === 1 && currentPage > 1 
          ? currentPage - 1 
          : currentPage;
        await fetchProducts(newPage, pageSize);
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    }
  }, [toast, fetchProducts, currentPage, pageSize, products.length]);

  const uploadImage = useCallback(async (file: File) => {
    try {
      const response = await productApi.uploadProductImage(file);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to upload image');
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên hình ảnh',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  }, [toast]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }, []);

  const handleRefresh = useCallback(() => {
    setFilters({
      search: '',
      groupName: 'all',
      status: 'all',
    });
    setCurrentPage(1);
    fetchProducts(1, pageSize, {
      search: '',
      groupName: 'all',
      status: 'all',
    });
  }, [pageSize, fetchProducts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(page, pageSize);
  }, [pageSize, fetchProducts]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); 
    fetchProducts(1, newSize);
  }, [fetchProducts]);

  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return {
    // State
    products,
    loading,
    updateLoading,
    totalPages,
    currentPage,
    pageSize,
    totalItems,
    filters,
    selectedProduct,
    detailLoading,

    // Core product operations
    fetchProducts,
    fetchProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    clearSelectedProduct,

    // Filter and pagination handlers
    handleFiltersChange,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,

    // Utility functions
    formatPrice,
    formatDate,
    getStoreId
  };
};