'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import Image from 'next/image';

interface SocialMedia {
  name: string;
  img: string;
  link: string;
}

interface Footer {
  cta: {
    heading: string;
    subtext: string;
    buttonText: string;
    buttonLink: string;
  };
  copyright: {
    name: string;
    link: string;
  };
  socialMedia: SocialMedia[];
}

export default function FooterEditor() {
  const [footer, setFooter] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [tempSocial, setTempSocial] = useState<SocialMedia>({
    name: '',
    img: '',
    link: ''
  });

  // Fetch footer
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch('/api/content/footer');
        const socialResponse = await fetch('/api/content/social');
        
        if (!response.ok) {
          throw new Error('Failed to fetch footer');
        }
        
        const data = await response.json();
        const socialData = await socialResponse.json();
        
        // Combine the data
        setFooter({
          ...data,
          socialMedia: socialData || []
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error loading footer data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchFooter();
  }, []);

  // Handle CTA input changes
  const handleCtaChange = (field: string, value: string) => {
    if (!footer) return;
    
    setFooter({
      ...footer,
      cta: {
        ...footer.cta,
        [field]: value
      }
    });
  };

  // Handle copyright input changes
  const handleCopyrightChange = (field: string, value: string) => {
    if (!footer) return;
    
    setFooter({
      ...footer,
      copyright: {
        ...footer.copyright,
        [field]: value
      }
    });
  };

  // Handle social media item changes
  const handleSocialItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempSocial(prev => ({ ...prev, [name]: value }));
  };

  // Add social media item
  const handleAddSocialClick = () => {
    setIsAddingSocial(true);
    setEditingSocialIndex(null);
    setTempSocial({
      name: '',
      img: '',
      link: ''
    });
  };

  // Edit social media item
  const handleEditSocialClick = (index: number) => {
    if (!footer) return;
    setEditingSocialIndex(index);
    setTempSocial(footer.socialMedia[index]);
    setIsAddingSocial(false);
  };

  // Save social media item
  const handleSaveSocialItem = () => {
    if (!footer) return;
    if (!tempSocial.name || !tempSocial.img || !tempSocial.link) {
      setMessage({ text: 'All fields are required for social media items', type: 'error' });
      return;
    }

    let updatedSocialMedia = [...footer.socialMedia];
    if (isAddingSocial) {
      updatedSocialMedia.push(tempSocial);
    } else if (editingSocialIndex !== null) {
      updatedSocialMedia[editingSocialIndex] = tempSocial;
    }

    setFooter({
      ...footer,
      socialMedia: updatedSocialMedia
    });
    
    setEditingSocialIndex(null);
    setIsAddingSocial(false);
    setMessage({ 
      text: isAddingSocial ? 'Social media item added' : 'Social media item updated', 
      type: 'success' 
    });
  };

  // Delete social media item
  const handleDeleteSocialItem = (index: number) => {
    if (!footer) return;
    if (!confirm('Are you sure you want to delete this social media item?')) {
      return;
    }

    const updatedSocialMedia = [...footer.socialMedia];
    updatedSocialMedia.splice(index, 1);
    
    setFooter({
      ...footer,
      socialMedia: updatedSocialMedia
    });
    
    setMessage({ text: 'Social media item deleted', type: 'success' });
  };

  // Cancel editing social media item
  const handleCancelSocialItem = () => {
    setEditingSocialIndex(null);
    setIsAddingSocial(false);
  };

  // Save changes
  const handleSave = async () => {
    if (!footer) return;
    
    try {
      setMessage({ text: '', type: '' });
      
      // Update footer data
      const footerResponse = await fetch('/api/content/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cta: footer.cta,
          copyright: footer.copyright
        }),
      });

      // Update social media data
      const socialResponse = await fetch('/api/content/social', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footer.socialMedia),
      });

      if (!footerResponse.ok || !socialResponse.ok) {
        throw new Error('Failed to update footer');
      }

      setMessage({ text: 'Footer updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating footer:', err);
      setMessage({ text: 'Failed to update footer', type: 'error' });
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading footer data...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!footer) {
    return <div className="text-center p-10 text-red-500">No footer data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Footer</h1>
        <button
          onClick={handleSave}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Save Changes
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

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Call to Action Section</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Heading
            </label>
            <input
              type="text"
              value={footer.cta.heading}
              onChange={(e) => handleCtaChange('heading', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subtext
            </label>
            <textarea
              value={footer.cta.subtext}
              onChange={(e) => handleCtaChange('subtext', e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                value={footer.cta.buttonText}
                onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                value={footer.cta.buttonLink}
                onChange={(e) => handleCtaChange('buttonLink', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="e.g. mailto:email@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Copyright Information</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={footer.copyright.name}
                onChange={(e) => handleCopyrightChange('name', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Link
              </label>
              <input
                type="text"
                value={footer.copyright.link}
                onChange={(e) => handleCopyrightChange('link', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="e.g. https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Social Media Links</h2>
          {!isAddingSocial && editingSocialIndex === null && (
            <button
              onClick={handleAddSocialClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Social Media
            </button>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {(isAddingSocial || editingSocialIndex !== null) ? (
            <div className="mb-6 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                {isAddingSocial ? 'Add New Social Media' : 'Edit Social Media'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={tempSocial.name}
                    onChange={handleSocialItemChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="e.g. GitHub, LinkedIn, Twitter"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Icon Path
                  </label>
                  <input
                    type="text"
                    name="img"
                    value={tempSocial.img}
                    onChange={handleSocialItemChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="e.g. /git.svg, /link.svg"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Profile URL
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={tempSocial.link}
                    onChange={handleSocialItemChange}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="e.g. https://github.com/username"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelSocialItem}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSocialItem}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {isAddingSocial ? 'Add Item' : 'Update Item'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {footer.socialMedia.length === 0 ? (
                <p className="text-sm text-gray-500">No social media links added yet. Click "Add Social Media" to create one.</p>
              ) : (
                <div className="space-y-4">
                  {footer.socialMedia.map((social, index) => (
                    <div key={index} className="flex items-start justify-between rounded-md border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                          <Image 
                            src={social.img} 
                            alt={social.name}
                            width={24}
                            height={24}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{social.name}</h4>
                          <p className="text-xs text-gray-500">{social.link}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => handleEditSocialClick(index)}
                          className="mr-2 text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSocialItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
} 