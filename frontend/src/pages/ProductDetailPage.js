import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MessageCircle } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API}/products/${productId}`);
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[2] || data.sizes[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/reviews/product/${productId}`);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleOrderViaWhatsApp = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const whatsappLink = 'https://wa.me/message/IVEZJEEROOUEP1';
    // Use anchor element to avoid ERR_BLOCKED_BY_RESPONSE
    const a = document.createElement('a');
    a.href = whatsappLink;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Opening WhatsApp...');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API}/reviews`, {
        product_id: productId,
        rating,
        comment
      }, { withCredentials: true });
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-yellow-400 text-xl font-bold" data-testid="loading-text">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="bg-[#171717] rounded-3xl overflow-hidden aspect-square" data-testid="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              data-testid="product-detail-image"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase font-bold text-yellow-400 mb-3" data-testid="product-category">
                {product.category}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight" data-testid="product-detail-name">
                {product.name}
              </h1>
              <p className="text-lg leading-relaxed text-neutral-300 mb-8" data-testid="product-description">
                {product.description}
              </p>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold text-yellow-400" data-testid="product-detail-price">
                  ₹{product.price}
                </div>
                <div className="text-lg text-neutral-500 line-through">₹{Math.round(product.price * 1.4)}</div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full">
                  {Math.round(((product.price * 1.4 - product.price) / (product.price * 1.4)) * 100)}% OFF
                </div>
              </div>
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 pb-6 border-b border-neutral-800" data-testid="product-rating">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                    />
                  ))}
                </div>
                <span className="text-neutral-300 font-medium" data-testid="review-count">
                  {avgRating} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <label className="text-sm font-bold text-white mb-4 block uppercase tracking-wide">Select Size</label>
              <div className="flex gap-3" data-testid="size-selector">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-xl scale-110'
                        : 'bg-[#171717] text-neutral-300 hover:bg-[#262626] border border-neutral-700'
                    }`}
                    data-testid={`size-option-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <div className="space-y-3">
              <button
                onClick={handleOrderViaWhatsApp}
                className="btn-gradient-green w-full py-5 text-lg"
                data-testid="whatsapp-order-button"
              >
                <MessageCircle className="w-6 h-6 mr-3 inline" />
                ORDER VIA WHATSAPP
              </button>
              <p className="text-center text-sm text-neutral-500">Get instant support on WhatsApp</p>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-[#171717] p-4 rounded-2xl">
                <p className="text-xs text-neutral-400 mb-1">Material</p>
                <p className="text-sm font-bold text-white">Premium Cotton</p>
              </div>
              <div className="bg-[#171717] p-4 rounded-2xl">
                <p className="text-xs text-neutral-400 mb-1">Shipping</p>
                <p className="text-sm font-bold text-green-400">Free Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24" data-testid="reviews-section">
          <h2 className="text-3xl font-black text-white mb-12">Customer Reviews</h2>

          {/* Submit Review */}
          {user && user._id && (
            <form onSubmit={handleSubmitReview} className="bg-[#171717] p-8 rounded-3xl mb-12" data-testid="review-form">
              <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>
              <div className="mb-6">
                <label className="text-sm font-bold text-neutral-300 mb-3 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      data-testid={`rating-star-${star}`}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600 hover:text-neutral-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-bold text-neutral-300 mb-3 block">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-2xl min-h-[120px]"
                  rows={4}
                  required
                  data-testid="review-comment-input"
                />
              </div>
              <button
                type="submit"
                className="btn-gradient px-8 py-4"
                data-testid="submit-review-button"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="reviews-list">
            {reviews.length === 0 ? (
              <p className="text-neutral-400 col-span-2 text-center py-12" data-testid="no-reviews-message">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, idx) => (
                <div key={idx} className="bg-[#171717] p-6 rounded-3xl" data-testid={`review-item-${idx}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-black font-bold">
                        {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-white block" data-testid={`review-user-${idx}`}>{review.user_name}</span>
                        <span className="text-xs text-neutral-500">
                          {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-300 leading-relaxed" data-testid={`review-comment-${idx}`}>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
