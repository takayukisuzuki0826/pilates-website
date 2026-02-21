import Link from "next/link";
import { getCustomers } from "@/lib/google-sheets";
import CustomerSearch from "@/components/admin/CustomerSearch";

export const metadata = {
  title: "顧客一覧",
};

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  // 来店回数の多い順にソート
  const sorted = [...customers].sort((a, b) => b.totalVisits - a.totalVisits);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">顧客一覧</h1>
        <Link href="/admin" className="text-primary-600 hover:text-primary-700 text-sm">
          ← 管理画面
        </Link>
      </div>

      <CustomerSearch customers={sorted} />
    </div>
  );
}
