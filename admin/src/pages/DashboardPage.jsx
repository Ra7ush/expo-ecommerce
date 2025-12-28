import React from "react";
import { Link, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { orderAPi, statsApi } from "../lib/api";
import {
  ShoppingCartIcon,
  UserIcon,
  DollarSignIcon,
  PackageIcon,
} from "lucide-react";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderAPi.getAll,
  });
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  // it would be better to send the last 5 orders from the backend, instead of fetching all orders and slicing them here
  // we sended the Orders as the object json that why we say ordersData.orders
  const recentOrders = ordersData?.orders?.slice(0, 5) || [];
  const statsCards = [
    {
      name: "Total Revenue",
      value: statsLoading
        ? "Loading..."
        : `$${statsData?.totalSales?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-6" />,
      color: "text-success",
    },
    {
      name: "Total Orders",
      value: statsLoading ? "Loading..." : statsData?.totalOrders || 0,
      icon: <ShoppingCartIcon className="size-6" />,
      color: "text-info",
    },
    {
      name: "Total Customers",
      value: statsLoading ? "Loading..." : statsData?.totalCustomers || 0,
      icon: <UserIcon className="size-6" />,
      color: "text-warning",
    },
    {
      name: "Total Products",
      value: statsLoading ? "Loading..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-6" />,
      color: "text-error",
    },
  ];

  if (ordersLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.name}
            className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-shadow"
          >
            <div className="card-body p-4 flex-row items-center gap-4">
              <div className={`p-3 rounded-xl bg-base-300 ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm opacity-70 font-medium">{card.name}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-300/30">
            <h2 className="card-title text-lg font-bold">Recent Orders</h2>
            <Link to="/orders" className="btn btn-ghost btn-xs text-primary">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead className="bg-base-300/50">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover">
                      <td className="font-mono text-xs opacity-70">
                        {order._id.substring(0, 10)}...
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {order.user?.name || "Guest"}
                          </span>
                          <span className="text-xs opacity-50">
                            {order.user?.email}
                          </span>
                        </div>
                      </td>
                      <td className="font-bold">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm font-medium ${
                            order.status === "delivered"
                              ? "badge-success"
                              : order.status === "shipped"
                              ? "badge-info"
                              : "badge-warning"
                          }`}
                        >
                          {order.status}
                        </div>
                      </td>
                      <td className="text-xs opacity-70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 opacity-50">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
