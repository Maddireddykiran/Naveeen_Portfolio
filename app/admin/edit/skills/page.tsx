'use client';

import { useState, useEffect } from 'react';
import { TechStack, SkillCategory } from '@/services/content-service';
import { useRouter } from 'next/navigation';

export default function SkillsEditor() {
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch tech stack
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const response = await fetch('/api/content/techstack');
        if (!response.ok) {
          throw new Error('Failed to fetch tech stack');
        }
        const data = await response.json();
        setTechStack(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading tech stack');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTechStack();
  }, []);

  // Add a new category
  const handleAddCategory = () => {
    if (!techStack) return;
    
    const newCategory: SkillCategory = {
      title: "New Category",
      skills: []
    };
    
    setTechStack({
      ...techStack,
      categories: [...techStack.categories, newCategory]
    });
  };

  // Handle category title change
  const handleCategoryTitleChange = (index: number, title: string) => {
    if (!techStack) return;
    
    const updatedCategories = [...techStack.categories];
    updatedCategories[index].title = title;
    
    setTechStack({
      ...techStack,
      categories: updatedCategories
    });
  };

  // Handle skills change
  const handleSkillsChange = (categoryIndex: number, skillsText: string) => {
    if (!techStack) return;
    
    const skills = skillsText.split(',').map(skill => skill.trim());
    const updatedCategories = [...techStack.categories];
    updatedCategories[categoryIndex].skills = skills;
    
    setTechStack({
      ...techStack,
      categories: updatedCategories
    });
  };

  // Handle additional skills change
  const handleAdditionalSkillsChange = (skillsText: string) => {
    if (!techStack) return;
    
    const skills = skillsText.split(',').map(skill => skill.trim());
    
    setTechStack({
      ...techStack,
      additionalSkills: skills
    });
  };

  // Remove a category
  const handleRemoveCategory = (index: number) => {
    if (!techStack) return;
    
    const updatedCategories = [...techStack.categories];
    updatedCategories.splice(index, 1);
    
    setTechStack({
      ...techStack,
      categories: updatedCategories
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!techStack) return;
    
    try {
      const response = await fetch('/api/content/techstack', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(techStack),
      });

      if (!response.ok) {
        throw new Error('Failed to update tech stack');
      }

      alert('Tech stack updated successfully!');
      router.refresh();
      
    } catch (err) {
      console.error('Error updating tech stack:', err);
      setError('Failed to update tech stack');
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading skills data...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!techStack) {
    return <div className="text-center p-10 text-red-500">No skills data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Skills</h1>
        <div className="space-x-2">
          <button
            onClick={handleAddCategory}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Category
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Skill Categories</h2>
        
        {techStack.categories.map((category, index) => (
          <div 
            key={index} 
            className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <input
                type="text"
                value={category.title}
                onChange={(e) => handleCategoryTitleChange(index, e.target.value)}
                className="rounded-md border border-gray-300 p-2 font-medium"
                placeholder="Category Title"
              />
              <button
                onClick={() => handleRemoveCategory(index)}
                className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              >
                Remove
              </button>
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <textarea
                value={category.skills.join(', ')}
                onChange={(e) => handleSkillsChange(index, e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Skill 1, Skill 2, Skill 3"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Additional Skills</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Additional Skills (comma-separated)
          </label>
          <textarea
            value={techStack.additionalSkills.join(', ')}
            onChange={(e) => handleAdditionalSkillsChange(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Skill 1, Skill 2, Skill 3"
          />
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