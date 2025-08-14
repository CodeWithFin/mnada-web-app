import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFileUpload } from '../hooks/useDatabase';
import { postService } from '../services/database';
import { BUCKETS } from '../lib/supabase';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const UploadPageSupabase: React.FC = () => {
  const { user } = useAuth();
  const { uploadFile, uploading, error: uploadError } = useFileUpload();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to post');
      return;
    }

    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    try {
      setPosting(true);
      
      // Upload image to Supabase storage
      const uploadPath = `${user.id}/${Date.now()}-${selectedFile.name}`;
      const uploadResult = await uploadFile(BUCKETS.posts, selectedFile, uploadPath);
      
      if (!uploadResult) {
        throw new Error('Failed to upload image');
      }

      // Create post in database
      await postService.create({
        user_id: user.id,
        caption: caption.trim(),
        image_url: uploadResult.publicUrl
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to share your style with the community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Share Your Style
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a photo and inspire the Mnada community with your fashion sense!
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              🎉 Your post has been shared successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Upload Image
            </label>
            
            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-fashion-purple bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview || ''}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell us about your style... #fashion #african #style"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-fashion-purple focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                setCaption('');
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={!selectedFile || posting || uploading}
              className="px-6 py-2 bg-fashion-purple text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {posting || uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {uploading ? 'Uploading...' : 'Posting...'}
                </>
              ) : (
                'Share Post'
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">
              Upload Error: {uploadError}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">
            Tips for Great Posts
          </h3>
          <ul className="text-blue-800 dark:text-blue-300 space-y-1 text-sm">
            <li>• Use good lighting for better photo quality</li>
            <li>• Add relevant hashtags to reach more people</li>
            <li>• Share the story behind your outfit</li>
            <li>• Tag designers or brands when appropriate</li>
            <li>• Engage with other community members</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPageSupabase;
