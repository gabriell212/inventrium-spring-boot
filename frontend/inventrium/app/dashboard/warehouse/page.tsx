"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
}

interface Batch {
  id: number;
  batchNumber: string;
  productName: string;
  quantity: number;
  warehouseId: number;
}

interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  type: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdByUsername?: string;
  updatedByUsername?: string;
  companyId?: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(false);

  const [addPanelVisible, setAddPanelVisible] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("MAIN");
  const [isActive, setIsActive] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [advancedModalVisible, setAdvancedModalVisible] = useState(false);
  const [advancedDetails, setAdvancedDetails] = useState<Warehouse | null>(
    null,
  );

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferWarehouse, setTransferWarehouse] = useState<Warehouse | null>(
    null,
  );

  const [transferBatchId, setTransferBatchId] = useState<number | null>(null);
  const [transferQuantity, setTransferQuantity] = useState<number>(0);
  const [transferDestination, setTransferDestination] = useState<number | null>(
    null,
  );

  const [batches, setBatches] = useState<Batch[]>([]);

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

  const fetchWarehouses = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/warehouses`,
        { headers: { Authorization: token } }
      );

      if (!res.ok) {
        toast.error("Failed to load warehouses");
        return;
      }

      const data = await res.json();
      setWarehouses(data);
    } catch (e) {
      toast.error("Network error while loading warehouses");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/inventory/batches`,
        { headers: { Authorization: token } },
      );

      if (!res.ok) {
        toast.error("Failed to load batches");
        return;
      }

      const data = await res.json();
      setBatches(data);
    } catch {
      toast.error("Network error while loading batches");
    }
  };

  const handleViewAdvancedDetails = async (id: number) => {
    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/warehouses/${id}`,
        { headers: { Authorization: token } },
      );

      if (!res.ok) {
        toast.error("Failed to load warehouse details");
        return;
      }

      const data = await res.json();
      setAdvancedDetails(data);
      setAdvancedModalVisible(true);
    } catch {
      toast.error("Network error while loading details");
    }
  };

  const handleAddWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) return;

    const payload = { code, name, location, type, isActive };

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/warehouses`,
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
        toast.error("Failed to add warehouse");
        return;
      }

      const saved: Warehouse = await res.json();
      setWarehouses((prev) => [...prev, saved]);
      toast.success("Warehouse added");

      setAddPanelVisible(false);
      setCode("");
      setName("");
      setLocation("");
      setType("MAIN");
      setIsActive(true);
    } catch {
      toast.error("Network error");
    }
  };

  const handleUpdateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();

    const { token, companyId } = getAuthContext();
    if (!token || !selectedWarehouse) return;

    if (!companyId) {
      toast.error("Missing company context");
      return;
    }

    const payload = { name, location, type, isActive };

    const res = await fetch(
      `http://localhost:8080/companies/${companyId}/warehouses/${selectedWarehouse.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      toast.error("Failed to update warehouse");
      return;
    }

    toast.success("Warehouse updated");

    setEditModalVisible(false);
    setSelectedWarehouse(null);
    fetchWarehouses();
  };

  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;

    const { token, companyId } = getAuthContext();
    if (!token) return;

    const res = await fetch(
      `http://localhost:8080/companies/${companyId}/warehouses/${selectedWarehouse.id}`,
      {
        method: "DELETE",
        headers: { Authorization: token },
      },
    );

    if (!res.ok) {
      toast.error("Failed to delete warehouse");
      return;
    }

    toast.success("Warehouse deleted");

    setSelectedWarehouse(null);
    fetchWarehouses();
  };

  const handleTransferStock = async () => {
    if (!transferBatchId || !transferDestination || transferQuantity <= 0) {
      toast.error("Please complete all fields");
      return;
    }

    const { token, companyId } = getAuthContext();
    if (!token || !companyId || !transferWarehouse) return;

    const payload = {
      batchId: transferBatchId,
      fromWarehouseId: transferWarehouse.id,
      toWarehouseId: transferDestination,
      quantity: transferQuantity,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/inventory/transfer`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        toast.error("Transfer failed");
        return;
      }

      toast.success("Stock transferred successfully");

      setShowTransferModal(false);
      setTransferBatchId(null);
      setTransferQuantity(0);
      setTransferDestination(null);

      fetchWarehouses();
      fetchBatches();
    } catch {
      toast.error("Network error during transfer");
    }
  };

  const openTransferModal = (warehouse: Warehouse) => {
    setTransferWarehouse(warehouse);
    setShowTransferModal(true);
  };

  useEffect(() => {
    fetchWarehouses();
    fetchBatches();
  }, []);

  return (
    <DashboardLayout activeLink="warehouses">
      <div className="w-full h-full flex flex-row gap-4 px-10 py-6">
        {/* LEFT SIDE — TABLE */}
        <div className="w-2/3 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-black">Warehouses</h1>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setAddPanelVisible(true)}
            >
              + Add Warehouse
            </button>
          </div>

          <div className="rounded-lg overflow-hidden border border-[#333]">
            <table className="table-fixed text-white w-full">
              <thead className="bg-[#111]">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Active</th>
                </tr>
              </thead>
              <tbody className="bg-[#222]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-300"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : (
                  warehouses.map((w) => (
                    <tr
                      key={w.id}
                      className="border-t border-[#333] cursor-pointer hover:bg-[#333]"
                      onClick={() => setSelectedWarehouse(w)}
                    >
                      <td className="px-4 py-2">{w.code}</td>
                      <td className="px-4 py-2">{w.name}</td>
                      <td className="px-4 py-2">{w.location}</td>
                      <td className="px-4 py-2">{w.type}</td>
                      <td className="px-4 py-2">{w.isActive ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE — DETAILS PANEL */}
        <div className="w-1/3 bg-white rounded-lg shadow p-6 h-fit sticky top-6">
          {selectedWarehouse ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Warehouse Details</h2>
                <button
                  onClick={() => setSelectedWarehouse(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <strong>Code:</strong> {selectedWarehouse.code}
                </div>
                <div>
                  <strong>Name:</strong> {selectedWarehouse.name}
                </div>
                <div>
                  <strong>Location:</strong> {selectedWarehouse.location}
                </div>
                <div>
                  <strong>Type:</strong> {selectedWarehouse.type}
                </div>
                <div>
                  <strong>Active:</strong>{" "}
                  {selectedWarehouse.isActive ? "Yes" : "No"}
                </div>
              </div>

              <hr className="my-4" />
              <div className="flex flex-col gap-3">
                <button
                  className="bg-blue-700 text-white py-2 rounded hover:opacity-80 transition"
                  onClick={() =>
                    handleViewAdvancedDetails(selectedWarehouse.id)
                  }
                >
                  View Advanced Details
                </button>
                <button
                  className="bg-blue-600 text-white py-2 rounded hover:opacity-80 transition"
                  onClick={() => {
                    if (selectedWarehouse) {
                      window.location.href = `/dashboard/batch?warehouseId=${selectedWarehouse.id}`;
                    }
                  }}
                >
                  View Batches
                </button>
                <button
                  className="bg-purple-600 text-white py-2 rounded hover:opacity-80 transition"
                  onClick={() => openTransferModal(selectedWarehouse)}
                >
                  Transfer Stock
                </button>
                <button
                  className="bg-gray-600 text-white py-2 rounded hover:opacity-80 transition"
                  onClick={() => {
                    if (selectedWarehouse) {
                      setCode(selectedWarehouse.code);
                      setName(selectedWarehouse.name);
                      setLocation(selectedWarehouse.location);
                      setType(selectedWarehouse.type);
                      setIsActive(selectedWarehouse.isActive);
                    }
                    setEditModalVisible(true);
                  }}
                >
                  Edit Warehouse
                </button>
                <button
                  className="bg-red-600 text-white py-2 rounded hover:opacity-80 transition"
                  onClick={handleDeleteWarehouse}
                >
                  Delete Warehouse
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              Select a warehouse to view details
            </div>
          )}
        </div>

        {advancedModalVisible && advancedDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Advanced Warehouse Details
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  <b>Code:</b> {advancedDetails.code}
                </p>
                <p>
                  <b>Name:</b> {advancedDetails.name}
                </p>
                <p>
                  <b>Location:</b> {advancedDetails.location}
                </p>
                <p>
                  <b>Type:</b> {advancedDetails.type}
                </p>
                <p>
                  <b>Active:</b> {advancedDetails.isActive ? "Yes" : "No"}
                </p>

                <p>
                  <b>Created At:</b>{" "}
                  {advancedDetails.createdAt
                    ? new Date(advancedDetails.createdAt).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <b>Created By:</b> {advancedDetails.createdByUsername ?? "—"}
                </p>

                <p>
                  <b>Updated At:</b>{" "}
                  {advancedDetails.updatedAt
                    ? new Date(advancedDetails.updatedAt).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <b>Updated By:</b> {advancedDetails.updatedByUsername ?? "—"}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setAdvancedModalVisible(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PANEL (SLIDE-OVER) */}
        {addPanelVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleAddWarehouse}
              className="bg-white w-[420px] rounded-lg shadow-lg p-6 flex flex-col gap-6"
            >
              <h2 className="text-xl font-semibold">Add Warehouse</h2>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

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
                <label className="text-sm font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SECONDARY">SECONDARY</option>
                  <option value="EXTERNAL">EXTERNAL</option>
                  <option value="TRANSIT">TRANSIT</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 accent-green-600"
                  />
                </div>
                <div className="flex items-center">
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setAddPanelVisible(false)}
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

        {editModalVisible && selectedWarehouse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              onSubmit={handleUpdateWarehouse}
              className="bg-white w-[420px] rounded-lg shadow-lg p-6 flex flex-col gap-6"
            >
              <h2 className="text-xl font-semibold">Edit Warehouse</h2>

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
                <label className="text-sm font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="SECONDARY">SECONDARY</option>
                  <option value="EXTERNAL">EXTERNAL</option>
                  <option value="TRANSIT">TRANSIT</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 accent-green-600"
                  />
                </div>
                <div className="flex items-center">
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setEditModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {showTransferModal && transferWarehouse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Transfer Stock</h2>

              <div className="flex flex-col gap-4">
                {/* From Warehouse */}
                <div>
                  <label className="text-sm font-medium">From Warehouse</label>
                  <input
                    type="text"
                    value={transferWarehouse.name}
                    disabled
                    className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Batch Select */}
                <div>
                  <label className="text-sm font-medium">Batch</label>
                  <select
                    value={transferBatchId ?? ""}
                    onChange={(e) => setTransferBatchId(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Batch</option>
                    {batches
                      .filter((b) => b.warehouseId === transferWarehouse.id)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.batchNumber} — {b.productName} ({b.quantity})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium">
                    Quantity to Transfer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={transferQuantity}
                    onChange={(e) =>
                      setTransferQuantity(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Destination Warehouse */}
                <div>
                  <label className="text-sm font-medium">
                    Destination Warehouse
                  </label>
                  <select
                    value={transferDestination ?? ""}
                    onChange={(e) =>
                      setTransferDestination(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses
                      .filter((w) => w.id !== transferWarehouse.id)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleTransferStock}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}