'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, X } from 'lucide-react';

// Tech stack names mapping for conversion
const techStackMap: Record<string, string> = {
  "React": "/re.svg",
  "Next.js": "/next.svg",
  "Tailwind": "/tail.svg",
  "TypeScript": "/ts.svg",
  "Three.js": "/three.svg",
  "Framer": "/fm.svg",
  "C++": "/c.svg",
  "Stream API": "/stream.svg",
  "GSAP": "/gsap.svg",
  "AEM": "/aem.svg",
  "AI/ML": "/ai.svg"
};

interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  sourceCode: string;
  rawTechStack?: string;
}

export default function EditProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempProject, setTempProject] = useState<Project>({
    id: 0,
    title: '',
    des: '',
    img: '',
    iconLists: [],
    rawTechStack: '',
    link: '',
    sourceCode: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/content/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setMessage({ text: 'Failed to load projects data', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error loading projects data', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleEditClick = (index: number) => {
    const project = projects[index];
    
    // Convert icon paths to tech names for editing
    const techNamesText = project.iconLists.map(icon => {
      // Find the tech name for this icon path by comparing with values in techStackMap
      for (const [name, path] of Object.entries(techStackMap)) {
        if (path === icon) {
          return name;
        }
      }
      return icon.replace("/", "").replace(".svg", "");
    }).join(", ");
    
    setEditingIndex(index);
    setTempProject({
      ...project,
      rawTechStack: techNamesText
    });
    setPreviewUrl(project.img);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setTempProject({
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      title: '',
      des: '',
      img: '',
      iconLists: [],
      rawTechStack: '',
      link: '',
      sourceCode: ''
    });
    setPreviewUrl('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProject(prev => ({ ...prev, [name]: value }));
  };

  // New handler for tech stack input that converts tech names to icon paths
  const handleTechStackInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Just store the raw text input as is - we'll do conversion only when saving
    const techStackText = e.target.value;
    
    // Store the raw tech names in a temporary state variable
    setTempProject(prev => ({ 
      ...prev, 
      // Store raw text in a temporary field
      rawTechStack: techStackText,
      // Also update iconLists for backwards compatibility
      iconLists: convertTechNamesToIcons(techStackText)
    }));
  };
  
  // Helper function to convert tech names to icon paths
  const convertTechNamesToIcons = (techText: string): string[] => {
    // Split by comma and trim each entry
    const rawTechNames = techText.split(',').map(tech => tech.trim());
    
    // Remove empty entries but allow duplicates (we'll handle them during save)
    const validTechNames = rawTechNames.filter(name => name !== '');
    
    // Convert tech names to icon paths where possible
    return validTechNames.map(name => {
      return techStackMap[name] || `/${name.toLowerCase().replace(/[^\w]/g, '')}.svg`;
    });
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

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!tempProject.title || !tempProject.des) {
      setMessage({ text: 'Title and description are required', type: 'error' });
      return;
    }
    
    // Before saving, ensure we have the latest icon paths
    if (tempProject.rawTechStack !== undefined) {
      tempProject.iconLists = convertTechNamesToIcons(tempProject.rawTechStack);
    }
    
    // Remove the rawTechStack field before saving to avoid sending it to the API
    const { rawTechStack, ...projectToSave } = tempProject;
    
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    // Continue with the save operation using projectToSave instead of tempProject
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
          // Update the project with the new image path
          projectToSave.img = uploadData.filePath;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      
      // Update the projects array
      let updatedProjects;
      if (isAdding) {
        updatedProjects = [...projects, { ...projectToSave, img: imageFile ? projectToSave.img : projectToSave.img || '/Pro.jpg' }];
      } else if (editingIndex !== null) {
        updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...projectToSave, img: imageFile ? projectToSave.img : projectToSave.img };
      } else {
        throw new Error('Invalid state: not adding or editing');
      }
      
      // Save the updated projects
      const updateResponse = await fetch('/api/content/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects),
      });
      
      if (updateResponse.ok) {
        setProjects(updatedProjects);
        setMessage({ text: 'Projects updated successfully!', type: 'success' });
        setEditingIndex(null);
        setIsAdding(false);
      } else {
        setMessage({ text: 'Failed to update projects', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating projects', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const updatedProjects = [...projects];
      updatedProjects.splice(index, 1);

      const response = await fetch('/api/content/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects),
      });

      if (response.ok) {
        setProjects(updatedProjects);
        setMessage({ text: 'Project deleted successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete project', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting project', type: 'error' });
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
        <h1 className="text-2xl font-bold">Edit Projects</h1>
        {!isAdding && editingIndex === null && (
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Project
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
            {isAdding ? 'Add New Project' : 'Edit Project'}
          </h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={tempProject.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="des" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="des"
                name="des"
                rows={3}
                value={tempProject.des}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Project Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={tempProject.link}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="sourceCode" className="block text-sm font-medium text-gray-700">
                Source Code Link
              </label>
              <input
                type="url"
                id="sourceCode"
                name="sourceCode"
                value={tempProject.sourceCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Technologies Used
              </label>
              <div className="mt-1">
                <textarea
                  id="techStack"
                  rows={3}
                  placeholder="Enter technology names separated by commas (e.g. React, Next.js, Tailwind, TypeScript)"
                  value={tempProject.rawTechStack || ''}
                  onChange={handleTechStackInput}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter technology names separated by commas. Available options include: React, Next.js, Tailwind, TypeScript, Three.js, Framer, C++, Stream API, GSAP, AEM, AI/ML, or any custom technology.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Image</label>
              
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
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center">
                {project.img && (
                  <div className="mr-4 h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{project.des}</p>
                </div>
              </div>
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
          ))}
        </div>
      )}
    </div>
  );
} 