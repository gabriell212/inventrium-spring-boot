"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  purchasePrice: number;
  basePrice: number;
  requiresBatchTracking: boolean;
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

  const fetchCategories = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

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
      setProducts(data);
    } catch (e) {
      console.error("Error fetching products:", e);
      toast.error("Network error while loading products");
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const handleAddProduct = async (e: React.FormEvent) => {
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

      const saved: Product = await res.json();
      setProducts((prev) => [...prev, saved]);
      toast.success("Product added successfully");

      // Reset formular + inchide modal
      setAddModalVisible(false);
      setName("");
      setSku("");
      setDescription("");
      setPurchasePrice("");
      setBasePrice("");
      setRequiresBatchTracking(false);
    } catch (e) {
      console.error("Error adding product:", e);
      toast.error("Network error while adding product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DashboardLayout activeLink="products">
      <div className="w-full h-full flex flex-col gap-4 px-10 py-6">
        {/* Bară acțiuni */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setAddModalVisible(true)}
          >
            + Add Product
          </button>
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
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Batch</th>
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
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-[#333]">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.sku}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2 text-right">
                      {p.basePrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.requiresBatchTracking ? "Yes" : "No"}
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
              onSubmit={handleAddProduct}
              className="bg-white w-[520px] rounded-lg shadow-lg p-6 flex flex-col gap-6"
            >
              <h2 className="text-xl font-semibold">Add Product</h2>

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
                  onClick={() => setAddModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
