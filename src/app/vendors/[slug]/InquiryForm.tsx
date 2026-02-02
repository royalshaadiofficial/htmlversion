"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle } from "lucide-react";

interface InquiryFormProps {
  vendorId: string;
  vendorName: string;
}

export default function InquiryForm({ vendorId, vendorName }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    wedding_date: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: submitError } = await supabase.from("inquiries").insert([
        {
          vendor_id: vendorId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          wedding_date: formData.wedding_date || null,
          budget: formData.budget || null,
          message: formData.message,
        },
      ]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        wedding_date: "",
        budget: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setError("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border-2 border-royal-gold">
        <CheckCircle className="w-20 h-20 text-royal-gold mx-auto mb-6" />
        <h3 className="font-playfair text-3xl font-bold text-royal-maroon mb-4">
          Thank You!
        </h3>
        <p className="text-gray-600 text-lg mb-8">
          Your inquiry has been sent to {vendorName}. They will contact you
          within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-secondary"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-royal-gold/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-gray-800 font-semibold mb-2"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors text-gray-800"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-800 font-semibold mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors text-gray-800"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-gray-800 font-semibold mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors text-gray-800"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        {/* Wedding Date & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="wedding_date"
              className="block text-gray-800 font-semibold mb-2"
            >
              Wedding Date (Optional)
            </label>
            <input
              type="date"
              id="wedding_date"
              name="wedding_date"
              value={formData.wedding_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-gray-800 font-semibold mb-2"
            >
              Budget Range (Optional)
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors text-gray-800"
            >
              <option value="">Select budget range</option>
              <option value="under-1-lakh">Under ₹1 Lakh</option>
              <option value="1-3-lakhs">₹1-3 Lakhs</option>
              <option value="3-5-lakhs">₹3-5 Lakhs</option>
              <option value="5-10-lakhs">₹5-10 Lakhs</option>
              <option value="above-10-lakhs">Above ₹10 Lakhs</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-gray-800 font-semibold mb-2"
          >
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-royal-gold focus:outline-none transition-colors resize-none text-gray-800"
            placeholder="Tell us about your requirements, preferences, or any specific questions..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary btn-lg w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Inquiry</span>
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By submitting this form, you agree to be contacted by {vendorName} regarding your inquiry.
        </p>
      </form>
    </div>
  );
}