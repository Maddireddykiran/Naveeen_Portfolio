'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

interface AboutData {
  mainText: string;
  profileImage: string;
  jobTitle: string;
  closingText: string;
  expertiseItems: ExpertiseItem[];
}

const ICON_OPTIONS = [
  { value: 'FaRegLightbulb', label: 'Lightbulb' },
  { value: 'FaRobot', label: 'Robot/AI' },
  { value: 'FaLink', label: 'Link/Integration' },
  { value: 'FaBuilding', label: 'Building/Organization' },
  { value: 'FaCode', label: 'Code' },
  { value: 'FaServer', label: 'Server' },
  { value: 'FaDatabase', label: 'Database' },
  { value: 'FaChartLine', label: 'Analytics' }
];

export default function EditAbout() {
  const [about, setAbout] = useState<AboutData>({
    mainText: '',
    profileImage: '',
    jobTitle: '',
    closingText: '',
    expertiseItems: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<ExpertiseItem>({
    icon: '',
    title: '',
    description: ''
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const response = await fetch('/api/content/about');
        if (response.ok) {
          const data = await response.json();
          setAbout(data);
        } else {
          setMessage({ text: 'Failed to load about data', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error loading about data', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAbout(prev => ({ ...prev, [name]: value }));
  };

  const handleExpertiseItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!about.mainText) {
      setMessage({ text: 'Main text is required', type: 'error' });
      return;
    }

    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(about),
      });

      if (response.ok) {
        setMessage({ text: 'About section updated successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update about section', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating about section', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpertiseItem = () => {
    setIsAddingItem(true);
    setEditingItemIndex(null);
    setTempItem({
      icon: 'FaRegLightbulb',
      title: '',
      description: ''
    });
  };

  const handleEditExpertiseItem = (index: number) => {
    setEditingItemIndex(index);
    setTempItem(about.expertiseItems[index]);
    setIsAddingItem(false);
  };

  const handleDeleteExpertiseItem = (index: number) => {
    if (!confirm('Are you sure you want to delete this expertise item?')) {
      return;
    }

    const updatedItems = [...about.expertiseItems];
    updatedItems.splice(index, 1);
    setAbout({ ...about, expertiseItems: updatedItems });
    setMessage({ text: 'Expertise item deleted', type: 'success' });
  };

  const handleCancelExpertiseItem = () => {
    setEditingItemIndex(null);
    setIsAddingItem(false);
  };

  const handleSaveExpertiseItem = () => {
    if (!tempItem.title || !tempItem.description) {
      setMessage({ text: 'Title and description are required for expertise items', type: 'error' });
      return;
    }

    let updatedItems = [...about.expertiseItems];
    if (isAddingItem) {
      updatedItems.push(tempItem);
    } else if (editingItemIndex !== null) {
      updatedItems[editingItemIndex] = tempItem;
    }

    setAbout({ ...about, expertiseItems: updatedItems });
    setEditingItemIndex(null);
    setIsAddingItem(false);
    setMessage({ text: isAddingItem ? 'Expertise item added' : 'Expertise item updated', type: 'success' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: 'Image must be less than 2MB', type: 'error' });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please upload an image file', type: 'error' });
      return;
    }
    
    setUploading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAbout(prev => ({ ...prev, profileImage: data.filepath }));
          setMessage({ text: 'Image uploaded successfully', type: 'success' });
        } else {
          setMessage({ text: data.error || 'Failed to upload image', type: 'error' });
        }
      } else {
        setMessage({ text: 'Failed to upload image', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error uploading image', type: 'error' });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    if (confirm('Are you sure you want to remove this profile image?')) {
      setAbout(prev => ({ ...prev, profileImage: '' }));
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit About Me Section</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="mainText" className="block text-sm font-medium text-gray-700">
            Main Text
          </label>
          <textarea
            id="mainText"
            name="mainText"
            rows={5}
            value={about.mainText}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="Enter your main professional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          
          {about.profileImage ? (
            <div className="relative mb-4">
              <div className="relative h-48 w-48 overflow-hidden rounded-md border border-gray-200">
                <Image 
                  src={about.profileImage} 
                  alt="Profile preview" 
                  fill 
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{about.profileImage}</p>
            </div>
          ) : (
            <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
              <span className="text-sm text-gray-500">No image uploaded</span>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <span className="ml-2 text-xs text-gray-500">Max size: 2MB. Supported formats: JPG, PNG, GIF</span>
          </div>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={about.jobTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="Senior Manager at Deloitte Digital"
          />
        </div>

        <div>
          <label htmlFor="closingText" className="block text-sm font-medium text-gray-700">
            Closing Text
          </label>
          <textarea
            id="closingText"
            name="closingText"
            rows={3}
            value={about.closingText}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="Enter a closing paragraph about your strengths and approach"
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Expertise Items</h2>
            {!isAddingItem && editingItemIndex === null && (
              <button
                onClick={handleAddExpertiseItem}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Item
              </button>
            )}
          </div>

          {(isAddingItem || editingItemIndex !== null) ? (
            <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                {isAddingItem ? 'Add New Expertise Item' : 'Edit Expertise Item'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={tempItem.icon}
                    onChange={handleExpertiseItemChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    {ICON_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={tempItem.title}
                    onChange={handleExpertiseItemChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="Digital Transformation"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={tempItem.description}
                    onChange={handleExpertiseItemChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="Brief description of your expertise in this area"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelExpertiseItem}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveExpertiseItem}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {isAddingItem ? 'Add Item' : 'Update Item'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {about.expertiseItems.length === 0 ? (
                <p className="text-sm text-gray-500">No expertise items added yet. Click "Add Item" to create one.</p>
              ) : (
                about.expertiseItems.map((item, index) => (
                  <div key={index} className="flex items-start justify-between rounded-md border border-gray-200 bg-white p-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="inline-block rounded-md bg-indigo-100 p-2 text-indigo-700">
                          {item.icon}
                        </span>
                        <h4 className="ml-3 text-sm font-medium text-gray-900">{item.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="ml-4 flex">
                      <button
                        type="button"
                        onClick={() => handleEditExpertiseItem(index)}
                        className="mr-2 rounded-md bg-white px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpertiseItem(index)}
                        className="rounded-md bg-white px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 