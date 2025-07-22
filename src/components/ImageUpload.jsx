import { useState } from 'react'
import { Upload, X } from 'lucide-react'

const ImageUpload = ({ 
  multiple = true, 
  maxFiles = 8, 
  onImagesChange, 
  existingImages = [] 
}) => {
  const [images, setImages] = useState(existingImages)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)
    
    if (!multiple && fileArray.length > 1) {
      alert('Only one file allowed')
      return
    }
    
    if (images.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    
    try {
      const newImages = []
      
      for (const file of fileArray) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Only image files are allowed')
          continue
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB')
          continue
        }
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file)
        
        // In a real app, you would upload to cloud storage here
        // For now, we'll simulate the upload
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          preview: previewUrl,
          url: previewUrl, // In real app, this would be the cloud URL
          uploaded: true
        })
      }
      
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    handleFiles(files)
  }

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    setImages(updatedImages)
    onImagesChange?.(updatedImages)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-apple-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-brand-orange-light dark:border-brand-orange-dark bg-brand-orange-light/10 dark:bg-brand-orange-dark/10'
            : 'border-light-border dark:border-dark-border hover:border-brand-orange-light dark:hover:border-brand-orange-dark'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin w-6 h-6 border-2 border-brand-orange-light dark:border-brand-orange-dark border-t-transparent rounded-full"></div>
              ) : (
                <Upload size={24} className="text-light-text-secondary dark:text-dark-text-secondary" />
              )}
            </div>
            
            <div>
              <p className="text-light-text-primary dark:text-dark-text-primary font-medium">
                {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {multiple ? `Up to ${maxFiles} images` : 'Single image'} • JPG, PNG, WebP • Max 5MB each
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square bg-light-surface dark:bg-dark-surface rounded-apple overflow-hidden group"
            >
              <img
                src={image.preview || image.url}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              
              {/* Remove button */}
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X size={14} />
              </button>
              
              {/* Upload status */}
              {!image.uploaded && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-apple">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-4 h-4 border-2 border-brand-orange-light dark:border-brand-orange-dark border-t-transparent rounded-full"></div>
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Processing images...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
