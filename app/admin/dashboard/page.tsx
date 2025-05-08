'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [username, setUsername] = useState('Admin');

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Welcome, {username}!</h1>
      
      <p className="mb-6 text-gray-700">
        Use this admin panel to easily update your website content without touching any code.
        Select a section below to start editing.
      </p>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Hero Section" 
          description="Update your main headline, description, and profile image."
          link="/admin/edit/hero"
        />
        
        <DashboardCard 
          title="About Me" 
          description="Edit your professional bio, expertise, and profile image."
          link="/admin/edit/about"
        />
        
        <DashboardCard 
          title="Projects" 
          description="Add, edit, or remove projects from your portfolio."
          link="/admin/edit/projects"
        />
        
        <DashboardCard 
          title="Experience" 
          description="Manage your work history and professional experience."
          link="/admin/edit/experience"
        />
        
        <DashboardCard 
          title="Testimonials" 
          description="Manage client testimonials and feedback."
          link="/admin/edit/testimonials"
        />
        
        <DashboardCard 
          title="Skills" 
          description="Update your technical skills and competencies."
          link="/admin/edit/skills"
        />
        
        <DashboardCard 
          title="Approach" 
          description="Edit your work approach and methodology phases."
          link="/admin/edit/approach"
        />
        
        <DashboardCard 
          title="Footer" 
          description="Update footer information and call-to-action."
          link="/admin/edit/footer"
        />
      </div>

      <div className="mt-10 rounded-lg bg-blue-50 p-4 text-blue-800">
        <h3 className="mb-2 font-semibold">Need help?</h3>
        <p>
          This panel allows you to edit the content of your website without touching any code.
          Simply navigate to the section you want to edit, make your changes, and save.
          All changes will be instantly reflected on your website.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }: { 
  title: string; 
  description: string; 
  link: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mb-4 text-gray-600">{description}</p>
      <Link 
        href={link}
        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Edit Section
      </Link>
    </div>
  );
} 