import Image from "next/image";

export const metadata = {
  title: "Wedding Gallery - Real Celebrations",
  description: "Browse beautiful moments from real Indian weddings planned through Royal Shaadi.",
};

export default function GalleryPage() {
  const images = [
    "/images/gallery/gallery-1.jpg",
    "/images/gallery/gallery-2.jpg",
    "/images/gallery/gallery-3.jpg",
    "/images/gallery/gallery-4.jpg",
    "/images/gallery/gallery-5.jpg",
    "/images/gallery/gallery-6.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-ivory to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-royal-maroon mb-4">
            Wedding Gallery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Celebrate love through stunning moments from real Indian weddings
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <Image
                  src={img}
                  alt={`Wedding ${idx + 1}`}
                  width={600}
                  height={800}
                  className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}