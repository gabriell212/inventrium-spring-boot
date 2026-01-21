"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
  role?: string;
}

interface Batch {
  id: number;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  batchStatus: string;
  receivedDate?: string;
  manufacturingDate?: string;
  expirationDate?: string;
  notes?: string;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  createdAt: string;
  updatedAt?: string;
}

interface Product {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

export default function BatchPage() {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected batch
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Form fields
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [batchStatus, setBatchStatus] = useState("AVAILABLE");

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

  // Extract companyId and role from JWT
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const rawToken = token.startsWith("Bearer ")
        ? token.replace("Bearer ", "")
        : token;
      const decoded = jwtDecode<JwtPayload>(rawToken);
      if (decoded.companyId) {
        setCompanyId(decoded.companyId);
      }
      if (decoded.role) {
        setUserRole(decoded.role);
      }
    } catch {
      toast.error("Invalid token");
    }
  }, []);

  // Detect if coming from Warehouse page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wId = params.get("warehouseId");

    if (wId) {
      setSelectedWarehouse(wId);
    }
  }, []);

  // Read warehouseId from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wId = params.get("warehouseId");

    if (wId) {
      setSelectedWarehouse(wId);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (!companyId) return;

    fetchBatches();
    fetchProducts();
    fetchWarehouses();
  }, [companyId]);

  // Reload batches when warehouse filter changes
  useEffect(() => {
    if (companyId) {
      fetchBatches();
    }
  }, [selectedWarehouse]);

  const fetchBatches = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    setLoading(true);

    try {
      const url = selectedWarehouse
        ? `http://localhost:8080/companies/${companyId}/inventory/batches/warehouse/${selectedWarehouse}`
        : `http://localhost:8080/companies/${companyId}/inventory/batches`;

      const res = await fetch(url, { headers: { Authorization: token } });
      const data = await res.json();
      setBatches(data);
    } catch {
      toast.error("Failed to load batches");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (companyId) {
      fetchBatches();
    }
  }, [selectedWarehouse]);

  const fetchProducts = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/products`,
        { headers: { Authorization: token } },
      );
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const fetchWarehouses = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/warehouses`,
        { headers: { Authorization: token } },
      );
      const data = await res.json();
      setWarehouses(data);
    } catch {
      toast.error("Failed to load warehouses");
    }
  };

  const resetForm = () => {
    setBatchNumber("");
    setQuantity(0);
    setCostPrice(0);
    setProductId("");
    setWarehouseId("");
    setReceivedDate("");
    setManufacturingDate("");
    setExpirationDate("");
    setNotes("");
    setBatchStatus("AVAILABLE");
  };

  // Create batch
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    const payload: any = {
      batchNumber,
      quantity,
      costPrice,
      productId: Number(productId),
      warehouseId: Number(warehouseId),
    };

    if (receivedDate) payload.receivedDate = receivedDate;
    if (manufacturingDate) payload.manufacturingDate = manufacturingDate;
    if (expirationDate) payload.expirationDate = expirationDate;
    if (notes) payload.notes = notes;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/inventory/batches`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Batch created successfully");
      setShowAddModal(false);
      resetForm();
      fetchBatches();
    } catch {
      toast.error("Failed to create batch");
    }
  };

  // Update batch
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBatch) return;

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    const payload: any = {
      quantity,
      costPrice,
      batchStatus,
    };

    if (receivedDate) payload.receivedDate = receivedDate;
    if (manufacturingDate) payload.manufacturingDate = manufacturingDate;
    if (expirationDate) payload.expirationDate = expirationDate;
    if (notes) payload.notes = notes;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/inventory/batches/${selectedBatch.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Batch updated successfully");
      setShowEditModal(false);
      setSelectedBatch(null);
      resetForm();
      fetchBatches();
    } catch {
      toast.error("Failed to update batch");
    }
  };

  // Delete batch
  const handleDeleteBatch = async () => {
    if (!selectedBatch) return;

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/inventory/batches/${selectedBatch.id}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Batch deleted successfully");
      setShowDeleteModal(false);
      setSelectedBatch(null);
      fetchBatches();
    } catch {
      toast.error("Failed to delete batch");
    }
  };

  // Open edit modal
  const openEditModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setQuantity(batch.quantity);
    setCostPrice(batch.costPrice);
    setBatchStatus(batch.batchStatus);
    setReceivedDate(batch.receivedDate || "");
    setManufacturingDate(batch.manufacturingDate || "");
    setExpirationDate(batch.expirationDate || "");
    setNotes(batch.notes || "");
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  // Open delete modal
  const openDeleteModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowDeleteModal(true);
  };

  // Filtered list
  const filteredBatches = batches.filter((b) => {
    return (
      (selectedProduct ? b.productId === Number(selectedProduct) : true) &&
      (selectedWarehouse
        ? b.warehouseId === Number(selectedWarehouse)
        : true) &&
      (selectedStatus ? b.batchStatus === selectedStatus : true)
    );
  });

  const canEdit = userRole && ["ADMINISTRATOR", "MANAGER"].includes(userRole);
  const canView =
    userRole && ["ADMINISTRATOR", "MANAGER", "OPERATOR"].includes(userRole);

  return (
    <DashboardLayout activeLink="batch">
      <div className="w-full h-full flex flex-col gap-4 px-10 py-6">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-black">Batches</h1>

            {/* Back to Warehouse button — only if coming from warehouse */}
            {selectedWarehouse && (
              <button
                onClick={() => (window.location.href = `/dashboard/warehouse?highlight=${selectedWarehouse}`)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                ← Back to Warehouse
              </button>
            )}
          </div>

          {canEdit && (
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded whitespace-nowrap"
            >
              + Add Batch
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 rounded border border-gray-400 text-sm"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded border border-gray-400 text-sm"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 rounded border border-gray-400 text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="DAMAGED">DAMAGED</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden border border-[#333]">
          <table className="table-fixed text-white w-full">
            <thead className="bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-left">Batch #</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Warehouse</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Cost Price</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-[#222]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    Loading batches…
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    No batches found
                  </td>
                </tr>
              ) : (
                filteredBatches.map((b) => (
                  <tr key={b.id} className="border-t border-[#333]">
                    <td className="px-4 py-2">{b.batchNumber}</td>
                    <td className="px-4 py-2">{b.productName}</td>
                    <td className="px-4 py-2">{b.warehouseName}</td>
                    <td className="px-4 py-2 text-right">{b.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(b.costPrice)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          b.batchStatus === "AVAILABLE"
                            ? "bg-green-600"
                            : b.batchStatus === "EXPIRED"
                              ? "bg-red-600"
                              : b.batchStatus === "RESERVED"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                        }`}
                      >
                        {b.batchStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {canView && (
                          <button
                            onClick={() => openViewModal(b)}
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
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}

                        {canEdit && (
                          <>
                            <button
                              onClick={() => openEditModal(b)}
                              title="Edit"
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
                              onClick={() => openDeleteModal(b)}
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

        {/* Add Batch Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <form
              onSubmit={handleCreateBatch}
              className="bg-white w-[600px] rounded-lg shadow-lg p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold">Add Batch</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Batch Number *</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Cost Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Product *</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Warehouse *</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Received Date</label>
                  <input
                    type="datetime-local"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Manufacturing Date
                  </label>
                  <input
                    type="datetime-local"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Batch Modal */}
        {showEditModal && selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <form
              onSubmit={handleUpdateBatch}
              className="bg-white w-[600px] rounded-lg shadow-lg p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold">Edit Batch</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Batch Number</label>
                  <input
                    type="text"
                    value={selectedBatch.batchNumber}
                    className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Product</label>
                  <input
                    type="text"
                    value={selectedBatch.productName}
                    className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Warehouse</label>
                  <input
                    type="text"
                    value={selectedBatch.warehouseName}
                    className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Quantity *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Cost Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Status *</label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="DAMAGED">DAMAGED</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Received Date</label>
                  <input
                    type="datetime-local"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Manufacturing Date
                  </label>
                  <input
                    type="datetime-local"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBatch(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Batch Modal */}
        {showViewModal && selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Batch Details</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <b>Batch Number:</b> {selectedBatch.batchNumber}
                </p>
                <p>
                  <b>Product:</b> {selectedBatch.productName}
                </p>
                <p>
                  <b>Warehouse:</b> {selectedBatch.warehouseName}
                </p>
                <p>
                  <b>Quantity:</b> {selectedBatch.quantity}
                </p>
                <p>
                  <b>Cost Price:</b> {selectedBatch.costPrice}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      selectedBatch.batchStatus === "AVAILABLE"
                        ? "bg-green-600 text-white"
                        : selectedBatch.batchStatus === "EXPIRED"
                          ? "bg-red-600 text-white"
                          : selectedBatch.batchStatus === "RESERVED"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-white"
                    }`}
                  >
                    {selectedBatch.batchStatus}
                  </span>
                </p>
                <p>
                  <b>Received Date:</b>{" "}
                  {selectedBatch.receivedDate
                    ? new Date(selectedBatch.receivedDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <b>Manufacturing Date:</b>{" "}
                  {selectedBatch.manufacturingDate
                    ? new Date(selectedBatch.manufacturingDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <b>Expiration Date:</b>{" "}
                  {selectedBatch.expirationDate
                    ? new Date(selectedBatch.expirationDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <b>Notes:</b> {selectedBatch.notes || "—"}
                </p>
                <p>
                  <b>Created At:</b>{" "}
                  {new Date(selectedBatch.createdAt).toLocaleString()}
                </p>
                <p>
                  <b>Updated At:</b>{" "}
                  {selectedBatch.updatedAt
                    ? new Date(selectedBatch.updatedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedBatch(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white w-[450px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Delete Batch
              </h2>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete batch{" "}
                <span className="font-bold">"{selectedBatch.batchNumber}"</span>
                ?
                <br />
                <span className="text-sm text-gray-500">
                  This action cannot be undone.
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBatch(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBatch}
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