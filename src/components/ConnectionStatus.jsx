import { Wifi, WifiOff, Loader2 } from 'lucide-react'

const ConnectionStatus = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10'
        }
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Connecting...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          animate: 'animate-spin'
        }
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10'
        }
      default:
        return {
          icon: WifiOff,
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor} ${className}`}>
      <Icon size={14} className={`${config.color} ${config.animate || ''}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  )
}

export default ConnectionStatus
