import React, { useState } from 'react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    subject: 'General',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    // Here you would typically send the data to your backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-gray-800 dark:bg-black/40 p-8 rounded-2xl border border-teal-600 dark:border-obsidian-border shadow-2xl max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#ffc300] mb-2">Thank You!</h2>
          <p className="text-gray-300">Your feedback has been received. We appreciate your input to make our project better.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-6 bg-[#ffc300] text-black font-bold px-6 py-2 rounded-full hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-gray-800 dark:bg-black/40 p-8 rounded-2xl border border-teal-600 dark:border-obsidian-border shadow-2xl">
        <h2 className="text-3xl font-bold text-[#ffc300] mb-6">Feedback</h2>
        <p className="text-gray-400 mb-8">Have a suggestion or found a bug? Let us know!</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-900/50 dark:bg-obsidian-bg border border-teal-700 dark:border-obsidian-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#ffc300] transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="bg-gray-900/50 dark:bg-obsidian-bg border border-teal-700 dark:border-obsidian-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#ffc300] transition-colors appearance-none cursor-pointer"
            >
              <option value="General">General Feedback</option>
              <option value="Bug">Bug Report</option>
              <option value="Feature">Feature Request</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300 ml-1">Message</label>
            <textarea
              name="message"
              required
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="bg-gray-900/50 dark:bg-obsidian-bg border border-teal-700 dark:border-obsidian-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#ffc300] transition-colors resize-none"
              placeholder="Tell us what's on your mind..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffc300] text-black font-bold py-3 rounded-xl hover:bg-amber-300 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
