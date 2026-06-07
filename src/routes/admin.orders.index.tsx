import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Orders Management</h1>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">New Order</button>
        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No orders yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
});
