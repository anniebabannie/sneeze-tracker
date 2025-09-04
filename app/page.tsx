'use client'

import { useState, useEffect } from 'react'
import SneezeModal from '@/components/SneezModal'

interface Sneeze {
  id: string
  intensity: number
  date: string
  location: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [sneezes, setSneezes] = useState<Sneeze[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSneezes()
  }, [])

  const fetchSneezes = async () => {
    try {
      const response = await fetch('/api/sneezes')
      if (response.ok) {
        const data = await response.json()
        setSneezes(data)
      }
    } catch (error) {
      console.error('Failed to fetch sneezes:', error)
    } finally {
      setLoading(false)
    }
  }

  const intensityEmojis = ['🤧', '😤', '🌬️', '💨', '🌪️']
  const intensityLabels = ['Tiny', 'Small', 'Medium', 'Big', 'Massive']
  const intensityColors = [
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const getTodayCount = () => {
    const today = new Date().toDateString()
    return sneezes.filter(s => new Date(s.date).toDateString() === today).length
  }

  const getAverageIntensity = () => {
    if (sneezes.length === 0) return 0
    const sum = sneezes.reduce((acc, s) => acc + s.intensity, 0)
    return (sum / sneezes.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🤧</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sneeze Tracker
              </h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
            >
              <span className="text-lg">➕</span>
              Record Sneeze
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sneezes</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {sneezes.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today's Count</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {getTodayCount()}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg. Intensity</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {getAverageIntensity()}
            </div>
          </div>
        </div>

        {/* Sneeze List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Sneezes
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="px-6 py-12 text-center text-gray-500">Loading...</div>
            ) : sneezes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-4xl mb-3">🤧</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No sneezes recorded yet. Click "Record Sneeze" to add your first one!
                </p>
              </div>
            ) : (
              sneezes.map((sneeze) => (
                <div key={sneeze.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{intensityEmojis[sneeze.intensity - 1]}</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${intensityColors[sneeze.intensity - 1]}`}>
                          {intensityLabels[sneeze.intensity - 1]}
                        </span>
                        {sneeze.location && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            📍 {sneeze.location}
                          </span>
                        )}
                      </div>
                      {sneeze.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">
                          {sneeze.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                      {formatDate(sneeze.date)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <SneezeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSneezeAdded={fetchSneezes}
      />
    </div>
  )
}