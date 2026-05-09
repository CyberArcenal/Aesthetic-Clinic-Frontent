// src/pages/public/contact/components/ContactForm.tsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { showSuccess, showError } from '@/utils/notification';
import { dialogs } from '@/utils/dialogs';
import contactMessageAPI from '@/api/core/contact_message';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Tawagin ang API (kung wala pang backend, gumamit ng mock)
      await contactMessageAPI.create(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      await dialogs.success('Thank you! Your message has been sent successfully.');
    } catch (err: any) {
      showError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            placeholder="Juan Dela Cruz"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            placeholder="juan@example.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            placeholder="Inquiry about treatments"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            placeholder="I would like to know more about..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto btn btn-primary py-2.5 px-6 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? 'Sending...' : <><Send size={16} /> Send Message</>}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;