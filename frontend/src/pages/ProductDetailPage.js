import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
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

    const message = `Hi! I want to order:\n\n*${product.name}*\nSize: ${selectedSize}\nPrice: ₹${product.price}\n\nPlease confirm availability and shipping details.`;
    const whatsappUrl = `https://wa.me/918509643203?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-[#171717] aspect-square" data-testid="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-detail-image"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-2" data-testid="product-category">
                {product.category}
              </div>
              <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-4" data-testid="product-detail-name">
                {product.name}
              </h1>
              <p className="text-base leading-relaxed text-neutral-300 mb-6" data-testid="product-description">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-yellow-400" data-testid="product-detail-price">
                ₹{product.price}
              </div>
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2" data-testid="product-rating">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                    />
                  ))}
                </div>
                <span className="text-neutral-400" data-testid="review-count">
                  {avgRating} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <label className="text-sm font-bold text-neutral-300 mb-3 block">SELECT SIZE</label>
              <div className="flex space-x-3" data-testid="size-selector">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg'
                        : 'bg-[#171717] text-neutral-300 hover:bg-[#262626]'
                    }`}
                    data-testid={`size-option-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <button
              onClick={handleOrderViaWhatsApp}
              className="btn-gradient-green w-full py-6 text-base"
              data-testid="whatsapp-order-button"
            >
              <MessageCircle className="w-5 h-5 mr-2 inline" />
              ORDER VIA WHATSAPP
            </button>
            <p className="text-center text-xs text-neutral-500">Chat with us on WhatsApp</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24" data-testid="reviews-section">
          <h2 className="text-2xl sm:text-3xl tracking-tight font-bold text-white mb-8">Customer Reviews</h2>

          {/* Submit Review */}
          {user && user._id && (
            <form onSubmit={handleSubmitReview} className="bg-[#171717] p-6 rounded-sm mb-8" data-testid="review-form">
              <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="text-sm font-bold text-neutral-300 mb-2 block">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      data-testid={`rating-star-${star}`}
                    >
                      <Star
                        className={`w-6 h-6 cursor-pointer ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-bold text-neutral-300 mb-2 block">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-sm"
                  rows={4}
                  required
                  data-testid="review-comment-input"
                />
              </div>
              <button
                type="submit"
                className="btn-gradient px-6 py-3"
                data-testid="submit-review-button"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6" data-testid="reviews-list">
            {reviews.length === 0 ? (
              <p className="text-neutral-400" data-testid="no-reviews-message">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, idx) => (
                <div key={idx} className="bg-[#171717] p-6 rounded-sm" data-testid={`review-item-${idx}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white" data-testid={`review-user-${idx}`}>{review.user_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-neutral-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-300" data-testid={`review-comment-${idx}`}>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
