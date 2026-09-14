'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Ticket, Sparkles, Image as ImageIcon, Map } from 'lucide-react';

export default function EventFormModal({ isOpen, onClose, onSave, eventToEdit = null }) {
  const isEdit = Boolean(eventToEdit);

  const [formData, setFormData] = useState({
    title: '',
    festival: 'Navratri 2026',
    city: 'Ahmedabad',
    location: '',
    venue: '',
    badge: 'Trending',
    trending: true,
    order: 1,
    price: 799,
    dateRange: '11 Oct - 19 Oct 2026',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
    layoutImage: '',
    description: '',
    dates: [
      {
        date: '11 Oct 2026',
        status: 'available',
        passes: [
          { name: 'General Admission', price: 799 },
          { name: 'VIP Lounge', price: 1499 }
        ]
      }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        festival: eventToEdit.festival || 'Navratri 2026',
        city: eventToEdit.city || 'Ahmedabad',
        location: eventToEdit.location || '',
        venue: eventToEdit.venue || '',
        badge: eventToEdit.badge || '',
        trending: Boolean(eventToEdit.trending),
        order: Number(eventToEdit.order) || 1,
        price: Number(eventToEdit.price) || 799,
        dateRange: eventToEdit.dateRange || '',
        image: eventToEdit.image || '',
        layoutImage: eventToEdit.layoutImage || '',
        description: eventToEdit.description || '',
        dates: eventToEdit.dates && Array.isArray(eventToEdit.dates) && eventToEdit.dates.length > 0
          ? JSON.parse(JSON.stringify(eventToEdit.dates))
          : [
              {
                date: '11 Oct 2026',
                status: 'available',
                passes: [{ name: 'General Admission', price: 799 }]
              }
            ]
      });
    } else {
      // Reset for new event
      setFormData({
        title: '',
        festival: 'Navratri 2026',
        city: 'Ahmedabad',
        location: '',
        venue: '',
        badge: 'Trending',
        trending: true,
        order: 1,
        price: 799,
        dateRange: '11 Oct - 19 Oct 2026',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
        layoutImage: '',
        description: '',
        dates: [
          {
            date: '11 Oct 2026',
            status: 'available',
            passes: [
              { name: 'General Admission', price: 799 },
              { name: 'VIP Lounge', price: 1499 }
            ]
          }
        ]
      });
    }
    setError('');
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  // Helpers for nested dates & passes
  const handleAddDate = () => {
    setFormData((prev) => ({
      ...prev,
      dates: [
        ...prev.dates,
        {
          date: `12 Oct 2026`,
          status: 'available',
          passes: [{ name: 'General Admission', price: 799 }]
        }
      ]
    }));
  };

  const handleRemoveDate = (dateIdx) => {
    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.filter((_, idx) => idx !== dateIdx)
    }));
  };

  const handleDateChange = (dateIdx, field, value) => {
    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[dateIdx] = { ...newDates[dateIdx], [field]: value };
      return { ...prev, dates: newDates };
    });
  };

  const handleAddPass = (dateIdx) => {
    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[dateIdx].passes = [
        ...(newDates[dateIdx].passes || []),
        { name: 'VIP Pass', price: 1499 }
      ];
      return { ...prev, dates: newDates };
    });
  };

  const handleRemovePass = (dateIdx, passIdx) => {
    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[dateIdx].passes = newDates[dateIdx].passes.filter((_, idx) => idx !== passIdx);
      return { ...prev, dates: newDates };
    });
  };

  const handlePassChange = (dateIdx, passIdx, field, value) => {
    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[dateIdx].passes[passIdx] = {
        ...newDates[dateIdx].passes[passIdx],
        [field]: field === 'price' ? Number(value) : value
      };
      return { ...prev, dates: newDates };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/events/${eventToEdit.id}` : '/api/events';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save event');
      }

      onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c0d14] border border-rose-900/40 shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>{isEdit ? 'Edit Garba Event' : 'Create New Garba Event'}</span>
            </h3>
            <p className="text-xs text-gray-400">Manage event information, dates, pricing tiers and ground layouts.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* 1. Basic Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">1. Event Overview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mandalam Garba 2026"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Festival Tag</label>
                <input
                  type="text"
                  value={formData.festival}
                  onChange={(e) => setFormData({ ...formData, festival: e.target.value })}
                  placeholder="e.g. Navratri 2026"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Ahmedabad"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Location / Area</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. VIP Road, South Bopal"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Ground / Venue Name</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Mandalam Heritage Grounds"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Badge (Card Tag)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Trending, Exclusive, Selling Fast"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Date Range Text</label>
                <input
                  type="text"
                  value={formData.dateRange}
                  onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                  placeholder="e.g. 11 Oct - 19 Oct 2026"
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Display Order Priority (1 = Highest)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Trending Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="trendingToggle"
                checked={formData.trending}
                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
              />
              <label htmlFor="trendingToggle" className="text-white font-bold cursor-pointer">
                Mark as Featured / Trending (Displays on Home Page Trending Section)
              </label>
            </div>
          </div>

          {/* 2. Media Links */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rose-400" />
              2. Media & Visuals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Event Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Venue Layout Map URL (Optional)</label>
                <input
                  type="url"
                  value={formData.layoutImage}
                  onChange={(e) => setFormData({ ...formData, layoutImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of singer lineup, ground amenities..."
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          {/* 3. Dates & Passes Configuration */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                3. Dates & Pass Categories
              </h4>
              <button
                type="button"
                onClick={handleAddDate}
                className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 border border-rose-500/40 text-white font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Date</span>
              </button>
            </div>

            {formData.dates.map((dateObj, dIdx) => (
              <div key={dIdx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={dateObj.date}
                      onChange={(e) => handleDateChange(dIdx, 'date', e.target.value)}
                      placeholder="e.g. 11 Oct 2026"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold"
                    />
                    <select
                      value={dateObj.status}
                      onChange={(e) => handleDateChange(dIdx, 'status', e.target.value)}
                      className="p-2 rounded-lg bg-black border border-white/10 text-gray-300"
                    >
                      <option value="available">Status: Available</option>
                      <option value="fast_filling">Status: Fast Filling</option>
                      <option value="sold_out">Status: Sold Out</option>
                    </select>
                  </div>

                  {formData.dates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(dIdx)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-600/20 rounded-lg transition-colors"
                      title="Delete Date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Pass Tiers for this Date */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span className="font-semibold text-gray-300">Pass Categories & Pricing:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPass(dIdx)}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" /> Add Pass Tier
                    </button>
                  </div>

                  {dateObj.passes?.map((pass, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pass.name}
                        onChange={(e) => handlePassChange(dIdx, pIdx, 'name', e.target.value)}
                        placeholder="Pass Name (e.g. VIP Pass)"
                        className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                      <div className="flex items-center gap-1 w-32">
                        <span className="text-gray-400">₹</span>
                        <input
                          type="number"
                          value={pass.price}
                          onChange={(e) => handlePassChange(dIdx, pIdx, 'price', e.target.value)}
                          placeholder="Price"
                          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>
                      {dateObj.passes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePass(dIdx, pIdx)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl btn-primary-glow font-bold text-white shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving Event...' : isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
