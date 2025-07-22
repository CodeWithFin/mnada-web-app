import { useState, useEffect } from 'react'
import { 
  Heart, 
  Award, 
  MapPin, 
  Calendar, 
  Users, 
  Shirt,
  Camera,
  Info,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Gift
} from 'lucide-react'

const MuseumMnada = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [donations, setDonations] = useState([])
  const [userContributions, setUserContributions] = useState(0)
  const [showDonationForm, setShowDonationForm] = useState(false)

  // Mock data for museum pieces
  const museumPieces = [
    {
      id: 1,
      title: 'Traditional Kikuyu Wedding Dress',
      era: '1960s',
      category: 'traditional',
      story: 'This beautiful wedding dress was worn by Mama Grace Wanjiku during her wedding in 1963. Made from imported silk and adorned with traditional Kikuyu beadwork.',
      images: ['/api/placeholder/400/500', '/api/placeholder/400/500'],
      donor: 'Grace Wanjiku Family',
      donationDate: '2024-01-15',
      culturalSignificance: 'Represents the blend of traditional and modern fashion in post-independence Kenya',
      condition: 'Excellent',
      location: 'Nairobi National Museum',
      verified: true,
      likes: 234,
      views: 1200
    },
    {
      id: 2,
      title: 'Maasai Warrior Shuka',
      era: '1950s',
      category: 'traditional',
      story: 'This red shuka belonged to Mzee John Sankale, a respected Maasai elder. The intricate patterns tell stories of his journey to warriorhood.',
      images: ['/api/placeholder/400/500'],
      donor: 'Sankale Cultural Foundation',
      donationDate: '2024-02-20',
      culturalSignificance: 'Sacred garment representing Maasai heritage and the transition from boyhood to warriorhood',
      condition: 'Good',
      location: 'Kajiado Cultural Center',
      verified: true,
      likes: 189,
      views: 890
    },
    {
      id: 3,
      title: 'Colonial Era School Uniform',
      era: '1940s',
      category: 'colonial',
      story: 'Worn by students at Alliance High School, this uniform represents the educational journey of many Kenyan leaders.',
      images: ['/api/placeholder/400/500', '/api/placeholder/400/500'],
      donor: 'Alliance High School Alumni',
      donationDate: '2024-01-30',
      culturalSignificance: 'Symbolizes the role of education in Kenya\'s independence movement',
      condition: 'Fair',
      location: 'Alliance High School Museum',
      verified: true,
      likes: 156,
      views: 670
    },
    {
      id: 4,
      title: '1990s Nairobi Street Fashion',
      era: '1990s',
      category: 'modern',
      story: 'A vibrant outfit that captured the spirit of Nairobi\'s emerging urban culture in the 1990s.',
      images: ['/api/placeholder/400/500'],
      donor: 'Urban Culture Collective',
      donationDate: '2024-03-05',
      culturalSignificance: 'Represents the birth of contemporary Kenyan street fashion',
      condition: 'Excellent',
      location: 'Nairobi Gallery',
      verified: false,
      likes: 98,
      views: 450
    }
  ]

  const categories = [
    { id: 'all', name: 'All Pieces', count: museumPieces.length },
    { id: 'traditional', name: 'Traditional', count: museumPieces.filter(p => p.category === 'traditional').length },
    { id: 'colonial', name: 'Colonial Era', count: museumPieces.filter(p => p.category === 'colonial').length },
    { id: 'modern', name: 'Modern', count: museumPieces.filter(p => p.category === 'modern').length }
  ]

  const contributionLevels = [
    { level: 'Curator', minDonations: 10, benefits: ['Priority verification', 'Curator badge', 'Monthly newsletter'], color: 'text-purple-600' },
    { level: 'Keeper', minDonations: 5, benefits: ['Keeper badge', 'Special events access'], color: 'text-blue-600' },
    { level: 'Guardian', minDonations: 2, benefits: ['Guardian badge', 'Early access to new pieces'], color: 'text-green-600' },
    { level: 'Friend', minDonations: 1, benefits: ['Friend badge', 'Museum updates'], color: 'text-orange-600' }
  ]

  const filteredPieces = selectedCategory === 'all' 
    ? museumPieces 
    : museumPieces.filter(piece => piece.category === selectedCategory)

  const getUserLevel = () => {
    return contributionLevels.find(level => userContributions >= level.minDonations) || 
           { level: 'Visitor', benefits: ['Browse museum pieces'], color: 'text-gray-600' }
  }

  const DonationForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      era: '',
      category: 'traditional',
      story: '',
      culturalSignificance: '',
      condition: 'excellent',
      images: []
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(formData)
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-light-card dark:bg-dark-card rounded-apple-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                Donate to Museum Mnada
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
              >
                ×
              </button>
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Help preserve Kenyan fashion heritage by donating your culturally significant pieces
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Piece Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                placeholder="e.g., Traditional Luo Wedding Dress"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Era *
                </label>
                <input
                  type="text"
                  required
                  value={formData.era}
                  onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                  className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                  placeholder="e.g., 1960s, Pre-independence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                >
                  <option value="traditional">Traditional</option>
                  <option value="colonial">Colonial Era</option>
                  <option value="modern">Modern</option>
                  <option value="ceremonial">Ceremonial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Story & History *
              </label>
              <textarea
                required
                rows={4}
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                placeholder="Tell the story of this piece - who wore it, when, and what makes it special..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Cultural Significance *
              </label>
              <textarea
                required
                rows={3}
                value={formData.culturalSignificance}
                onChange={(e) => setFormData(prev => ({ ...prev, culturalSignificance: e.target.value }))}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                placeholder="Explain the cultural importance and what this piece represents..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Condition *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="needs-restoration">Needs Restoration</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 transition-colors"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-orange-light to-brand-orange-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Museum Mnada
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Preserving Kenya's Fashion Heritage, One Piece at a Time
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{museumPieces.length}</div>
                <div className="text-sm opacity-75">Pieces Preserved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">150+</div>
                <div className="text-sm opacity-75">Contributors</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-75">Years of History</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Status */}
        <div className="bg-light-card dark:bg-dark-card rounded-apple-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-orange-light to-brand-orange-dark rounded-full flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {getUserLevel().level}
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {userContributions} contributions made
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDonationForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 transition-colors"
            >
              <Gift size={20} />
              <span>Donate a Piece</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-apple-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                  : 'bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary hover:bg-light-hover dark:hover:bg-dark-hover'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Museum Pieces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPieces.map(piece => (
            <div key={piece.id} className="bg-light-card dark:bg-dark-card rounded-apple-xl overflow-hidden shadow-apple">
              {/* Image */}
              <div className="relative aspect-[3/4] bg-light-surface dark:bg-dark-surface">
                <img
                  src={piece.images[0]}
                  alt={piece.title}
                  className="w-full h-full object-cover"
                />
                {piece.verified && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {piece.era}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 line-clamp-2">
                  {piece.title}
                </h3>
                
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-3">
                  {piece.story}
                </p>

                <div className="flex items-center justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3">
                  <div className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {piece.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(piece.donationDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    By {piece.donor}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <div className="flex items-center">
                      <Heart size={12} className="mr-1" />
                      {piece.likes}
                    </div>
                    <div>{piece.views} views</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-light-border dark:border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded ${
                      piece.condition === 'Excellent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : piece.condition === 'Good'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {piece.condition}
                    </span>
                    <button className="text-brand-orange-light dark:text-brand-orange-dark hover:underline text-xs">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-light-card dark:bg-dark-card rounded-apple-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              About Museum Mnada
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Museum Mnada is our community-driven initiative to preserve and celebrate Kenya's rich fashion heritage. 
              From traditional garments to colonial-era pieces and modern fashion milestones, we're building a digital 
              archive that tells the story of how Kenyans have expressed themselves through clothing across generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange-light/10 dark:bg-brand-orange-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="text-brand-orange-light dark:text-brand-orange-dark" size={24} />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Preserve Heritage
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Help preserve important pieces of Kenyan fashion history for future generations to learn from and appreciate.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange-light/10 dark:bg-brand-orange-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-brand-orange-light dark:text-brand-orange-dark" size={24} />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Community Driven
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Every piece is contributed by community members who want to share their family's fashion stories and heritage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-orange-light/10 dark:bg-brand-orange-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-brand-orange-light dark:text-brand-orange-dark" size={24} />
              </div>
              <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                Digital Archive
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                High-quality documentation ensures these pieces are preserved digitally, accessible to researchers and enthusiasts worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm
          onClose={() => setShowDonationForm(false)}
          onSubmit={(data) => {
            console.log('New donation:', data)
            setUserContributions(prev => prev + 1)
            alert('Thank you for your donation! It will be reviewed by our curators.')
          }}
        />
      )}
    </div>
  )
}

export default MuseumMnada
