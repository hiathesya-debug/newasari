import { createFileRoute, Outlet } from "@tanstack/react-router";

// This file is a layout route for /admin/products/*.
// It renders <Outlet> so child routes (new, $id/edit) can render inside it.
export const Route = createFileRoute("/admin/products")({
  component: () => <Outlet />,
});
