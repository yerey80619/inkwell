"use client";

import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { Search, Bell, Menu, Plus, MoreHorizontal, X, Sparkles } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function DesignSystemPage() {
  return (
    <div className={`${playfair.variable} ${inter.variable} min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans p-8 md:p-16`}>
      <style jsx global>{`
        :root {
          --font-playfair: ${playfair.style.fontFamily};
          --font-inter: ${inter.style.fontFamily};
        }
        body {
          background-color: #F5F5F7;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4">Inkwell Design System</h1>
          <p className="text-xl text-[#86868B] max-w-2xl">
            "Digital Serenity" — A design language prioritizing content and clarity through a Soft UI aesthetic. 
            Tactile, lightweight, and distraction-free.
          </p>
        </header>

        {/* Typography Section */}
        <section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold border-b border-[#E5E5EA] pb-4">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-[#86868B] uppercase tracking-wider">Headings (Playfair Display)</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">H1 - 2.5rem (40px)</span>
                  <h1 className="font-serif text-[2.5rem] leading-tight font-bold">The quick brown fox jumps over the lazy dog</h1>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">H2 - 2rem (32px)</span>
                  <h2 className="font-serif text-[2rem] leading-tight font-bold">The quick brown fox jumps over the lazy dog</h2>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">H3 - 1.75rem (28px)</span>
                  <h3 className="font-serif text-[1.75rem] leading-tight font-bold">The quick brown fox jumps over the lazy dog</h3>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">H4 - 1.5rem (24px)</span>
                  <h4 className="font-serif text-[1.5rem] leading-tight font-bold">The quick brown fox jumps over the lazy dog</h4>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-[#86868B] uppercase tracking-wider">Body (Inter)</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">Body Large - 1.125rem (18px)</span>
                  <p className="text-[1.125rem] leading-relaxed">
                    Use for introductions or emphasized text. The design language prioritizes content and clarity through a 'Soft UI' aesthetic. Interfaces should feel tactile yet lightweight.
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">Body - 1rem (16px)</span>
                  <p className="text-[1rem] leading-relaxed">
                    Use for standard body copy. Utilizing subtle shadows and rounded corners to create depth without clutter. The goal is to provide a distraction-free environment that feels premium and approachable.
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">Small - 0.875rem (14px)</span>
                  <p className="text-[0.875rem] leading-relaxed text-[#86868B]">
                    Use for secondary text, captions, or less important information.
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#86868B] block mb-1">Tiny - 0.75rem (12px)</span>
                  <p className="text-[0.75rem] leading-relaxed text-[#86868B] uppercase tracking-wide">
                    METADATA / LABELS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold border-b border-[#E5E5EA] pb-4">Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <ColorSwatch name="Background" hex="#F5F5F7" className="bg-[#F5F5F7] border border-[#E5E5EA]" text="text-[#1D1D1F]" />
            <ColorSwatch name="Surface" hex="#FFFFFF" className="bg-[#FFFFFF] border border-[#E5E5EA]" text="text-[#1D1D1F]" />
            <ColorSwatch name="Primary Text" hex="#1D1D1F" className="bg-[#1D1D1F]" text="text-white" />
            <ColorSwatch name="Secondary Text" hex="#86868B" className="bg-[#86868B]" text="text-white" />
            <ColorSwatch name="Accent" hex="#007AFF" className="bg-[#007AFF]" text="text-white" />
            <ColorSwatch name="Border" hex="#E5E5EA" className="bg-[#E5E5EA]" text="text-[#1D1D1F]" />
            <ColorSwatch name="Success" hex="#34C759" className="bg-[#34C759]" text="text-white" />
            <ColorSwatch name="Warning" hex="#FF9500" className="bg-[#FF9500]" text="text-white" />
            <ColorSwatch name="Error" hex="#FF3B30" className="bg-[#FF3B30]" text="text-white" />
          </div>
        </section>

        {/* Shadows & Depth */}
        <section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold border-b border-[#E5E5EA] pb-4">Shadows & Depth</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl h-32 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <span className="text-sm font-medium text-[#86868B]">Soft Shadow</span>
            </div>
            <div className="bg-white rounded-xl h-32 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <span className="text-sm font-medium text-[#86868B]">Medium Shadow</span>
            </div>
            <div className="bg-white rounded-xl h-32 flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
              <span className="text-sm font-medium text-[#86868B]">Raised Shadow</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-xl h-32 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
              <span className="text-sm font-medium text-[#86868B]">Inner Shadow</span>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="space-y-8">
          <h2 className="font-serif text-3xl font-bold border-b border-[#E5E5EA] pb-4">Components</h2>

          {/* Buttons */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-6 items-center p-8 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA]">
              
              {/* Primary Button (Pseudo-3D) */}
              <button className="group relative px-8 py-3 bg-gradient-to-b from-[#3A3A3C] to-[#1C1C1E] text-white font-medium rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.3)] border border-[#2C2C2E] hover:shadow-[0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                <span>Get in Touch</span>
                <Sparkles size={16} className="text-white/70 group-hover:text-white group-hover:rotate-12 transition-all duration-300" />
              </button>

              {/* Secondary Button */}
              <button className="px-6 py-3 bg-transparent text-[#1D1D1F] font-medium rounded-full border border-[#E5E5EA] hover:bg-[#E5E5EA]/50 hover:border-[#D1D1D6] transition-all duration-200">
                Secondary Button
              </button>

              {/* Accent Button (Variant) */}
              <button className="px-6 py-3 bg-gradient-to-b from-[#007AFF] to-[#0062CC] text-white font-medium rounded-full shadow-[0_4px_12px_rgba(0,122,255,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                Accent Button
              </button>

              {/* Icon Button */}
              <button className="w-10 h-10 flex items-center justify-center bg-gradient-to-b from-[#3A3A3C] to-[#1C1C1E] text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[#2C2C2E] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F]">Email Address</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F]">Command Bar</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] group-focus-within:text-white transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-11 pr-12 py-3 bg-gradient-to-b from-[#3A3A3C] to-[#1C1C1E] border border-[#2C2C2E] rounded-full text-white placeholder:text-[#86868B] shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:border-[#5E5E62] focus:shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                     <span className="px-1.5 py-0.5 rounded bg-[#3A3A3C] text-[10px] font-medium text-[#86868B] border border-[#48484A]">⌘</span>
                     <span className="px-1.5 py-0.5 rounded bg-[#3A3A3C] text-[10px] font-medium text-[#86868B] border border-[#48484A]">K</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#1D1D1F]">Bio</label>
                <textarea 
                  rows={3}
                  placeholder="Tell us about yourself..." 
                  className="w-full px-4 py-3 bg-white border border-[#E5E5EA] rounded-xl text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all duration-200 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Simple Card */}
              <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center mb-4 text-[#1D1D1F]">
                  <Menu size={24} />
                </div>
                <h4 className="text-lg font-semibold mb-2">Simple Card</h4>
                <p className="text-[#86868B] text-sm leading-relaxed">
                  A basic card component with soft shadows and ample padding. Perfect for features or summaries.
                </p>
              </div>

              {/* Feature Card */}
              <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E5EA]">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold">Feature Card</h4>
                  <span className="px-2 py-1 bg-[#F5F5F7] text-[#1D1D1F] text-xs font-medium rounded-md">New</span>
                </div>
                <p className="text-[#86868B] text-sm leading-relaxed mb-4">
                  Includes a border for slightly more definition while maintaining the soft aesthetic.
                </p>
                <button className="text-[#007AFF] text-sm font-medium hover:underline">Learn more &rarr;</button>
              </div>

              {/* Image Card */}
              <div className="bg-white p-4 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <div className="h-32 bg-[#F5F5F7] rounded-xl w-full mb-4 flex items-center justify-center text-[#86868B]">
                  Image Placeholder
                </div>
                <h4 className="text-lg font-semibold mb-1">Image Card</h4>
                <p className="text-[#86868B] text-sm">Visual focus.</p>
              </div>
            </div>
          </div>

          {/* Navigation Mockup */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Navigation Structure</h3>
            <div className="h-[400px] w-full rounded-2xl border border-[#E5E5EA] overflow-hidden flex bg-[#F5F5F7] relative">
              
              {/* Sidebar */}
              <div className="w-64 bg-[#F5F5F7] border-r border-[#E5E5EA] flex flex-col p-4 hidden md:flex">
                <div className="h-8 w-24 bg-[#E5E5EA] rounded-md mb-8"></div>
                <div className="space-y-2">
                  <div className="h-10 w-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-lg flex items-center px-3">
                    <div className="w-4 h-4 bg-[#1D1D1F] rounded-full opacity-20 mr-3"></div>
                    <div className="w-20 h-2 bg-[#1D1D1F] rounded-full opacity-20"></div>
                  </div>
                  <div className="h-10 w-full rounded-lg flex items-center px-3 hover:bg-white/50 transition-colors">
                    <div className="w-4 h-4 bg-[#86868B] rounded-full opacity-20 mr-3"></div>
                    <div className="w-24 h-2 bg-[#86868B] rounded-full opacity-20"></div>
                  </div>
                  <div className="h-10 w-full rounded-lg flex items-center px-3 hover:bg-white/50 transition-colors">
                    <div className="w-4 h-4 bg-[#86868B] rounded-full opacity-20 mr-3"></div>
                    <div className="w-16 h-2 bg-[#86868B] rounded-full opacity-20"></div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <div className="h-20 flex items-center justify-center px-6 sticky top-0 z-10 pointer-events-none">
                  <div className="w-full max-w-2xl bg-[#1C1C1E]/90 backdrop-blur-xl border border-[#2C2C2E] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between px-4 py-2 pointer-events-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center">
                        <Menu size={16} className="text-[#86868B]" />
                      </div>
                      <span className="font-medium text-white text-sm">Dashboard</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-48 pl-9 pr-4 py-1.5 bg-[#2C2C2E] border border-[#3A3A3C] rounded-full text-white text-sm placeholder:text-[#86868B] focus:outline-none focus:bg-[#3A3A3C] transition-all"
                        />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#3A3A3C] flex items-center justify-center">
                        <Bell size={16} className="text-[#86868B]" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6]"></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="h-32 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6"></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-40 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]"></div>
                    <div className="h-40 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Example */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Modal Dialog</h3>
            <div className="relative h-[300px] bg-[#E5E5EA] rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>
              
              <div className="relative bg-white w-full max-w-md p-8 rounded-[32px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] m-4">
                <button className="absolute top-6 right-6 text-[#86868B] hover:text-[#1D1D1F]">
                  <X size={20} />
                </button>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-4">
                    <Bell size={24} className="text-[#1D1D1F]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Enable Notifications?</h3>
                  <p className="text-[#86868B] leading-relaxed">
                    Stay up to date with the latest changes and updates to your workspace. You can change this anytime in settings.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-[#1D1D1F] text-white font-medium rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all">
                    Allow
                  </button>
                  <button className="flex-1 px-6 py-3 bg-transparent text-[#86868B] font-medium rounded-xl hover:bg-[#F5F5F7] transition-all">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}

function ColorSwatch({ name, hex, className, text }: { name: string, hex: string, className: string, text: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-24 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-end p-3 ${className}`}>
        <span className={`text-xs font-mono opacity-80 ${text}`}>{hex}</span>
      </div>
      <div>
        <p className="font-medium text-sm text-[#1D1D1F]">{name}</p>
      </div>
    </div>
  );
}
