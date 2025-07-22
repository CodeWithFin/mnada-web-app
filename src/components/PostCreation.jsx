import { useState } from 'react'
import { 
  X, 
  Camera, 
  MapPin, 
  Tag, 
  Users, 
  Globe, 
  Lock,
  DollarSign,
  ShoppingBag,
  Shirt,
  Star
} from 'lucide-react'
import ImageUpload from './ImageUpload'

const PostCreation = ({ isOpen, onClose, onSubmit, type = 'snapfit' }) => {
  const [postData, setPostData] = useState({
    type: type, // 'snapfit' or 'threadboard'
    content: '',
    images: [],
    location: '',
    tags: [],
    visibility: 'public',
    // ThreadBoard specific fields
    title: '',
    price: '',
    condition: 'excellent',
    category: '',
    size: '',
    brand: '',
    isNegotiable: true,
    shippingOptions: []
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const conditions = [
    { value: 'new', label: 'New with tags', color: 'bg-green-100 text-green-800' },
    { value: 'excellent', label: 'Excellent', color: 'bg-blue-100 text-blue-800' },
    { value: 'good', label: 'Good', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'fair', label: 'Fair', color: 'bg-orange-100 text-orange-800' }
  ]

  const categories = [
    'Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Vintage', 'Designer', 'Casual', 'Formal'
  ]

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'
  ]

  const shippingOptions = [
    { id: 'pickup', label: 'Pickup only', price: 0 },
    { id: 'local', label: 'Local delivery', price: 200 },
    { id: 'countrywide', label: 'Countrywide shipping', price: 500 }
  ]

  const handleAddTag = () => {
    if (currentTag.trim() && !postData.tags.includes(currentTag.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImagesChange = (images) => {
    setPostData(prev => ({ ...prev, images }))
  }

  const handleShippingChange = (optionId, checked) => {
    setPostData(prev => ({
      ...prev,
      shippingOptions: checked
        ? [...prev.shippingOptions, optionId]
        : prev.shippingOptions.filter(id => id !== optionId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!postData.content.trim() && postData.images.length === 0) {
      alert('Please add some content or images')
      return
    }

    if (postData.type === 'threadboard') {
      if (!postData.title.trim() || !postData.price) {
        alert('Title and price are required for ThreadBoard posts')
        return
      }
    }

    setIsPosting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onSubmit(postData)
      
      // Reset form
      setPostData({
        type: type,
        content: '',
        images: [],
        location: '',
        tags: [],
        visibility: 'public',
        title: '',
        price: '',
        condition: 'excellent',
        category: '',
        size: '',
        brand: '',
        isNegotiable: true,
        shippingOptions: []
      })
      
      onClose()
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-apple-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {postData.type === 'snapfit' ? 'Share Your Look' : 'List Item for Sale'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ThreadBoard specific fields */}
          {postData.type === 'threadboard' && (
            <>
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  placeholder="e.g., Vintage Leather Jacket in Perfect Condition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Price (KSh) *
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                    <input
                      type="number"
                      required
                      value={postData.price}
                      onChange={(e) => setPostData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                      placeholder="2500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Condition *
                  </label>
                  <select
                    required
                    value={postData.condition}
                    onChange={(e) => setPostData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={postData.category}
                    onChange={(e) => setPostData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Size
                  </label>
                  <select
                    value={postData.size}
                    onChange={(e) => setPostData(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  >
                    <option value="">Select size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={postData.brand}
                    onChange={(e) => setPostData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                    placeholder="Brand name"
                  />
                </div>
              </div>

              {/* Negotiable checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={postData.isNegotiable}
                  onChange={(e) => setPostData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                  className="w-4 h-4 text-brand-orange-light bg-light-surface border-light-border rounded focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark dark:bg-dark-surface dark:border-dark-border"
                />
                <label htmlFor="negotiable" className="ml-2 text-sm text-light-text-primary dark:text-dark-text-primary">
                  Price is negotiable
                </label>
              </div>

              {/* Shipping Options */}
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
                  Shipping Options
                </label>
                <div className="space-y-2">
                  {shippingOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-apple">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.id}
                          checked={postData.shippingOptions.includes(option.id)}
                          onChange={(e) => handleShippingChange(option.id, e.target.checked)}
                          className="w-4 h-4 text-brand-orange-light bg-light-card border-light-border rounded focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark dark:bg-dark-card dark:border-dark-border"
                        />
                        <label htmlFor={option.id} className="ml-2 text-sm text-light-text-primary dark:text-dark-text-primary">
                          {option.label}
                        </label>
                      </div>
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        {option.price === 0 ? 'Free' : `KSh ${option.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Content/Description */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              {postData.type === 'snapfit' ? 'Caption' : 'Description'}
            </label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark resize-none"
              placeholder={
                postData.type === 'snapfit' 
                  ? "What's the story behind this look? Share styling tips, where you got the pieces, or just express yourself!"
                  : "Describe the item, its condition, fit, styling suggestions, or any other relevant details..."
              }
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Photos {postData.type === 'threadboard' && '*'}
            </label>
            <ImageUpload
              multiple={true}
              maxFiles={postData.type === 'threadboard' ? 8 : 10}
              onImagesChange={handleImagesChange}
              existingImages={postData.images}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                value={postData.location}
                onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-10 pr-3 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                placeholder="Nairobi, Kenya"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {postData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-brand-orange-light/10 dark:bg-brand-orange-dark/10 text-brand-orange-light dark:text-brand-orange-dark rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="w-full pl-10 pr-3 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  placeholder="Add a tag..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Visibility
            </label>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={postData.visibility === 'public'}
                  onChange={(e) => setPostData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-4 h-4 text-brand-orange-light bg-light-surface border-light-border focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark dark:bg-dark-surface dark:border-dark-border"
                />
                <Globe size={16} className="ml-2 mr-1 text-light-text-secondary dark:text-dark-text-secondary" />
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="followers"
                  checked={postData.visibility === 'followers'}
                  onChange={(e) => setPostData(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-4 h-4 text-brand-orange-light bg-light-surface border-light-border focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark dark:bg-dark-surface dark:border-dark-border"
                />
                <Users size={16} className="ml-2 mr-1 text-light-text-secondary dark:text-dark-text-secondary" />
                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">Followers only</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-6 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPosting ? 'Posting...' : (postData.type === 'snapfit' ? 'Share Look' : 'List Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostCreation
