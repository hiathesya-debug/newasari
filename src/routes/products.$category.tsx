import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/products/$category")({
  component: CategoryRedirect,
});

function CategoryRedirect() {
  const { category } = Route.useParams();
  useEffect(() => {
    window.location.replace("/products?category=" + category);
  }, [category]);
  return null;
}
