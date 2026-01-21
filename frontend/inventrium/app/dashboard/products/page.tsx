"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
}

interface User {
  id: number;
  role: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  purchasePrice: number;
  basePrice: number;
  requiresBatchTracking: boolean;
  categoryId?: number;
  categoryName?: string;
}

interface ProductDetails {
  id: number;
  name: string;
  sku: string;
  description: string;
  purchasePrice: number;
  basePrice: number;
  requiresBatchTracking: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  createdByUsername?: string;
  updatedByUsername?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [requiresBatchTracking, setRequiresBatchTracking] =
    useState<boolean>(false);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(
    null
  );
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );

  const [user, setUser] = useState<User | null>(null);

  const actionRoles = ["ADMINISTRATOR", "MANAGER"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getAuthContext = () => {
    let stored = localStorage.getItem("jwt");
    if (!stored) return { token: null, companyId: null };

    let rawToken = stored.startsWith("Bearer ")
      ? stored.replace("Bearer ", "")
      : stored;

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(rawToken);
      return {
        token: `Bearer ${rawToken}`,
        companyId: decoded.companyId ?? null,
      };
    } catch {
      return { token: null, companyId: null };
    }
  };

  const getUserFromToken = () => {
    let stored = localStorage.getItem("jwt");
    if (!stored) return null;

    let rawToken = stored.startsWith("Bearer ")
      ? stored.replace("Bearer ", "")
      : stored;

    try {
      const decoded: any = jwtDecode(rawToken);
      return {
        id: decoded.userId || decoded.id,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const handleViewProduct = async (id: number) => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) {
      toast.error("Missing authentication or company context");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products/details/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (!res.ok) {
        toast.error("Failed to load products");
        return;
      }
      const data: ProductDetails = await res.json();
      setSelectedProduct(data);
      setViewModalVisible(true);
    } catch (e) {
      console.error("Error fetching product:", e);
      toast.error("Network error while loading product");
    }
  };

  const fetchCategories = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) {
      toast.error("Missing authentication or company context");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/categories`,
        {
          headers: { Authorization: token },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) {
      toast.error("Missing authentication or company context");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products`,
        {
          headers: { Authorization: token },
        }
      );
      if (!res.ok) {
        toast.error("Failed to load products");
        return;
      }
      const data = await res.json();
      setProducts(data.sort((a: Product, b: Product) => a.id - b.id)); // Sortează aici
    } catch (e) {
      console.error("Error fetching products:", e);
      toast.error("Network error while loading products");
    } finally {
      setLoading(false);
    }
  };

  // Resetează formularul
  const resetForm = () => {
    setName("");
    setSku("");
    setDescription("");
    setPurchasePrice("");
    setBasePrice("");
    setRequiresBatchTracking(false);
    setCategoryId(null);
    setEditingProduct(null);
  };

  // Deschide modal pentru Add
  const handleOpenAddModal = () => {
    resetForm();
    setAddModalVisible(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Deschide modal pentru Update
  const handleOpenUpdateModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setDescription(product.description);
    setPurchasePrice(product.purchasePrice.toString());
    setBasePrice(product.basePrice.toString());
    setRequiresBatchTracking(product.requiresBatchTracking);
    setCategoryId(product.categoryId ?? null);
    setAddModalVisible(true);
  };

  // Închide modal și resetează
  const handleCloseModal = () => {
    setAddModalVisible(false);
    resetForm();
  };

  // Submit formular (Add sau Update)
const handleSubmitProduct = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !sku.trim() || !description.trim()) {
    toast.error("Name, SKU and Description are required");
    return;
  }

  const { token, companyId } = getAuthContext();
  if (!token || !companyId) {
    toast.error("Missing authentication or company context");
    return;
  }

  const payload = {
    name,
    sku,
    description,
    purchasePrice: parseFloat(purchasePrice),
    basePrice: parseFloat(basePrice),
    requiresBatchTracking,
    categoryId,
  };

  try {
    if (editingProduct) {
      // UPDATE
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update product");
        return;
      }

      toast.success("Product updated successfully");
    } else {
      // ADD
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        toast.error("Failed to add product");
        return;
      }

      toast.success("Product added successfully");
    }

    // Refetch produsele pentru a avea datele complete
    await fetchProducts();
    handleCloseModal();
  } catch (e) {
    console.error("Error saving product:", e);
    toast.error("Network error while saving product");
  }
};

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) {
      toast.error("Missing authentication or company context");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products/${productToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        toast.error("Failed to delete product");
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success("Product deleted successfully");

      setDeleteModalVisible(false);
      setProductToDelete(null);
    } catch (e) {
      console.error("Error deleting product:", e);
      toast.error("Network error while deleting product");
    }
  };

  return (
    <DashboardLayout activeLink="products">
      <div className="w-full h-full flex flex-col gap-4 px-10 py-6">
        {/* Bară acțiuni */}
        <div className="flex items-center justify-between mb-6">
          {/* Titlu */}
          <h1 className="text-2xl font-bold text-black">Products</h1>

          {/* Grup acțiuni */}
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border border-gray-400 text-sm"
            />

            {/* Filter dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="px-3 py-2 rounded border border-gray-400 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Buton Add Product */}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap"
              onClick={handleOpenAddModal}
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="rounded-lg overflow-hidden border border-[#333]">
          <table className="table-fixed text-white w-full">
            <thead className="bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Purchase Price</th>
                <th className="px-4 py-3 text-right">Base Price</th>
                <th className="px-4 py-3 text-center">Batch</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#222]">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    Loading products…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t border-[#333]">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.sku}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(p.purchasePrice)}
                    </td>

                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(p.basePrice)}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {p.requiresBatchTracking ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {/* View doar pentru OPERATOR */}
                        {user?.role && ["ADMINISTRATOR", "MANAGER", "OPERATOR"].includes(user.role) && (
                          <button
                            onClick={() => handleViewProduct(p.id)}
                            title="View"
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 
               9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}

                        {/* Update și Delete doar pentru ADMINISTRATOR și MANAGER */}
                        {user?.role &&
                          ["ADMINISTRATOR", "MANAGER"].includes(user.role) && (
                            <>
                              <button
                                onClick={() => handleOpenUpdateModal(p)}
                                title="Update"
                                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p)}
                                title="Delete"
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Add Product */}
        {addModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmitProduct}
              className="bg-white w-[520px] rounded-lg shadow-lg p-6 flex flex-col gap-6"
            >
              <h2 className="text-xl font-semibold">
                {editingProduct ? "Update Product" : "Add Product"}
              </h2>

              {/* Grid for inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Purchase Price</label>
                  <input
                    type="number"
                    placeholder="Purchase Price"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="border p-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Base Price</label>
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="border p-2"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 col-span-1">
                  <input
                    id="batch"
                    type="checkbox"
                    checked={requiresBatchTracking}
                    onChange={(e) => setRequiresBatchTracking(e.target.checked)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  <label htmlFor="batch" className="text-sm font-medium">
                    Requires batch tracking
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={categoryId ?? ""}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {editingProduct ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal View Product */}
        {viewModalVisible && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <b>Name:</b> {selectedProduct.name}
                </p>
                <p>
                  <b>SKU:</b> {selectedProduct.sku}
                </p>
                <p>
                  <b>Description:</b> {selectedProduct.description}
                </p>
                <p>
                  <b>Purchase Price:</b> {selectedProduct.purchasePrice}
                </p>
                <p>
                  <b>Base Price:</b> {selectedProduct.basePrice}
                </p>
                <p>
                  <b>Batch Tracking:</b>{" "}
                  {selectedProduct.requiresBatchTracking ? "Yes" : "No"}
                </p>
                <p>
                  <b>Category:</b> {selectedProduct.categoryName ?? "—"}
                </p>
                <p>
                  <b>Created At:</b>{" "}
                  {new Date(selectedProduct.createdAt).toLocaleString()}
                </p>
                <p>
                  <b>Created By:</b> {selectedProduct.createdByUsername ?? "—"}
                </p>
                <p>
                  <b>Updated At:</b>{" "}
                  {new Date(selectedProduct.updatedAt).toLocaleString()}
                </p>
                <p>
                  <b>Updated By:</b> {selectedProduct.updatedByUsername ?? "—"}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewModalVisible(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Delete Confirmation */}
        {deleteModalVisible && productToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white w-[450px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Delete Product
              </h2>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the product{" "}
                <span className="font-bold">"{productToDelete.name}"</span>?
                <br />
                <span className="text-sm text-gray-500">
                  This action cannot be undone.
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteModalVisible(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
