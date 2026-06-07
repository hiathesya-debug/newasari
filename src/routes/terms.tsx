import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: () => (
    <div className="p-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <div className="space-y-4 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Usage Agreement</h2>
          <p>By using our services, you agree to comply with these terms and conditions.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. User Responsibilities</h2>
          <p>Users are responsible for maintaining the confidentiality of their account information.</p>
        </section>
      </div>
    </div>
  ),
});
