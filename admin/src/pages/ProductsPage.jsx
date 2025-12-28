import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { PlusIcon, PencilIcon, Trash2Icon, PackageIcon } from "lucide-react";

function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  const products = productsData?.products || [];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm opacity-60 text-secondary-content">
            Manage your store products
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          <PlusIcon className="size-5" />
          Add Product
        </button>
      </div>

      <div className="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-300 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} />
                            ) : (
                              <PackageIcon className="size-6 opacity-30" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-xs opacity-50 truncate max-w-xs uppercase font-mono">
                            {product._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm uppercase font-semibold">
                        {product.category}
                      </span>
                    </td>
                    <td className="font-bold text-success">
                      ${product.price.toFixed(2)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className={`badge badge-xs ${
                            product.stock > 10
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        ></div>
                        <span>{product.stock} units</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-ghost btn-xs text-info tooltip"
                          data-tip="Edit"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error tooltip"
                          data-tip="Delete"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center opacity-30">
                      <PackageIcon className="size-12 mb-2" />
                      <p>No products found yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <input
        type="checkbox"
        id="product-modal"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box bg-base-100 max-w-2xl">
          <h3 className="text-lg font-bold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <p className="py-4 text-sm opacity-60 italic">
            Form implementation coming soon. Use the backend to add products for
            now.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <button className="btn btn-primary">Save Product</button>
          </div>
        </div>
        <label className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          Close
        </label>
      </div>
    </div>
  );
}

export default ProductsPage;
