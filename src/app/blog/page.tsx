import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Calendar, Heart, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured vendors
  const { data: featuredVendors } = await supabase
    .from("vendors")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(3);

  // Fetch recent blog posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, featured_image, published_at, category")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mb-16 md:mb-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Royal Indian Wedding"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-royal-maroon/80 via-royal-maroon/60 to-transparent"></div>
        </div>

        {/* Animated gold particles effect */}
        <div className="absolute inset-0 z-10 opacity-30">
          <div className="shimmer-bg h-full w-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <Sparkles className="w-16 h-16 text-royal-gold mx-auto mb-6 animate-pulse" />
            <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Celebrate Your
              <span className="block font-vibes text-6xl sm:text-7xl lg:text-8xl text-royal-gold mt-2">
                Royal Shaadi
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-royal-ivory/90 mb-12 max-w-2xl mx-auto">
              Discover India's finest wedding vendors, venues, and inspiration
              for your dream celebration
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/vendors"
                className="btn-primary btn-lg group flex items-center gap-3 min-w-[240px] justify-center"
              >
                <span>Browse Vendors</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="btn-secondary btn-lg min-w-[240px] justify-center"
              >
                Wedding Inspiration
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-royal-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-royal-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-royal-ivory to-white mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "500+", label: "Premium Vendors" },
              { number: "50+", label: "Cities Covered" },
              { number: "10K+", label: "Happy Couples" },
              { number: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-up p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {featuredVendors && featuredVendors.length > 0 && (
        <section className="py-20 md:py-28 bg-white mb-16 md:mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header - Centered */}
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-6">
                Featured Vendors
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Handpicked premium vendors to make your wedding extraordinary
              </p>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20">
              {featuredVendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover border-2 border-transparent hover:border-royal-gold h-full">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={vendor.featured_image || "/images/placeholder.jpg"}
                        alt={vendor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-5 right-5">
                        <span className="inline-block bg-royal-gold text-white px-6 py-2.5 rounded-full text-sm font-semibold capitalize shadow-xl pd-2">
                          {vendor.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="font-playfair text-2xl font-bold text-royal-maroon mb-4 group-hover:text-royal-gold transition-colors leading-tight px-2">
                        {vendor.name}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed text-base px-2">
                        {vendor.description}
                      </p>
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100 px-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-royal-gold text-royal-gold" />
                          <span className="font-semibold text-royal-maroon text-base">
                            {vendor.rating}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({vendor.reviews_count})
                          </span>
                        </div>
                        <span className="text-royal-gold font-semibold text-base">
                          {vendor.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button - Centered */}
            <div className="text-center">
              <Link
                href="/vendors"
                className="btn-primary btn-lg inline-flex items-center gap-3"
              >
                <span>View All Vendors</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-royal-ivory to-white mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Centered */}
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-6">
              Vendor Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need for your perfect wedding
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { name: "Venues", icon: "🏰", category: "venue" },
              { name: "Photographers", icon: "📸", category: "photographer" },
              { name: "Decorators", icon: "🌸", category: "decorator" },
              { name: "Caterers", icon: "🍽️", category: "caterer" },
              { name: "Makeup Artists", icon: "💄", category: "makeup" },
              { name: "Mehndi Artists", icon: "✨", category: "mehndi" },
            ].map((category) => (
              <Link
                key={category.category}
                href={`/vendors?category=${category.category}`}
                className="group bg-white rounded-xl p-8 md:p-10 text-center card-hover border-2 border-transparent hover:border-royal-gold"
              >
                <div className="text-5xl md:text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-royal-maroon group-hover:text-royal-gold transition-colors text-base md:text-lg">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="py-20 md:py-28 bg-white mb-16 md:mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header - Centered */}
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-6">
                Wedding Inspiration
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Tips, trends, and ideas for your dream wedding
              </p>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.featured_image || "/images/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-5 left-5">
                        <span className="bg-royal-gold text-white px-5 py-2 rounded-full text-sm font-semibold uppercase shadow-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="font-playfair text-xl md:text-2xl font-bold text-royal-maroon mb-4 group-hover:text-royal-gold transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-royal-gold font-semibold text-sm group-hover:text-royal-maroon transition-colors pt-5 border-t border-gray-100">
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Read More Button - Centered */}
            <div className="text-center">
              <Link
                href="/blog"
                className="btn-primary btn-lg inline-flex items-center gap-3"
              >
                <span>Read More Articles</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-royal-maroon to-royal-maroon-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="shimmer-bg h-full w-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-royal-gold mx-auto mb-10" />
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-xl md:text-2xl text-royal-ivory/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of couples who found their perfect vendors on Royal
            Shaadi
          </p>
          <Link
            href="/vendors"
            className="btn-primary btn-lg inline-flex items-center gap-3"
          >
            <Calendar className="w-6 h-6" />
            <span>Start Planning Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}