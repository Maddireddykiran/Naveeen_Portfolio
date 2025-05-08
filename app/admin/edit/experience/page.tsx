'use client';

import { useState, useEffect } from 'react';
import { Experience } from '@/services/content-service';
import { useRouter } from 'next/navigation';

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const router = useRouter();

  // Form state for adding new experience
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: '',
    company: '',
    period: '',
    location: '',
    desc: '',
    skills: [],
    thumbnail: ''
  });
  
  // Fetch all experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/content/experience');
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading experiences');
        setLoading(false);
        console.error(err);
      }
    };

    fetchExperiences();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingExperience) {
      setEditingExperience(prev => ({ ...prev!, [name]: value }));
    } else {
      setNewExperience(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle skills input (comma-separated)
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    if (editingExperience) {
      setEditingExperience(prev => ({ ...prev!, skills: skillsArray }));
    } else {
      setNewExperience(prev => ({ ...prev, skills: skillsArray }));
    }
  };

  // Start editing an experience
  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setShowAddForm(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingExperience(null);
  };

  // Submit experience update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingExperience) return;
    
    try {
      const response = await fetch(`/api/content/experience/${editingExperience.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingExperience),
      });

      if (!response.ok) {
        throw new Error('Failed to update experience');
      }

      // Update the experience in the list
      setExperiences(prev => 
        prev.map(exp => exp.id === editingExperience.id ? editingExperience : exp)
      );
      
      // Reset form
      setEditingExperience(null);
      router.refresh();
      
    } catch (err) {
      console.error('Error updating experience:', err);
      setError('Failed to update experience');
    }
  };

  // Submit new experience
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/content/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExperience),
      });

      if (!response.ok) {
        throw new Error('Failed to add experience');
      }

      const result = await response.json();
      
      // Add the new experience to the list
      setExperiences(prev => [...prev, result.experience]);
      
      // Reset form and hide it
      setNewExperience({
        title: '',
        company: '',
        period: '',
        location: '',
        desc: '',
        skills: [],
        thumbnail: ''
      });
      
      setShowAddForm(false);
      router.refresh();
      
    } catch (err) {
      console.error('Error adding experience:', err);
      setError('Failed to add experience');
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading experiences...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Experience</h1>
        {!editingExperience && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {showAddForm ? 'Cancel' : 'Add New Experience'}
          </button>
        )}
      </div>

      {editingExperience && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Experience</h2>
            <button
              onClick={handleCancelEdit}
              className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingExperience.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company*
                </label>
                <input
                  type="text"
                  name="company"
                  value={editingExperience.company}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Period*
                </label>
                <input
                  type="text"
                  name="period"
                  value={editingExperience.period}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 2018 - Present"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={editingExperience.location}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={editingExperience.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={editingExperience.skills.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="Skill 1, Skill 2, Skill 3"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                name="desc"
                value={editingExperience.desc}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Update Experience
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Add New Experience</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={newExperience.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company*
                </label>
                <input
                  type="text"
                  name="company"
                  value={newExperience.company}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Period*
                </label>
                <input
                  type="text"
                  name="period"
                  value={newExperience.period}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 2018 - Present"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={newExperience.location}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={newExperience.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={newExperience.skills?.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="Skill 1, Skill 2, Skill 3"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                name="desc"
                value={newExperience.desc}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Add Experience
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{exp.title}</h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {exp.company}
              </span>
            </div>
            <p className="mb-1 text-sm text-gray-600">{exp.period} • {exp.location}</p>
            <p className="mb-4 text-gray-700">{exp.desc}</p>
            
            {exp.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {exp.thumbnail && (
              <div className="mb-4 h-16 w-16 overflow-hidden rounded-md">
                <img 
                  src={exp.thumbnail} 
                  alt={`${exp.company} logo`} 
                  className="h-full w-full object-cover" 
                />
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleEdit(exp)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 