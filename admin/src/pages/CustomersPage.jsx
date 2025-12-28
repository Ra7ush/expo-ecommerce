import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  UsersIcon,
  MailIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "lucide-react";
import axiosInstance from "../lib/axios";

function CustomersPage() {
  const { data: customersData, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/customers");
      return data;
    },
  });

  const customers = customersData?.customers || [];

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
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm opacity-60 text-secondary-content">
            Manage and view your customer base
          </p>
        </div>
        <div className="badge badge-lg bg-base-300 border-none gap-2 font-bold p-4">
          <UsersIcon className="size-4" />
          {customers.length} Users
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="card bg-base-200 shadow-sm border border-base-300 hover:shadow-md transition-all group overflow-hidden"
            >
              <div className="h-1.5 bg-neutral opacity-20 group-hover:opacity-100 transition-opacity"></div>

              <div className="card-body p-6">
                <div className="flex items-start gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-2xl bg-base-300 flex items-center justify-center">
                      {customer.imageUrl ? (
                        <img src={customer.imageUrl} alt={customer.name} />
                      ) : (
                        <span className="text-2xl font-black opacity-20">
                          {customer.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-lg truncate flex items-center gap-2">
                      {customer.name || "Unknown User"}
                      {customer.role === "admin" && (
                        <ShieldCheckIcon className="size-4 text-primary" />
                      )}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs opacity-60 truncate">
                      <MailIcon className="size-3" />
                      {customer.email}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-base-300 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-40">
                      Joined On
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarIcon className="size-3 opacity-50" />
                      {new Date(customer.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", year: "numeric" }
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] uppercase font-bold opacity-40">
                      User ID
                    </p>
                    <p className="text-[10px] font-mono opacity-50 truncate">
                      {customer._id.substring(0, 10)}
                    </p>
                  </div>
                </div>

                <div className="card-action mt-6">
                  <button className="btn btn-block btn-sm btn-ghost border-base-300 hover:btn-neutral">
                    View Customer History
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center opacity-30">
            <UsersIcon className="size-16 mb-4" />
            <p className="text-xl font-black uppercase tracking-widest">
              No customers yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
