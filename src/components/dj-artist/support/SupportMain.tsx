"use client";

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Book,
  ChevronDown,
  ChevronRight,
  Music,
  Headphones,
  Send,
  CheckCircle2,
  Volume2,
  FileText,
  ExternalLink,
  Search,
  Mic2,
} from 'lucide-react';
import Footer from '../overview/Footer';

const faqs = [
  {
    id: '1',
    question: 'How do I upload a performance project to my gallery?',
    answer:
      'Navigate to the Gallery tab from the sidebar and click "UPLOAD PROJECT". You can add high-res performance stills, fill in the project title, event type, set duration, primary genre, and services delivered, then publish to your gallery.',
  },
  {
    id: '2',
    question: 'Can I update my setlist or client notes after confirming a booking?',
    answer:
      'Yes. Open any booking from Events & Bookings and click "UPDATE STATUS". You can add or edit the shoot day checklist tasks, client notes, and change the booking status. Clients are notified of any date or time changes automatically.',
  },
  {
    id: '3',
    question: 'How do I share a mix or promotional reel with a client?',
    answer:
      'From the booking detail page, use the "MESSAGE CLIENT" button to send a direct link. You can paste SoundCloud, Mixcloud, or Google Drive links. For public showreel sharing, upload a project to the gallery and toggle Client Privacy off.',
  },
  {
    id: '4',
    question: 'What equipment and lighting packages can I list in my profile?',
    answer:
      'From your Settings page, you can update your full equipment list including sound systems (brand & model), lighting rigs (intelligent, LED wash, moving heads), and additional services (MC hosting, same-day mix). These appear on your public profile.',
  },
  {
    id: '5',
    question: 'How does the rating system work?',
    answer:
      'Clients rate your performance out of 5 stars after event completion. A minimum of 3 completed bookings are required before your average appears publicly. You can respond to all reviews from the Ratings tab in your sidebar.',
  },
  {
    id: '6',
    question: 'How and when do I get paid after completing a booking?',
    answer:
      'Once you update a booking status to COMPLETED, the platform admin is notified and initiates payment within 2–3 business days as per your agreed contract schedule. You can track payment status from the Bookings page.',
  },
];

const guides = [
  { icon: <Music size={20} />, title: 'Getting Started as a DJ Artist', desc: 'Profile setup, first booking, and portfolio tips.' },
  { icon: <Headphones size={20} />, title: 'Gallery & Performance Management', desc: 'Upload, curate, and showcase your best work.' },
  { icon: <Mic2 size={20} />, title: 'Booking Workflow & Client Communication', desc: 'From enquiry to final payment — the full lifecycle.' },
  { icon: <FileText size={20} />, title: 'Invoicing & Payments', desc: 'Understanding your payment schedule and invoicing.' },
];

const SupportMain = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setForm({ subject: '', message: '' });
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="mb-10 mt-4">
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
            <span>DJ ARTIST</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#7C6A2E]">SUPPORT</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Help & Support
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Find answers, browse guides, or send us a message and our crew will respond within one business day.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Headphones size={18} />, title: 'Live Chat', desc: 'Available Mon–Fri, 9:00 AM – 6:00 PM GMT. Talk to our team.', cta: 'START CHAT →' },
            { icon: <MessageSquare size={18} />, title: 'Email Support', desc: 'Send a detailed message and we\'ll respond within 1 business day.', cta: 'SEND EMAIL →' },
            { icon: <Book size={18} />, title: 'Knowledge Base', desc: 'Explore our full documentation library with step-by-step guides.', cta: 'BROWSE DOCS' },
          ].map(card => (
            <div key={card.title} className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col items-start gap-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#B08D2C]">
                {card.icon}
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
              <button className="mt-auto text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase border-b border-[#7C6A2E] hover:text-[#9B7A20] transition-colors flex items-center gap-1">
                {card.cta} {card.cta.includes('DOCS') && <ExternalLink size={10} />}
              </button>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 mb-12">

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle size={22} className="text-[#B08D2C]" />
              Frequently Asked Questions
            </h2>

            <div className="relative mb-6">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
              />
            </div>

            <div className="space-y-3">
              {filteredFaqs.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-8">No matching questions found.</p>
              )}
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="bg-white border border-[#E0D8C3] shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FAF6EE] transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-800 pr-4 leading-snug">{faq.question}</span>
                    {openFaq === faq.id
                      ? <ChevronDown size={16} className="text-[#B08D2C] shrink-0" />
                      : <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    }
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5 border-t border-[#F0EBE1]">
                      <p className="text-xs text-gray-600 leading-relaxed mt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Form */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Send size={20} className="text-[#B08D2C]" />
              Send a Message
            </h2>

            {messageSent ? (
              <div className="bg-[#EAF4EC] border border-[#D8EBD9] p-6 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-[#2E7A3E] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#2E7A3E]">Message Sent!</p>
                  <p className="text-xs text-gray-600 mt-0.5">Our support team will respond within 1 business day.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="bg-white border border-[#E0D8C3] p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                    required
                  >
                    <option value="">Select a topic...</option>
                    <option>Booking Issue</option>
                    <option>Payment & Invoicing</option>
                    <option>Gallery / Portfolio Upload</option>
                    <option>Equipment & Profile Settings</option>
                    <option>Technical Bug Report</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Your Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your issue or question in detail..."
                    rows={6}
                    required
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] leading-relaxed resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#B08D2C] hover:bg-[#9B7A20] text-white py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  SEND MESSAGE
                </button>
              </form>
            )}

            {/* Quick Guides */}
            <div className="mt-8">
              <h3 className="text-sm font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Book size={16} className="text-[#B08D2C]" />
                Quick Guides
              </h3>
              <div className="space-y-3">
                {guides.map(guide => (
                  <button
                    key={guide.title}
                    className="w-full flex items-center gap-4 p-4 bg-white border border-[#E0D8C3] shadow-sm hover:bg-[#FAF6EE] hover:border-[#B08D2C] transition-all text-left group"
                  >
                    <span className="text-[#B08D2C] shrink-0">{guide.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 group-hover:text-[#7C6A2E] transition-colors">{guide.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{guide.desc}</p>
                    </div>
                    <ExternalLink size={12} className="text-gray-300 group-hover:text-[#B08D2C] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupportMain;
