'use client';

import { useState, useEffect } from 'react';
import { ApproachPhase } from '@/services/content-service';
import { useRouter } from 'next/navigation';

export default function ApproachEditor() {
  const [approaches, setApproaches] = useState<ApproachPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch all approaches
  useEffect(() => {
    const fetchApproaches = async () => {
      try {
        const response = await fetch('/api/content/approach');
        if (!response.ok) {
          throw new Error('Failed to fetch approaches');
        }
        const data = await response.json();
        setApproaches(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading approaches');
        setLoading(false);
        console.error(err);
      }
    };

    fetchApproaches();
  }, []);

  // Handle input change for a specific approach
  const handleInputChange = (index: number, field: keyof ApproachPhase, value: string) => {
    const updatedApproaches = [...approaches];
    updatedApproaches[index] = {
      ...updatedApproaches[index],
      [field]: value
    };
    setApproaches(updatedApproaches);
  };

  // Add a new approach
  const handleAddApproach = () => {
    const newApproach: ApproachPhase = {
      title: "New Phase",
      phase: `Phase ${approaches.length + 1}`,
      description: "Description of this phase"
    };
    
    setApproaches([...approaches, newApproach]);
  };

  // Remove an approach
  const handleRemoveApproach = (index: number) => {
    const updatedApproaches = [...approaches];
    updatedApproaches.splice(index, 1);
    setApproaches(updatedApproaches);
  };

  // Save all changes
  const handleSave = async () => {
    try {
      const response = await fetch('/api/content/approach', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approaches),
      });

      if (!response.ok) {
        throw new Error('Failed to update approaches');
      }

      alert('Approaches updated successfully!');
      router.refresh();
      
    } catch (err) {
      console.error('Error updating approaches:', err);
      setError('Failed to update approaches');
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading approaches...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Approach Phases</h1>
        <div className="space-x-2">
          <button
            onClick={handleAddApproach}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Phase
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {approaches.map((approach, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Phase {index + 1}</h2>
              <button
                onClick={() => handleRemoveApproach(index)}
                className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              >
                Remove
              </button>
            </div>
            
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={approach.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phase Label
                </label>
                <input
                  type="text"
                  value={approach.phase}
                  onChange={(e) => handleInputChange(index, 'phase', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g. Phase 1"
                />
              </div>
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={approach.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
        ))}
      </div>

      {approaches.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-gray-500">No approach phases yet. Add your first one!</p>
          <button
            onClick={handleAddApproach}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Phase
          </button>
        </div>
      )}

      {approaches.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save All Changes
          </button>
        </div>
      )}
    </div>
  );
} 