import { useState, useMemo } from 'react'
import { LocationIQSDK } from './lib/location-iq'
import type { AutocompleteResult, LocationIQResult, DirectionsResult } from './lib/location-iq'
import { LocationInput } from './components/LocationInput'
import { Map, Navigation, Info, Key, CheckCircle2, Route } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_LOCATIONIQ_API_KEY || '')
  const [origin, setOrigin] = useState<AutocompleteResult | LocationIQResult | null>(null)
  const [destination, setDestination] = useState<AutocompleteResult | LocationIQResult | null>(null)
  const [directions, setDirections] = useState<DirectionsResult | null>(null)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)

  const sdk = useMemo(() => new LocationIQSDK(apiKey), [apiKey])

  const handleGetDirections = async () => {
    if (!origin || !destination) return
    setIsLoadingDirections(true)
    try {
      const result = await sdk.directions([
        [parseFloat(origin.lon), parseFloat(origin.lat)],
        [parseFloat(destination.lon), parseFloat(destination.lat)]
      ])
      setDirections(result)
    } catch (error) {
      console.error('Directions error:', error)
    } finally {
      setIsLoadingDirections(false)
    }
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          LocationIQ Places
        </motion.h1>
        <p style={{ color: 'var(--text-muted)' }}> Premium integration of LocationIQ Maps & Places APIs</p>
      </header>

      {!import.meta.env.VITE_LOCATIONIQ_API_KEY && !apiKey.startsWith('pk.') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel card"
          style={{ marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Key className="text-primary" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>API Key Required</div>
              <input
                type="text"
                className="search-input"
                style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}
                placeholder="Enter your LocationIQ Public Token (pk...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <section>
          <div className="glass-panel card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={20} className="text-primary" />
              Place Search
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Forward Geocoding & Autocomplete
              </label>
              <LocationInput
                sdk={sdk}
                onSelect={(res) => setOrigin(res)}
                placeholder="Search for origin..."
              />
            </div>

            {origin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel"
                style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={16} className="text-primary" style={{ marginTop: '0.25rem' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{(origin as any).display_place || (origin as any).display_name.split(',')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{origin.lat}, {origin.lon}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="glass-panel card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Route size={20} className="text-primary" />
              Directions
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Destination
              </label>
              <LocationInput
                sdk={sdk}
                onSelect={(res) => setDestination(res)}
                placeholder="Search for destination..."
              />
            </div>

            <button
              onClick={handleGetDirections}
              disabled={!origin || !destination || isLoadingDirections}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoadingDirections ? 'Calculating...' : 'Get Directions'}
            </button>
          </div>
        </section>

        <section>
          <div className="glass-panel card" style={{ height: '100%', minHeight: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} className="text-primary" />
              Results
            </h2>

            <AnimatePresence mode="wait">
              {directions ? (
                <motion.div
                  key="directions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distance</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {(directions.routes[0].distance / 1000).toFixed(1)} km
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {Math.round(directions.routes[0].duration / 60)} min
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {directions.routes[0].legs[0].steps.slice(0, 5).map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                        <div className="badge">{idx + 1}</div>
                        <div style={{ fontSize: '0.85rem' }}>{step.maneuver.instruction}</div>
                      </div>
                    ))}
                    {directions.routes[0].legs[0].steps.length > 5 && (
                      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        + {directions.routes[0].legs[0].steps.length - 5} more steps
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}
                >
                  <Navigation size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <p>Select origin and destination to see results</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Built with LocationIQ APIs & React
      </footer>
    </div>
  )
}

export default App
