import React from 'react';
import { Youtube, Facebook, Instagram } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-4">ABOUT US</div>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-6">
            Recitation of Tabla Channel
          </h1>
          <p className="text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Dedicated to promoting and supporting young and emerging tabla artists worldwide
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#171717] p-8 md:p-12 rounded-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
          <div className="space-y-4 text-neutral-300 leading-relaxed">
            <p className="text-lg">
              We run a <strong className="text-white">youtube channel</strong> with a clear and passionate mission:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                <span><strong className="text-white">Promote Artists:</strong> We showcase talented tabla players, giving them a platform to reach a global audience.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                <span><strong className="text-white">Support Young Talent:</strong> We focus especially on young and emerging tabla artists, helping them gain recognition and grow their careers.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                <span><strong className="text-white">Showcase Excellence:</strong> Through our channel and merchandise, we celebrate the dedication, skill, and artistry of tabla players.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What We Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#171717] p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Recitation of Tabla Channel</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Our YouTube channel features performances, tutorials, and recitations from talented tabla artists around the world. We provide a space for artists to share their craft and connect with audiences who appreciate the beauty of tabla.
            </p>
            <a 
              href="https://www.youtube.com/c/Recitationoftabla" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <button className="btn-gradient px-6 py-3">
                <Youtube className="w-5 h-5 mr-2 inline" />
                Visit Our Channel
              </button>
            </a>
          </div>

          <div className="bg-[#171717] p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Riyaz Tee Merchandise</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Our merchandise line celebrates the art of tabla and the dedication of practice (Riyaz). Every purchase supports our mission to promote emerging artists and keep the tradition of tabla alive for future generations.
            </p>
            <p className="text-sm text-neutral-400 italic">
              "Riyaz" means dedicated practice - the foundation of mastery.
            </p>
          </div>
        </div>

        {/* Follow Us */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Follow Our Journey</h2>
          <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
            Stay connected with us on social media to discover new artists, watch performances, and be part of our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://www.youtube.com/c/Recitationoftabla" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-[#171717] hover:bg-[#262626] px-6 py-3 rounded-full transition-colors"
            >
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="text-white font-bold">YouTube</span>
            </a>
            <a 
              href="https://www.facebook.com/recitationoftabla/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-[#171717] hover:bg-[#262626] px-6 py-3 rounded-full transition-colors"
            >
              <Facebook className="w-5 h-5 text-blue-500" />
              <span className="text-white font-bold">Facebook</span>
            </a>
            <a 
              href="https://www.instagram.com/recitation_of_tabla/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-[#171717] hover:bg-[#262626] px-6 py-3 rounded-full transition-colors"
            >
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="text-white font-bold">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
