import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAPi } from "../lib/api";
import {
  ClipboardListIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircle2Icon,
  TruckIcon,
  ClockIcon,
} from "lucide-react";

const STATUS_OPTIONS = ["pending", "shipped", "delivered"];

function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderAPi.getAll,
  });

  const orders = ordersData?.orders || [];

  const updateStatusMutation = useMutation({
    mutationFn: orderAPi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status });
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
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm opacity-60 text-secondary-content">
            Monitor and update customer orders
          </p>
        </div>
        <div className="badge badge-outline gap-2 border-base-300 p-4 font-semibold uppercase tracking-wider">
          <ClipboardListIcon className="size-4" />
          {orders.length} Total
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="card bg-base-200 shadow-sm border border-base-300 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="card-body p-0 flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 space-y-3 bg-base-300/30">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs opacity-50 uppercase tracking-widest">
                      #{order._id.substring(0, 12)}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4 opacity-50" />
                    <span className="opacity-70">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div
                      className={`badge ${
                        order.status === "delivered"
                          ? "badge-success"
                          : order.status === "shipped"
                          ? "badge-info"
                          : "badge-warning"
                      } gap-2 font-bold p-3 uppercase text-[10px]`}
                    >
                      {order.status === "delivered" ? (
                        <CheckCircle2Icon className="size-3" />
                      ) : order.status === "shipped" ? (
                        <TruckIcon className="size-3" />
                      ) : (
                        <ClockIcon className="size-3" />
                      )}
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-xs">
                            {order.user?.name?.charAt(0) || "G"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold flex items-center gap-2">
                          {order.user?.name || "Guest User"}
                          <span className="badge badge-ghost badge-xs">
                            Customer
                          </span>
                        </p>
                        <p className="text-xs opacity-60 font-mono">
                          {order.user?.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm space-y-1">
                      <p className="font-bold border-b border-base-300 pb-1 mb-2">
                        Order Items ({order.orderItems?.length})
                      </p>
                      {order.orderItems?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between opacity-80 text-xs"
                        >
                          <span className="truncate max-w-[200px]">
                            {item.product?.name || "Deleted Product"} x{" "}
                            {item.quantity}
                          </span>
                          <span className="font-mono">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                    <div className="w-full space-y-2 text-right">
                      <label className="text-[10px] uppercase font-bold opacity-50 tracking-tighter block">
                        Change Status
                      </label>
                      <div className="join w-full">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(order._id, status)
                            }
                            disabled={
                              updateStatusMutation.isPending &&
                              updateStatusMutation.variables?.orderId ===
                                order._id
                            }
                            className={`join-item btn btn-xs flex-1 ${
                              order.status === status
                                ? "btn-active btn-neutral"
                                : "btn-ghost border-base-300 text-[9px]"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm w-full font-bold uppercase text-xs">
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-24 opacity-30">
            <ClipboardListIcon className="size-16 mb-4" />
            <p className="text-xl font-bold">No orders found</p>
            <p className="text-sm italic">
              When customers buy products, they will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
