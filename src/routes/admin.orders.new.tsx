import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/new")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>
      <div className="bg-white p-6 rounded-lg border">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="Select customer" />
          </div>
          <div>
            <label className="block text-sm font-medium">Products</label>
            <textarea className="w-full p-2 border rounded" rows={4} placeholder="Add products..." />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Create Order
            </button>
            <button type="button" className="border px-4 py-2 rounded" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ),
});
