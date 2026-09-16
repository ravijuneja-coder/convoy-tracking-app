'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';

interface SiteSettings {
  siteName: string;
  tagline: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  contactEmail: string;
  footerText: string;
  googleAnalyticsId: string;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Akhand Bhakti Sagar',
  tagline: 'अखण्ड भक्ति सागर — Ocean of Devotion',
  youtubeUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  contactEmail: '',
  footerText: '',
  googleAnalyticsId: '',
  defaultSeoTitle: '',
  defaultMetaDescription: '',
};

const sections = [
  {
    title: 'Site Identity',
    fields: [
      { key: 'siteName', label: 'Site Name', type: 'text', placeholder: 'Akhand Bhakti Sagar' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'A tagline for your site' },
      { key: 'contactEmail', label: 'Contact Email', type: 'email', placeholder: 'contact@example.com' },
    ],
  },
  {
    title: 'Social Media',
    fields: [
      { key: 'youtubeUrl', label: 'YouTube Channel URL', type: 'url', placeholder: 'https://youtube.com/@...' },
      { key: 'facebookUrl', label: 'Facebook Page URL', type: 'url', placeholder: 'https://facebook.com/...' },
      { key: 'instagramUrl', label: 'Instagram Profile URL', type: 'url', placeholder: 'https://instagram.com/...' },
    ],
  },
  {
    title: 'Footer',
    fields: [
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: '© 2024 Akhand Bhakti Sagar. All rights reserved.' },
    ],
  },
  {
    title: 'Analytics & SEO',
    fields: [
      { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
      { key: 'defaultSeoTitle', label: 'Default SEO Title', type: 'text', placeholder: 'Akhand Bhakti Sagar — Devotional Content' },
    ],
  },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings({ ...defaultSettings, ...data }); })
      .finally(() => setIsLoading(false));
  }, []);

  const set = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      addToast('Settings saved successfully', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your site settings</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-9 bg-gray-100 rounded" />
              <div className="h-9 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {sections.map(section => (
            <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{section.title}</h2>
              {section.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={settings[field.key as keyof SiteSettings]}
                    onChange={e => set(field.key as keyof SiteSettings, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Default Meta Description</h2>
            <textarea
              rows={3}
              value={settings.defaultMetaDescription}
              onChange={e => set('defaultMetaDescription', e.target.value)}
              placeholder="Default description for pages that don't have a custom one..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-saffron-500 text-white rounded-lg font-medium hover:bg-saffron-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Settings
            </button>
          </div>
        </>
      )}
    </div>
  );
}
