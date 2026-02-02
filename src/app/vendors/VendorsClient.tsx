"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Star, MapPin, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Vendor = {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  description: string | null;
  rating: number;
  reviews_count: number;
  featured_image: string | null;
  price_range: string | null;
};

type VendorsClientProps = {
  initialVendors: Vendor[];
  cities: string[];
  categories: { value: string; label: string }[];
  initialCategory?: string;
  initialCity?: string;
  initialSearch?: string;
};

export default function VendorsClient({
  initialVendors,
  cities,
  categories,
  initialCategory,
  initialCity,
  initialSearch,
}: VendorsClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [selectedCity, setSelectedCity] = useState(initialCity || "");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  // Check user auth and fetch favorites
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("favorites")
          .select("vendor_id")
          .eq("user_id", user.id)
          .then(({ data }) => {
            if (data) {
              setFavorites(new Set(data.map((f) => f.vendor_id)));
            }
          });
      }
    });
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);
    if (searchTerm) params.set("search", searchTerm);

    const queryString = params.toString();
    router.push(`/vendors${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });

    // Fetch filtered vendors
    fetchVendors();
  }, [selectedCategory, selectedCity, searchTerm]);

  const fetchVendors = async () => {
    let query = supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (selectedCategory) query = query.eq("category", selectedCategory);
    if (selectedCity) query = query.eq("city", selectedCity);
    if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

    const { data } = await query;
    setVendors(data || []);
  };

  const toggleFavorite = async (vendorId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isFavorite = favorites.has(vendorId);

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("vendor_id", vendorId);
      setFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vendorId);
        return newSet;
      });
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, vendor_id: vendorId });
      setFavorites((prev) => new Set(prev).add(vendorId));
    }
  };

  const priceRangeLabels: Record<string, string> = {
    budget: "₹₹",
    "mid-range": "₹₹₹",
    luxury: "₹₹₹₹",
    "ultra-luxury": "₹₹₹₹₹",
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(selectedCategory || selectedCity || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedCity("");
                setSearchTerm("");
              }}
              className="bg-royal-maroon hover:bg-royal-maroon-dark text-white px-6 py-3 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-royal-maroon">{vendors.length}</span> vendors
        </p>
      </div>

      {/* Vendors Grid */}
      {vendors.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            No vendors found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-royal-gold"
            >
              <Link href={`/vendors/${vendor.slug}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={vendor.featured_image || "/images/placeholder.jpg"}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-royal-gold text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {vendor.category}
                  </div>
                  {vendor.price_range && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-royal-maroon px-3 py-1 rounded-full text-sm font-semibold">
                      {priceRangeLabels[vendor.price_range]}
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/vendors/${vendor.slug}`}>
                    <h3 className="font-playfair text-xl font-bold text-royal-maroon group-hover:text-royal-gold transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(vendor.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        favorites.has(vendor.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.city}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {vendor.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-royal-gold text-royal-gold" />
                    <span className="font-semibold text-royal-maroon">
                      {vendor.rating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({vendor.reviews_count})
                    </span>
                  </div>
                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="text-royal-gold hover:text-royal-gold-light font-semibold text-sm transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}