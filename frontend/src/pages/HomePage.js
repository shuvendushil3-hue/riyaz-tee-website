import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const HomePage = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="home-page">
      {/* Hero Section with Pure Tabla Image */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1592251615117-33939d5b29fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwzfHx0YWJsYSUyMGRydW1zJTIwaW5kaWFuJTIwcGVyY3Vzc2lvbiUyMGluc3RydW1lbnQlMjBjbG9zZSUyMHVwfGVufDB8fHx8MTc3NDgwNTcxOXww&ixlib=rb-4.1.0&q=85)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400" data-testid="hero-label">
              RIYAZ TEE COLLECTION
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-black text-white leading-tight" data-testid="hero-title">
              THE RHYTHM OF<br />DEDICATION
            </h1>
            <p className="text-base leading-relaxed text-neutral-300 max-w-2xl mx-auto" data-testid="hero-description">
              Wear your passion for music. Supporting young and emerging tabla artists through our platform and merchandise.
            </p>
            <Link to="/products">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold px-8 py-6 text-base" data-testid="hero-cta-button">
                SHOP RIYAZ TEE
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="featured-products-section">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-2">FEATURED</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-bold text-white">Latest Drops</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-neutral-300 hover:text-yellow-400 transition-colors" data-testid="view-all-link">
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group" data-testid={`featured-product-${product.id}`}>
              <div className="relative overflow-hidden bg-[#171717] aspect-[4/5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-bold text-base text-neutral-100">{product.name}</h3>
                <p className="text-yellow-400 font-bold text-lg">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-[#171717]" data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_rhythm-wear-2/artifacts/lbhhc7kd_m%2Ck.png"
                alt="Dhin Dha Pattern"
                className="w-full h-[500px] object-contain bg-black p-8"
              />
            </div>
            <div className="space-y-6">
              <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400">OUR MISSION</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-bold text-white">
                Supporting Tabla Artists
              </h2>
              <p className="text-base leading-relaxed text-neutral-300">
                We run a Tabla Recitation Channel dedicated to promoting artists, especially young and emerging tabla players. Our mission is to support and showcase talent through our platform.
              </p>
              <p className="text-base leading-relaxed text-neutral-300">
                Each piece we create celebrates the journey of mastery and the dedication to the art of tabla. When you wear Riyaz Tee, you're supporting the next generation of artists.
              </p>
              <Link to="/about">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-sm font-bold">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
