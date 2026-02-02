import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Award,
  Users,
  Heart,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Metadata } from "next";
import InquiryForm from "./InquiryForm";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: vendor } = await supabase
    .from("vendors")
    .select("name, description, featured_image, city")
    .eq("slug", params.slug)
    .single();

  if (!vendor) {
    return {
      title: "Vendor Not Found | Royal Shaadi",
    };
  }

  return {
    title: `${vendor.name} - ${vendor.city} | Royal Shaadi`,
    description: vendor.description,
    openGraph: {
      title: vendor.name,
      description: vendor.description,
      images: [vendor.featured_image || "/images/placeholder.jpg"],
    },
  };
}

export default async function VendorDetailPage({ params }: Props) {
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("vendors")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!vendor) {
    notFound();
  }

  // Fetch similar vendors
  const { data: similarVendors } = await supabase
    .from("vendors")
    .select("id, slug, name, featured_image, category, city, rating")
    .eq("category", vendor.category)
    .eq("is_active", true)
    .neq("id", vendor.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-royal-ivory/50 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 text-royal-maroon hover:text-royal-gold transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Vendors</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Main Image */}
          <div className="relative h-[400px] lg:h-[600px]">
            <Image
              src={vendor.featured_image || "/images/placeholder.jpg"}
              alt={vendor.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Vendor Info */}
          <div className="bg-gradient-to-br from-royal-ivory to-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-royal-gold/10 text-royal-gold px-4 py-2 rounded-full text-sm font-semibold uppercase mb-4 w-fit">
              <Award className="w-4 h-4" />
              <span>{vendor.category}</span>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-royal-maroon mb-4">
              {vendor.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-royal-gold text-royal-gold" />
                <span className="text-2xl font-bold text-royal-maroon">
                  {vendor.rating}
                </span>
                <span className="text-gray-600">
                  ({vendor.reviews_count} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-lg text-gray-700 mb-6">
              <MapPin className="w-5 h-5 text-royal-gold" />
              <span className="font-medium">{vendor.city}</span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {vendor.description}
            </p>

            {/* Price Badge */}
            {vendor.price_range && (
              <div className="inline-flex items-center gap-2 bg-royal-maroon text-white px-6 py-3 rounded-full font-semibold text-lg w-fit mb-8">
                <span>Starting from</span>
                <span className="text-royal-gold">{vendor.price_range}</span>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <Users className="w-8 h-8 text-royal-gold mb-2" />
                <div className="text-2xl font-bold text-royal-maroon">
                  {vendor.reviews_count}+
                </div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <Heart className="w-8 h-8 text-royal-gold mb-2" />
                <div className="text-2xl font-bold text-royal-maroon">
                  {vendor.rating}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#inquiry" className="btn-primary btn-lg text-center">
                Request Quote
              </a>
              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="btn-secondary btn-lg text-center"
                >
                  Call Now
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="mb-12">
                <h2 className="font-playfair text-3xl font-bold text-royal-maroon mb-6">
                  About {vendor.name}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {vendor.long_description || vendor.description}
                  </p>
                </div>
              </div>

              {/* Services/Features */}
              {vendor.services && vendor.services.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-playfair text-3xl font-bold text-royal-maroon mb-6">
                    Services Offered
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.services.map((service: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-royal-ivory/50 p-4 rounded-lg"
                      >
                        <CheckCircle2 className="w-6 h-6 text-royal-gold flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800 font-medium">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery would go here */}
              <div className="mb-12">
                <h2 className="font-playfair text-3xl font-bold text-royal-maroon mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="relative h-48 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={vendor.featured_image || "/images/placeholder.jpg"}
                        alt={`${vendor.name} gallery ${i}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-gradient-to-br from-royal-ivory to-white rounded-2xl p-8 shadow-xl sticky top-24 border-2 border-royal-gold/20">
                <h3 className="font-playfair text-2xl font-bold text-royal-maroon mb-6">
                  Contact Information
                </h3>

                <div className="space-y-4 mb-8">
                  {vendor.phone && (
                    <a
                      href={`tel:${vendor.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-royal-gold transition-colors group"
                    >
                      <div className="bg-royal-gold/10 p-3 rounded-lg group-hover:bg-royal-gold/20 transition-colors">
                        <Phone className="w-5 h-5 text-royal-gold" />
                      </div>
                      <span className="font-medium">{vendor.phone}</span>
                    </a>
                  )}

                  {vendor.email && (
                    <a
                      href={`mailto:${vendor.email}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-royal-gold transition-colors group"
                    >
                      <div className="bg-royal-gold/10 p-3 rounded-lg group-hover:bg-royal-gold/20 transition-colors">
                        <Mail className="w-5 h-5 text-royal-gold" />
                      </div>
                      <span className="font-medium break-all">
                        {vendor.email}
                      </span>
                    </a>
                  )}

                  {vendor.website && (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-royal-gold transition-colors group"
                    >
                      <div className="bg-royal-gold/10 p-3 rounded-lg group-hover:bg-royal-gold/20 transition-colors">
                        <Globe className="w-5 h-5 text-royal-gold" />
                      </div>
                      <span className="font-medium">Visit Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {(vendor.instagram || vendor.facebook) && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Follow Us
                    </h4>
                    <div className="flex gap-3">
                      {vendor.instagram && (
                        <a
                          href={vendor.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-royal-gold/10 hover:bg-royal-gold text-royal-gold hover:text-white p-3 rounded-lg transition-all duration-300"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {vendor.facebook && (
                        <a
                          href={vendor.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-royal-gold/10 hover:bg-royal-gold text-royal-gold hover:text-white p-3 rounded-lg transition-all duration-300"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="py-16 bg-gradient-to-br from-royal-ivory to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-4">
              Request a Quote
            </h2>
            <p className="text-gray-600 text-lg">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>
          <InquiryForm vendorId={vendor.id} vendorName={vendor.name} />
        </div>
      </section>

      {/* Similar Vendors */}
      {similarVendors && similarVendors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-royal-maroon mb-12 text-center">
              Similar {vendor.category}s
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarVendors.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/vendors/${similar.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={similar.featured_image || "/images/placeholder.jpg"}
                        alt={similar.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-playfair text-xl font-bold text-royal-maroon group-hover:text-royal-gold transition-colors mb-2">
                        {similar.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-royal-gold text-royal-gold" />
                          <span className="font-semibold">{similar.rating}</span>
                        </div>
                        <span className="text-gray-600">{similar.city}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}