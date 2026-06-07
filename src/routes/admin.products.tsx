import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Products Management</h1>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Add New Product</button>
        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No products yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
});
