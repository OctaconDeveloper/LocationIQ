import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationIQSDK } from '../lib/location-iq';
import type { AutocompleteResult, LocationIQResult } from '../lib/location-iq';

interface LocationInputProps {
    sdk: LocationIQSDK;
    onSelect: (result: AutocompleteResult | LocationIQResult) => void;
    placeholder?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({ sdk, onSelect, placeholder }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<AutocompleteResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(async () => {
            if (query.trim().length >= 3) {
                setIsSearching(true);
                try {
                    const suggestions = await sdk.autocomplete(query);
                    setResults(suggestions);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Autocomplete error:', error);
                    setResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 400);

        return () => clearTimeout(debounceTimer);
    }, [query, sdk]);

    const handleSelect = (item: AutocompleteResult) => {
        setQuery(item.display_name);
        setIsOpen(false);
        onSelect(item);
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsSearching(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await sdk.reverseGeocoding(latitude, longitude);
                    setQuery(result.display_name);
                    onSelect(result);
                } catch (error) {
                    console.error('Reverse geocoding error:', error);
                } finally {
                    setIsSearching(false);
                }
            });
        }
    };

    return (
        <div className="input-container" ref={dropdownRef}>
            <Search className="search-icon" size={18} />
            <input
                type="text"
                className="search-input"
                placeholder={placeholder || "Search for a place..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 3 && setIsOpen(true)}
            />

            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem' }}>
                {isSearching ? (
                    <Loader2 className="animate-spin text-muted" size={18} />
                ) : (
                    <button
                        onClick={handleGetCurrentLocation}
                        style={{ background: 'transparent', padding: '0.25rem', color: 'var(--text-muted)' }}
                        title="Use current location"
                    >
                        <MapPin size={18} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel autocomplete-dropdown"
                    >
                        {results.map((item) => (
                            <div
                                key={item.place_id}
                                className="autocomplete-item"
                                onClick={() => handleSelect(item)}
                            >
                                <div style={{ minWidth: '32px' }}>
                                    <Navigation size={16} className="text-primary" />
                                </div>
                                <div>
                                    <div className="name">{item.display_place}</div>
                                    <div className="address">{item.display_address}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
