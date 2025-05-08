'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Hero {
  professionTitle: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export default function EditHero() {
  const [hero, setHero] = useState<Hero>({
    professionTitle: '',
    heading: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch('/api/content/hero');
        if (response.ok) {
          const data = await response.json();
          setHero(data);
          setPreviewUrl(data.image);
        } else {
          setMessage({ text: 'Failed to load hero data', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error loading hero data', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // If there's a new image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the hero with the new image path
          setHero((prev) => ({ ...prev, image: uploadData.filePath }));
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Save the hero data
      const updateResponse = await fetch('/api/content/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageFile ? { ...hero, image: hero.image } : hero),
      });

      if (updateResponse.ok) {
        setMessage({ text: 'Hero section updated successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update hero section', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating hero section', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Hero Section</h1>

      {message.text && (
        <div
          className={`mb-4 rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="professionTitle" className="block text-sm font-medium text-gray-700">
            Professional Title
          </label>
          <input
            type="text"
            id="professionTitle"
            name="professionTitle"
            value={hero.professionTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            This appears at the top of your hero section (e.g., "AI & AUTOMATION EXPERT | SENIOR MANAGER AT DELOITTE DIGITAL")
          </p>
        </div>

        <div>
          <label htmlFor="heading" className="block text-sm font-medium text-gray-700">
            Heading
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={hero.heading}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={hero.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
              CTA Button Text
            </label>
            <input
              type="text"
              id="ctaText"
              name="ctaText"
              value={hero.ctaText}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">
              CTA Button Link
            </label>
            <input
              type="text"
              id="ctaLink"
              name="ctaLink"
              value={hero.ctaLink}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          
          <div className="mt-2 flex items-center">
            {previewUrl && (
              <div className="relative mr-4 h-32 w-32 overflow-hidden rounded-md border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <label className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {previewUrl ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 