import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  component: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-medium">
            Sign In
          </button>
        </form>
      </div>
    </div>
  ),
});
