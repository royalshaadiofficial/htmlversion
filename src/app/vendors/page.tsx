import { Suspense } from "react";
import VendorsClient from "./VendorsClient";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Wedding Vendors - Find Premium Services",
  description:
    "Browse and discover the best wedding vendors, photographers, venues, decorators, caterers, and more for your royal Indian wedding.",
};

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: { category?: string; city?: string; search?: string };
}) {
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("vendors")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false });

  // Apply filters from URL params
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.city) {
    query = query.eq("city", searchParams.city);
  }

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  const { data: vendors, error } = await query;

  // Get unique cities and categories for filters
  const { data: allVendors } = await supabase
    .from("vendors")
    .select("city, category")
    .eq("is_active", true);

  const cities = Array.from(
    new Set(allVendors?.map((v) => v.city) || [])
  ).sort();
  
  const categories = [
    { value: "venue", label: "Venues" },
    { value: "photographer", label: "Photographers" },
    { value: "decorator", label: "Decorators" },
    { value: "caterer", label: "Caterers" },
    { value: "makeup", label: "Makeup Artists" },
    { value: "mehndi", label: "Mehndi Artists" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-ivory to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-4">
            Premium Wedding Vendors
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover hand-picked vendors for every aspect of your royal
            celebration
          </p>
        </div>

        <Suspense fallback={<div>Loading vendors...</div>}>
          <VendorsClient
            initialVendors={vendors || []}
            cities={cities}
            categories={categories}
            initialCategory={searchParams.category}
            initialCity={searchParams.city}
            initialSearch={searchParams.search}
          />
        </Suspense>
      </div>
    </div>
  );
}