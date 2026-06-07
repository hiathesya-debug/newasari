import { createRootRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createRootRoute({
  component: () => <CustomerLayout />,
});
