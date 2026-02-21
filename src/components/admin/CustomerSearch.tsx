"use client";

import { useState } from "react";
import Link from "next/link";
import type { Customer } from "@/lib/types";

interface CustomerSearchProps {
  customers: Customer[];
}

export default function CustomerSearch({ customers }: CustomerSearchProps) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="名前で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-neutral-50 rounded-xl p-6 text-center text-neutral-500">
          {search ? "該当する顧客が見つかりません" : "顧客データがありません"}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500">名前</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 hidden sm:table-cell">メール</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500">来店回数</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 hidden md:table-cell">初回来店</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((c) => (
                  <tr key={c.customerId} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${c.customerId}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-neutral-800 text-center">{c.totalVisits}回</td>
                    <td className="px-4 py-3 text-sm text-neutral-500 hidden md:table-cell">{c.firstVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-neutral-400 text-xs mt-3">{filtered.length}件</p>
    </div>
  );
}
