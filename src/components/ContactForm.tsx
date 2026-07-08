import React, { useState, useEffect } from "react";
import { Mail, Send, CheckCircle2, Inbox, Trash2, Calendar } from "lucide-react";
import { ContactInquiry } from "../types";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [inbox, setInbox] = useState<ContactInquiry[]>([]);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = () => {
    const stored = localStorage.getItem("workspace_inbox");
    if (stored) {
      try {
        setInbox(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Save submission locally
    const newInquiry: ContactInquiry = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toLocaleString(),
    };

    const updated = [newInquiry, ...inbox].slice(0, 5); // Save last 5 submissions
    setInbox(updated);
    localStorage.setItem("workspace_inbox", JSON.stringify(updated));

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const clearInbox = () => {
    setInbox([]);
    localStorage.removeItem("workspace_inbox");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm transition">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-50">
            Interactive Contact Portal
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Contact Form Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 justify-center">
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full text-xs bg-zinc-50 dark:bg-zinc-900 border ${
                errors.name ? "border-rose-500" : "border-zinc-100 dark:border-zinc-800"
              } rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Alice"
            />
            {errors.name && <span className="text-[10px] text-rose-500 font-mono mt-0.5">{errors.name}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Your Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full text-xs bg-zinc-50 dark:bg-zinc-900 border ${
                errors.email ? "border-rose-500" : "border-zinc-100 dark:border-zinc-800"
              } rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="alice@example.com"
            />
            {errors.email && <span className="text-[10px] text-rose-500 font-mono mt-0.5">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full text-xs bg-zinc-50 dark:bg-zinc-900 border ${
                errors.subject ? "border-rose-500" : "border-zinc-100 dark:border-zinc-800"
              } rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              placeholder="Partnership Proposal"
            />
            {errors.subject && <span className="text-[10px] text-rose-500 font-mono mt-0.5">{errors.subject}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className={`w-full text-xs bg-zinc-50 dark:bg-zinc-900 border ${
                errors.message ? "border-rose-500" : "border-zinc-100 dark:border-zinc-800"
              } rounded-lg px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none`}
              placeholder="Write your note here..."
            />
            {errors.message && <span className="text-[10px] text-rose-500 font-mono mt-0.5">{errors.message}</span>}
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inquiry saved to Workspace Inbox successfully!</span>
            </div>
          )}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm mt-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>

        {/* Workspace Inbox Simulator */}
        <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 rounded-xl p-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
            <span className="text-xs font-mono font-medium text-zinc-500 flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-zinc-400" /> Workspace Inbox ({inbox.length})
            </span>
            {inbox.length > 0 && (
              <button
                onClick={clearInbox}
                className="text-[10px] font-mono text-rose-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear inbox
              </button>
            )}
          </div>

          {inbox.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Inbox className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-[11px] font-mono text-zinc-400">
                Inquiries sent from the form will appear here dynamically.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[220px]">
              {inbox.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-3 rounded-lg text-left shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{inq.name}</span>
                    <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> {inq.timestamp.split(",")[1]?.trim() || inq.timestamp}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-indigo-500 font-medium mt-0.5">{inq.subject}</div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-normal italic">
                    "{inq.message}"
                  </p>
                  <div className="text-[9px] text-zinc-400 mt-1">{inq.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
