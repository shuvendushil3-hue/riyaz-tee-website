import React, { useState } from 'react';
import { MessageCircle, Youtube, Facebook, Instagram, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm ${formData.name || 'interested customer'}.\n\n${formData.message || 'I would like to know more about Riyaz Tee.'}`;
    const whatsappUrl = `https://wa.me/918509643203?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleWhatsApp();
    toast.success('Opening WhatsApp to send your message!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.2em] uppercase font-bold text-yellow-400 mb-4">GET IN TOUCH</div>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-black text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Have questions? Want to collaborate? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#171717] p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-neutral-300 font-bold">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-xl"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-neutral-300 font-bold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-xl"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-neutral-300 font-bold">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-xl"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-neutral-300 font-bold">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-yellow-400 rounded-xl"
                  placeholder="Tell us more..."
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-gradient-green w-full py-4"
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                SEND VIA WHATSAPP
              </button>
              <p className="text-xs text-center text-neutral-500">Your message will open in WhatsApp</p>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-[#171717] p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Quick Contact</h3>
              <div className="space-y-4">
                <a 
                  href="mailto:shuvendushil3@gmail.com" 
                  className="flex items-center space-x-3 text-neutral-300 hover:text-yellow-400 transition-colors group"
                >
                  <div className="p-3 bg-[#0a0a0a] rounded-xl group-hover:bg-[#262626] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Email</p>
                    <p className="font-bold">shuvendushil3@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-[#171717] p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Follow Us on Social Media</h3>
              <div className="space-y-4">
                <a 
                  href="https://www.youtube.com/c/Recitationoftabla" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-neutral-300 hover:text-yellow-400 transition-colors group"
                >
                  <div className="p-3 bg-[#0a0a0a] rounded-xl group-hover:bg-[#262626] transition-colors">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold">Recitation of Tabla</p>
                    <p className="text-sm text-neutral-500">YouTube Channel</p>
                  </div>
                </a>

                <a 
                  href="https://www.facebook.com/recitationoftabla/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-neutral-300 hover:text-yellow-400 transition-colors group"
                >
                  <div className="p-3 bg-[#0a0a0a] rounded-xl group-hover:bg-[#262626] transition-colors">
                    <Facebook className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold">@recitationoftabla</p>
                    <p className="text-sm text-neutral-500">Facebook Page</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/recitation_of_tabla/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-neutral-300 hover:text-yellow-400 transition-colors group"
                >
                  <div className="p-3 bg-[#0a0a0a] rounded-xl group-hover:bg-[#262626] transition-colors">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-bold">@recitation_of_tabla</p>
                    <p className="text-sm text-neutral-500">Instagram</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
              <p className="text-neutral-300">
                We typically respond within 24 hours on WhatsApp and email. For urgent inquiries, please contact us via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
