import React, { useState } from 'react';
import { X, Calendar, Clock, Check, Sparkles, User, Mail, MessageSquare, Phone, ArrowUpRight } from 'lucide-react';
import { playChimeSound } from '../utils/audio';
import { getSessionBookingWhatsAppUrl } from '../utils/whatsapp';

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-04');
  const [selectedTime, setSelectedTime] = useState('11:00 AM EST');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Love & Relationship Crossroads');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Thu, Oct 2', value: '2026-10-02' },
    { label: 'Sat, Oct 4', value: '2026-10-04' },
    { label: 'Tue, Oct 7', value: '2026-10-07' },
    { label: 'Thu, Oct 9', value: '2026-10-09' }
  ];

  const times = ['10:00 AM EST', '11:30 AM EST', '2:00 PM EST', '4:30 PM EST'];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    playChimeSound();
    const whatsappUrl = getSessionBookingWhatsAppUrl({
      name,
      email,
      phone,
      date: selectedDate,
      time: selectedTime,
      topic,
    });
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm animate-in fade-in duration-200" role="presentation" onClick={onClose}>
      <div
        className="premium-float relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#C4A484]/40 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close booking dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] font-semibold block mb-1">
                Private Consultation
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
                Book 1:1 Session with Neha Arora
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/70 font-light mt-1">
                A 60-minute private guidance session. Choose your preferred slot, share your details, and we&apos;ll confirm everything with you personally on WhatsApp.
              </p>
              <div className="premium-line mt-5 h-px w-full" />
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#8E8271] font-medium block mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`py-2 px-3 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedDate === d.value
                          ? 'bg-[#1A1A1A] text-[#F5F1EB] border-[#1A1A1A]'
                          : 'bg-[#FCFAF7] border-[#E6E0D6] text-[#1A1A1A] hover:border-[#A98765]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#8E8271] font-medium block mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 px-3 rounded text-xs font-mono border text-center transition-all cursor-pointer ${
                        selectedTime === t
                          ? 'bg-[#1A1A1A] text-[#F5F1EB] border-[#1A1A1A]'
                          : 'bg-[#FCFAF7] border-[#E6E0D6] text-[#1A1A1A] hover:border-[#A98765]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name, email & phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#8E8271] block mb-1">Your Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Althea Thorne"
                      className="w-full px-3.5 py-2.5 rounded bg-[#FCFAF7] border border-[#E6E0D6] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A98765]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#8E8271] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded bg-[#FCFAF7] border border-[#E6E0D6] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A98765]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E8271] block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded bg-[#FCFAF7] border border-[#E6E0D6] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A98765]"
                  />
                </div>
              </div>

              {/* Focus Topic */}
              <div>
                <label className="text-xs text-[#8E8271] block mb-1">Primary Life Inquiry</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-[#FCFAF7] border border-[#E6E0D6] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A98765]"
                >
                  <option value="Love & Relationship Crossroads">Love & Relationship Crossroads</option>
                  <option value="Career & Sacred Purpose Architecture">Career & Sacred Purpose Architecture</option>
                  <option value="Spiritual Awakening & Kundalini Shifts">Spiritual Awakening & Subconscious Blocks</option>
                  <option value="Annual Solar Return / Birthday Forecast">Annual Forecast / Solar Return</option>
                </select>
              </div>

              {/* Price & Submit */}
              <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8271] block">Session Fee</span>
                  <span className="font-mono text-xl font-medium text-[#1A1A1A] tabular-nums">₹12,500</span>
                </div>

                <button
                  type="submit"
                  className="premium-glow inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-[#F5F1EB] text-xs uppercase tracking-widest hover:bg-[#A98765] transition-all duration-300 rounded-sm cursor-pointer"
                >
                  Send Booking on WhatsApp
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-[#1C1A18] text-[#C4A484] flex items-center justify-center mx-auto border border-[#C4A484]/40">
              <Check className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98765] font-semibold block">
                Appointment Confirmed
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
                We Look Forward to Welcoming You
              </h3>
              <p className="text-xs text-[#8E8271] max-w-md mx-auto leading-relaxed">
                Your request has been opened in WhatsApp. We&apos;ll confirm availability, payment, and the final session details with you personally.
              </p>
            </div>

            <div className="p-4 bg-[#F5F1EB] rounded-lg max-w-sm mx-auto text-left text-xs space-y-1.5 border border-[#E6E0D6]">
              <div className="flex justify-between">
                <span className="text-[#8E8271]">Client:</span>
                <span className="font-medium text-[#1A1A1A]">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8271]">Guide:</span>
                <span className="font-medium text-[#1A1A1A]">Neha Arora</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8271]">Focus:</span>
                <span className="font-medium text-[#1A1A1A]">{topic}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#F5F1EB] transition-colors rounded-sm cursor-pointer"
            >
              Return to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
