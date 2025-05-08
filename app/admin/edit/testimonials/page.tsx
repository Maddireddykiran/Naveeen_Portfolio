'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export default function EditTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempTestimonial, setTempTestimonial] = useState<Testimonial>({
    quote: '',
    name: '',
    title: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/content/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          setMessage({ text: 'Failed to load testimonials data', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error loading testimonials data', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setTempTestimonial(testimonials[index]);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setTempTestimonial({
      quote: '',
      name: '',
      title: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!tempTestimonial.quote || !tempTestimonial.name || !tempTestimonial.title) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Update the testimonials array
      let updatedTestimonials;
      if (isAdding) {
        updatedTestimonials = [...testimonials, tempTestimonial];
      } else if (editingIndex !== null) {
        updatedTestimonials = [...testimonials];
        updatedTestimonials[editingIndex] = tempTestimonial;
      } else {
        throw new Error('Invalid state: not adding or editing');
      }

      // Save the updated testimonials
      const updateResponse = await fetch('/api/content/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTestimonials),
      });

      if (updateResponse.ok) {
        setTestimonials(updatedTestimonials);
        setMessage({ text: 'Testimonials updated successfully!', type: 'success' });
        setEditingIndex(null);
        setIsAdding(false);
      } else {
        setMessage({ text: 'Failed to update testimonials', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating testimonials', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const updatedTestimonials = [...testimonials];
      updatedTestimonials.splice(index, 1);

      const response = await fetch('/api/content/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTestimonials),
      });

      if (response.ok) {
        setTestimonials(updatedTestimonials);
        setMessage({ text: 'Testimonial deleted successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete testimonial', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting testimonial', type: 'error' });
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
        <h1 className="text-2xl font-bold">Edit Testimonials</h1>
        {!isAdding && editingIndex === null && (
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Testimonial
          </button>
        )}
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

      {(isAdding || editingIndex !== null) ? (
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            {isAdding ? 'Add New Testimonial' : 'Edit Testimonial'}
          </h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
                Quote
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={4}
                value={tempTestimonial.quote}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={tempTestimonial.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title/Position
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={tempTestimonial.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
              >
                {saving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex justify-between">
                <p className="font-medium">{testimonial.name}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="rounded p-2 text-gray-600 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="rounded p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mb-2 text-sm italic text-gray-700">"{testimonial.quote}"</p>
              <p className="text-xs text-gray-500">{testimonial.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 