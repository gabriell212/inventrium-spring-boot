"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface JwtPayload {
  companyId?: number | null;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/categories`,
        { headers: { Authorization: token } }
      );
      if (!res.ok) {
        toast.error("Failed to load categories");
        return;
      }
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error("Error fetching categories:", e);
      toast.error("Network error while loading categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const { token, companyId } = getAuthContext();
    if (!token || !companyId) {
      toast.error("Missing authentication or company context");
      return;
    }

    const payload = { name, description };

    try {
      const res = await fetch(
        `http://localhost:8080/companies/${companyId}/catalog/categories`,
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
        toast.error("Failed to add category");
        return;
      }

      const saved: Category = await res.json();
      setCategories((prev) => [...prev, saved]);
      toast.success("Category added successfully");

      setAddModalVisible(false);
      setName("");
      setDescription("");
    } catch (e) {
      console.error("Error adding category:", e);
      toast.error("Network error while adding category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <DashboardLayout activeLink="categories">
      <div className="w-full h-full flex flex-col gap-4 px-10 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-black">Categories</h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setAddModalVisible(true)}
          >
            + Add Category
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden border border-[#333]">
          <table className="table-fixed text-white w-full">
            <thead className="bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="bg-[#222]">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    Loading categories…
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-300"
                  >
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-t border-[#333]">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.description ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Add Category */}
        {addModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50">
            <form
              onSubmit={handleAddCategory}
              className="bg-white w-[420px] rounded-lg shadow-lg p-6 flex flex-col gap-6"
            >
              <h2 className="text-xl font-semibold">Add Category</h2>

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
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>

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