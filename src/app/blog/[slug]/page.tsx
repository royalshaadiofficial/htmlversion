import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Share2, ArrowLeft, Tag } from "lucide-react";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Extract slug after awaiting
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, featured_image")
    .eq("slug", slug) // Use the awaited slug here
    .single();

  if (!post) {
    return {
      title: "Post Not Found | Royal Shaadi",
    };
  }

  return {
    title: `${post.title} | Royal Shaadi Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image || "/images/placeholder.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // Extract slug after awaiting
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug) // Use the awaited slug here
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("slug, title, featured_image, category, published_at")
    .eq("category", post.category)
    .neq("id", post.id)
    .eq("is_published", true)
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <article>
        {/* Back Button */}
        <div className="bg-royal-ivory/50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-royal-maroon hover:text-royal-gold transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={post.featured_image || "/images/placeholder.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-royal-gold text-white px-4 py-1.5 rounded-full text-sm font-semibold uppercase">
                  {post.category}
                </span>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time || 5} min read</span>
                  </div>
                </div>
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Excerpt */}
          <div className="text-xl text-gray-700 leading-relaxed mb-12 pb-12 border-b-2 border-royal-gold/20">
            <p className="font-medium">{post.excerpt}</p>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {/* This would be markdown content in production */}
            <div
              dangerouslySetInnerHTML={{
                __html: post.content || "<p>Content coming soon...</p>",
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-royal-gold" />
                <span className="font-semibold text-gray-700">Tags:</span>
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${tag}`}
                    className="bg-royal-ivory hover:bg-royal-gold/10 text-royal-maroon px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-playfair text-2xl font-bold text-royal-maroon">
                Share this article
              </h3>
              <div className="flex items-center gap-3">
                <button className="bg-royal-gold hover:bg-royal-gold-light text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-royal-ivory to-white border-t-2 border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-royal-maroon mb-12 text-center">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          relatedPost.featured_image || "/images/placeholder.jpg"
                        }
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-royal-gold text-sm font-semibold mb-2 uppercase">
                        {relatedPost.category}
                      </div>
                      <h3 className="font-playfair text-xl font-bold text-royal-maroon group-hover:text-royal-gold transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-royal-maroon to-royal-maroon-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-6">💍</div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Vendors?
          </h2>
          <p className="text-xl text-royal-ivory/90 mb-8">
            Browse our curated collection of premium wedding vendors
          </p>
          <Link href="/vendors" className="btn-primary btn-lg">
            Explore Vendors
          </Link>
        </div>
      </section>
    </div>
  );
}