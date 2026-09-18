'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Ticket,
  Sparkles,
  Image as ImageIcon,
  Map,
  UploadCloud,
  Layers,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { getEventStartingPrice } from '@/lib/pricing';

// Suggested quick features for Garba & venue
const SUGGESTED_FEATURES = [
  'AC VIP Dome',
  'Valet Parking Available',
  'Gourmet Food Stalls',
  'Celebrity Singer Lineup',
  'VIP Lounge Seating',
  'CCTV 24x7 & Security',
  'Separate Ladies Queue',
  'Pristine Lawn Ground',
  'Traditional Live Dhol Beats',
  'Monumental 50K Sound Setup'
];

// Suggested quick perks for pass categories
const SUGGESTED_PERKS = [
  'Fast Track VIP Entry',
  'Air-Cooled Lounge Access',
  'Front Stage View',
  '1 Couple Entry (He + She)',
  'Complimentary Refreshment',
  'Ground Entry Pass',
  'All 9 Nights Season Pass'
];

// Image Uploader Component supporting Cloudinary with RaasVerse folder hierarchy
function ImageUploaderField({
  label,
  value,
  onChange,
  hint,
  folderCategory = 'banners',
  isOptional = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Dedicated folder in RaasVerse
      formData.append('folder', folderCategory);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image to Cloudinary.');
      }

      onChange(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Image upload failed. You can paste a direct URL instead.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-gray-300 font-bold text-xs flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
            {label} {isOptional && <span className="text-gray-500 font-normal">(Optional)</span>}
          </label>
          <span className="text-[10px] text-gray-500 font-mono">
            Destination: RaasVerse/{folderCategory}/
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInputMode(inputMode === 'upload' ? 'url' : 'upload')}
          className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
        >
          {inputMode === 'upload' ? 'Switch to URL Link' : 'Switch to File Upload'}
        </button>
      </div>

      {inputMode === 'upload' ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              id={`upload-${folderCategory}-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <label
              htmlFor={`upload-${folderCategory}-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed cursor-pointer transition-all ${
                isUploading
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/20 hover:border-rose-500/60 hover:bg-white/10 text-gray-300'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  <span className="text-xs font-semibold">
                    Uploading to RaasVerse/{folderCategory}...
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold">
                    Upload to RaasVerse/{folderCategory}
                  </span>
                </>
              )}
            </label>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-600/20 text-gray-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                title="Remove Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {uploadError && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-rose-500 text-xs"
          />
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {value ? (
        <div className="flex items-center gap-3 pt-1">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
            <Image src={value} alt="Preview" fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-emerald-400 font-semibold block flex items-center gap-1">
              <Check className="w-3 h-3" /> Stored in RaasVerse/{folderCategory}
            </span>
            <span className="text-[10px] text-gray-400 truncate block font-mono">
              {value}
            </span>
          </div>
        </div>
      ) : (
        hint && <p className="text-[10px] text-gray-500">{hint}</p>
      )}
    </div>
  );
}

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
    features: ['AC VIP Dome', 'Valet Parking Available', 'Gourmet Food Stalls'],
    venueFeatures: ['Pristine Lawn Ground', 'Valet Parking Available', 'CCTV 24x7 Security'],
    dates: [
      {
        date: '11 Oct 2026',
        status: 'available',
        passes: [
          { name: 'General Admission', price: 799, perks: ['Ground Entry', 'Access to Food Stalls'] },
          { name: 'VIP Lounge Pass', price: 1499, perks: ['Fast Track VIP Entry', 'Air-Cooled Lounge Access'] }
        ]
      }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');

  // Multi-date clubbing tool state
  const [showClubbingTool, setShowClubbingTool] = useState(false);
  const [clubbingConfig, setClubbingConfig] = useState({
    datesText: '11 Oct 2026, 12 Oct 2026, 13 Oct 2026, 14 Oct 2026, 15 Oct 2026, 16 Oct 2026, 17 Oct 2026, 18 Oct 2026, 19 Oct 2026',
    status: 'available',
    passes: [
      { name: 'General Admission', price: 799, perks: ['Ground Entry'] },
      { name: 'VIP Lounge Pass', price: 1499, perks: ['VIP Fast Track Entry', 'Lounge Access'] },
      { name: 'Couple Pass', price: 1399, perks: ['1 Couple Entry (He + She)'] }
    ],
    mode: 'replace' // 'replace' | 'append'
  });

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
        features: Array.isArray(eventToEdit.features) && eventToEdit.features.length > 0
          ? eventToEdit.features
          : ['AC VIP Dome', 'Valet Parking Available', 'Gourmet Food Stalls'],
        venueFeatures: Array.isArray(eventToEdit.venueFeatures) && eventToEdit.venueFeatures.length > 0
          ? eventToEdit.venueFeatures
          : ['Pristine Lawn Ground', 'Valet Parking Available'],
        dates: eventToEdit.dates && Array.isArray(eventToEdit.dates) && eventToEdit.dates.length > 0
          ? JSON.parse(JSON.stringify(eventToEdit.dates))
          : [
              {
                date: '11 Oct 2026',
                status: 'available',
                passes: [{ name: 'General Admission', price: 799, perks: ['Ground Entry'] }]
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
        features: ['AC VIP Dome', 'Valet Parking Available', 'Gourmet Food Stalls'],
        venueFeatures: ['Pristine Lawn Ground', 'Valet Parking Available'],
        dates: [
          {
            date: '11 Oct 2026',
            status: 'available',
            passes: [
              { name: 'General Admission', price: 799, perks: ['Ground Entry'] },
              { name: 'VIP Lounge Pass', price: 1499, perks: ['VIP Fast Track Entry', 'Air-Cooled Lounge Access'] }
            ]
          }
        ]
      });
    }
    setError('');
    setShowClubbingTool(false);
    setCustomFeatureInput('');
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  // Compute live starting price from configured passes
  const computedStartingPrice = getEventStartingPrice({
    dates: formData.dates,
    price: formData.price
  });

  // Feature tag handlers
  const handleAddFeature = (featureToAdd) => {
    const clean = (featureToAdd || customFeatureInput).trim();
    if (!clean) return;
    if (!formData.features.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, clean]
      }));
    }
    setCustomFeatureInput('');
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== featureToRemove)
    }));
  };

  // Helpers for nested dates & passes
  const handleAddDate = () => {
    const nextNightNumber = formData.dates.length + 11;
    setFormData((prev) => ({
      ...prev,
      dates: [
        ...prev.dates,
        {
          date: `${nextNightNumber} Oct 2026`,
          status: 'available',
          passes: [
            {
              name: 'General Admission',
              price: computedStartingPrice || 799,
              perks: ['Ground Entry']
            }
          ]
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
        { name: 'VIP Pass', price: 1499, perks: ['VIP Fast Track'] }
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

  const handlePassPerksChange = (dateIdx, passIdx, perksString) => {
    const perks = perksString
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    setFormData((prev) => {
      const newDates = [...prev.dates];
      newDates[dateIdx].passes[passIdx] = {
        ...newDates[dateIdx].passes[passIdx],
        perks
      };
      return { ...prev, dates: newDates };
    });
  };

  // Duplicate passes from one date to all other dates
  const handleDuplicatePassesToAll = (sourceDateIdx) => {
    const sourcePasses = formData.dates[sourceDateIdx]?.passes || [];
    if (sourcePasses.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.map((d) => ({
        ...d,
        passes: JSON.parse(JSON.stringify(sourcePasses))
      }))
    }));
  };

  // Clubbing Tool Handlers
  const handleClubbingAddPass = () => {
    setClubbingConfig((prev) => ({
      ...prev,
      passes: [...prev.passes, { name: 'VIP Pass', price: 1499, perks: ['VIP Fast Track'] }]
    }));
  };

  const handleClubbingRemovePass = (index) => {
    setClubbingConfig((prev) => ({
      ...prev,
      passes: prev.passes.filter((_, i) => i !== index)
    }));
  };

  const handleClubbingPassChange = (index, field, value) => {
    setClubbingConfig((prev) => {
      const updated = [...prev.passes];
      updated[index] = {
        ...updated[index],
        [field]: field === 'price' ? Number(value) : value
      };
      return { ...prev, passes: updated };
    });
  };

  const handleApplyClubbedDates = () => {
    const dateEntries = clubbingConfig.datesText
      .split(/[,\n]+/)
      .map((d) => d.trim())
      .filter(Boolean);

    if (dateEntries.length === 0) {
      alert('Please enter at least one date.');
      return;
    }

    if (clubbingConfig.passes.length === 0) {
      alert('Please add at least one pass category for the clubbed dates.');
      return;
    }

    const generatedDates = dateEntries.map((dateStr) => ({
      date: dateStr,
      status: clubbingConfig.status || 'available',
      passes: JSON.parse(JSON.stringify(clubbingConfig.passes))
    }));

    setFormData((prev) => ({
      ...prev,
      dates:
        clubbingConfig.mode === 'append'
          ? [...prev.dates, ...generatedDates]
          : generatedDates
    }));

    setShowClubbingTool(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isEdit ? `/api/events/${eventToEdit.id}` : '/api/events';
      const method = isEdit ? 'PUT' : 'POST';

      const submissionData = {
        ...formData,
        price: computedStartingPrice
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
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
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0c0d14] border border-rose-900/40 shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>{isEdit ? 'Edit Garba Event' : 'Create New Garba Event'}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Manage event info, venue features, multi-date clubbing, and Cloudinary uploads.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
                1. Event Overview
              </h4>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                Starting Pass Rate: ₹{computedStartingPrice}
              </div>
            </div>

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
                <label className="text-gray-300 font-semibold">Date Range Summary</label>
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

          {/* 2. Features & Amenities for Venue / Event */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-rose-400" />
                2. Venue & Experience Features
              </h4>
              <span className="text-[11px] text-gray-400">
                {formData.features?.length || 0} features added
              </span>
            </div>

            {/* Feature Tags List */}
            <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl bg-black/50 border border-white/10">
              {formData.features && formData.features.length > 0 ? (
                formData.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-sm"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat)}
                      className="text-rose-400 hover:text-white"
                      title="Remove feature"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs italic">
                  No features added yet. Click suggestions below or type a custom feature.
                </span>
              )}
            </div>

            {/* Add Custom Feature */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customFeatureInput}
                onChange={(e) => setCustomFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Type custom feature (e.g. Separate Ladies Circle)..."
                className="flex-1 p-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => handleAddFeature()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                + Add Feature
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Quick Suggested Highlights:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_FEATURES.map((item, idx) => {
                  const isAdded = formData.features?.includes(item);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => (isAdded ? handleRemoveFeature(item) : handleAddFeature(item))}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      {isAdded ? `✓ ${item}` : `+ ${item}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Media Upload via Cloudinary (RaasVerse Folder Structure) */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-rose-400" />
              3. Media & Visuals (Direct Upload to RaasVerse Folders)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploaderField
                label="Event Banner Poster"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                hint="Uploaded into RaasVerse/banners/ folder in Cloudinary."
                folderCategory="banners"
              />

              <ImageUploaderField
                label="Ground Layout Map"
                value={formData.layoutImage}
                onChange={(url) => setFormData({ ...formData, layoutImage: url })}
                hint="Uploaded into RaasVerse/venues/ folder in Cloudinary."
                folderCategory="venues"
                isOptional
              />
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

          {/* 4. Dates & Pass Configuration with Multi-Date Clubbing & Perks */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  4. Dates, Passes & Pass Features
                </h4>
                <p className="text-[11px] text-gray-400">
                  Total {formData.dates.length} night(s) configured. Live lowest rate: ₹{computedStartingPrice}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Clubbing Tool */}
                <button
                  type="button"
                  onClick={() => setShowClubbingTool(!showClubbingTool)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showClubbingTool
                      ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-r from-amber-600/30 to-rose-600/30 hover:from-amber-600/50 hover:to-rose-600/50 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showClubbingTool ? 'Hide Club Tool' : '⚡ Club Multiple Dates'}</span>
                </button>

                {/* Add Single Date */}
                <button
                  type="button"
                  onClick={handleAddDate}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-400" />
                  <span>+ Single Date</span>
                </button>
              </div>
            </div>

            {/* Multi-Date Clubbing Tool Card */}
            {showClubbingTool && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-black/60 border-2 border-amber-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500 text-black">
                      <Layers className="w-4 h-4 font-black" />
                    </span>
                    <div>
                      <h5 className="font-extrabold text-white text-xs uppercase tracking-wide">
                        Bulk Date & Pass Clubber
                      </h5>
                      <p className="text-[11px] text-amber-300/80">
                        Club multiple dates at once and apply common pass categories in a single click!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowClubbingTool(false)}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setClubbingConfig({
                        ...clubbingConfig,
                        datesText:
                          '11 Oct 2026, 12 Oct 2026, 13 Oct 2026, 14 Oct 2026, 15 Oct 2026, 16 Oct 2026, 17 Oct 2026, 18 Oct 2026, 19 Oct 2026'
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-white/10 cursor-pointer"
                  >
                    🌟 All 9 Navratri Nights (11-19 Oct)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setClubbingConfig({
                        ...clubbingConfig,
                        datesText: '16 Oct 2026, 17 Oct 2026, 18 Oct 2026'
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-white/10 cursor-pointer"
                  >
                    🔥 Weekend Nights (16-18 Oct)
                  </button>
                </div>

                {/* Dates Text Input */}
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold text-xs flex justify-between">
                    <span>Dates to Club (comma or line separated):</span>
                    <span className="text-amber-400 font-mono text-[11px]">
                      {
                        clubbingConfig.datesText
                          .split(/[,\n]+/)
                          .map((s) => s.trim())
                          .filter(Boolean).length
                      }{' '}
                      date(s) detected
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={clubbingConfig.datesText}
                    onChange={(e) =>
                      setClubbingConfig({ ...clubbingConfig, datesText: e.target.value })
                    }
                    placeholder="e.g. 11 Oct 2026, 12 Oct 2026, 13 Oct 2026..."
                    className="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Shared Pass Categories for Clubbed Dates */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 font-bold text-xs">
                      Pass Categories & Perks to Apply Across All Clubbed Dates:
                    </label>
                    <button
                      type="button"
                      onClick={handleClubbingAddPass}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Category
                    </button>
                  </div>

                  <div className="space-y-2">
                    {clubbingConfig.passes.map((pass, pIdx) => (
                      <div key={pIdx} className="space-y-1.5 p-2.5 rounded-xl bg-black/70 border border-white/10">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pass.name}
                            onChange={(e) =>
                              handleClubbingPassChange(pIdx, 'name', e.target.value)
                            }
                            placeholder="Pass Name (e.g. General Admission)"
                            className="flex-1 p-2 rounded-lg bg-black/90 border border-white/10 text-white text-xs"
                          />
                          <div className="flex items-center gap-1 w-32">
                            <span className="text-amber-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={pass.price}
                              onChange={(e) =>
                                handleClubbingPassChange(pIdx, 'price', e.target.value)
                              }
                              placeholder="Price"
                              className="w-full p-2 rounded-lg bg-black/90 border border-white/10 text-white font-mono font-bold text-xs"
                            />
                          </div>
                          {clubbingConfig.passes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleClubbingRemovePass(pIdx)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Application Mode */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs">Status:</span>
                      <select
                        value={clubbingConfig.status}
                        onChange={(e) =>
                          setClubbingConfig({ ...clubbingConfig, status: e.target.value })
                        }
                        className="p-1.5 rounded-lg bg-black border border-white/10 text-white text-xs"
                      >
                        <option value="available">Available</option>
                        <option value="fast_filling">Fast Filling</option>
                        <option value="sold_out">Sold Out</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-xs">Mode:</span>
                      <select
                        value={clubbingConfig.mode}
                        onChange={(e) =>
                          setClubbingConfig({ ...clubbingConfig, mode: e.target.value })
                        }
                        className="p-1.5 rounded-lg bg-black border border-white/10 text-white text-xs"
                      >
                        <option value="replace">Replace All Existing Dates</option>
                        <option value="append">Append to Existing Dates</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyClubbedDates}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply & Create All Clubbed Dates</span>
                  </button>
                </div>
              </div>
            )}

            {/* Individual Date Listings (Fully customizable afterwards) */}
            <div className="space-y-3">
              {formData.dates.map((dateObj, dIdx) => (
                <div
                  key={dIdx}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={dateObj.date}
                        onChange={(e) => handleDateChange(dIdx, 'date', e.target.value)}
                        placeholder="e.g. 11 Oct 2026"
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-xs"
                      />
                      <select
                        value={dateObj.status}
                        onChange={(e) => handleDateChange(dIdx, 'status', e.target.value)}
                        className="p-2 rounded-lg bg-black border border-white/10 text-gray-300 text-xs"
                      >
                        <option value="available">Status: Available</option>
                        <option value="fast_filling">Status: Fast Filling</option>
                        <option value="sold_out">Status: Sold Out</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Copy passes from this date to all dates */}
                      <button
                        type="button"
                        onClick={() => handleDuplicatePassesToAll(dIdx)}
                        className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Copy this date's passes to all other dates"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {formData.dates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(dIdx)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-600/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Date"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pass Tiers for this Date */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-300">
                        Pass Categories & Pricing (Editable for this night):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddPass(dIdx)}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Pass Tier
                      </button>
                    </div>

                    {dateObj.passes?.map((pass, pIdx) => (
                      <div key={pIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pass.name}
                            onChange={(e) => handlePassChange(dIdx, pIdx, 'name', e.target.value)}
                            placeholder="Pass Name (e.g. VIP Pass)"
                            className="flex-1 p-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                          />
                          <div className="flex items-center gap-1 w-32">
                            <span className="text-gray-400">₹</span>
                            <input
                              type="number"
                              value={pass.price}
                              onChange={(e) => handlePassChange(dIdx, pIdx, 'price', e.target.value)}
                              placeholder="Price"
                              className="w-full p-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs"
                            />
                          </div>
                          {dateObj.passes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePass(dIdx, pIdx)}
                              className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Pass Perks / Features */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                            Perks:
                          </span>
                          <input
                            type="text"
                            value={Array.isArray(pass.perks) ? pass.perks.join(', ') : ''}
                            onChange={(e) =>
                              handlePassPerksChange(dIdx, pIdx, e.target.value)
                            }
                            placeholder="e.g. Fast Track Entry, Lounge Access (comma separated)"
                            className="w-full p-1.5 rounded-lg bg-black/40 border border-white/10 text-gray-300 text-[11px] focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-gray-400 text-xs">
              <span className="text-white font-bold">{formData.dates.length}</span> date(s) • Starting at{' '}
              <span className="text-amber-400 font-bold font-mono">₹{computedStartingPrice}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl btn-primary-glow font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving Event...' : isEdit ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
