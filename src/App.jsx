import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import leafBg from './assets/leaf.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { providers } from './data';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchByOpen, setIsSearchByOpen] = useState(false);

  const searchOptions = [
    "Nearby Location",
    "Province/City",
    "Referral Agency",
    "Provider Name"
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-green-600 tracking-tight">Pick A Childcare</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button 
                className="text-gray-600 hover:text-green-600 font-medium transition flex items-center gap-1 py-4"
                onMouseEnter={() => setIsSearchByOpen(true)}
                onMouseLeave={() => setIsSearchByOpen(false)}
              >
                Search By
                <svg className={`w-4 h-4 transition-transform duration-200 ${isSearchByOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`absolute left-0 mt-0 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 transition-all duration-200 ${isSearchByOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                onMouseEnter={() => setIsSearchByOpen(true)}
                onMouseLeave={() => setIsSearchByOpen(false)}
              >
                {searchOptions.map((option) => (
                  <a 
                    key={option}
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                  >
                    {option}
                  </a>
                ))}
              </div>
            </div>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition">For Providers</a>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition">Resources</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 font-medium hover:text-green-600">Login</button>
            <button className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg">Sign Up</button>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <div className="py-2">
              <button 
                onClick={() => setIsSearchByOpen(!isSearchByOpen)}
                className="flex items-center justify-between w-full text-gray-600 hover:text-green-600 font-medium"
              >
                Search By
                <svg className={`w-4 h-4 transition-transform duration-200 ${isSearchByOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSearchByOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-2 border-gray-50 pl-4">
                  {searchOptions.map((option) => (
                    <a key={option} href="#" className="text-sm text-gray-500 hover:text-green-600 py-1 transition">
                      {option}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium py-2">For Providers</a>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium py-2">Resources</a>
          </div>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            <button className="text-gray-600 font-medium py-2 text-left">Login</button>
            <button className="bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition w-full shadow-md">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, distance });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">where are you located</label>
          <input
            type="text"
            placeholder="City, Neighborhood or Zip"
            className="w-full pl-3 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex-1 relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">within what distance</label>
          <input
            type="text"
            placeholder="e.g. 5 miles, 10km..."
            className="w-full pl-3 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        <div className="md:w-32 flex items-end">
          <button type="submit" className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg h-[50px] md:h-auto">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

const ProviderCard = ({ provider }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
    <div className="relative h-48 sm:h-56">
      <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold text-gray-800 shadow-sm">
        {provider.price}
      </div>
    </div>
    <div className="p-5 sm:p-6">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{provider.type}</span>
        <div className="flex items-center text-yellow-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-sm font-bold text-gray-700">{provider.rating}</span>
          <span className="ml-1 text-xs text-gray-400">({provider.reviews})</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition">{provider.name}</h3>
      <p className="text-sm text-gray-500 mb-4 flex items-center">
        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {provider.location}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {provider.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-md">
            {tag}
          </span>
        ))}
      </div>
      <button className="w-full py-2.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-green-600 hover:text-white transition duration-200">
        View Profile
      </button>
    </div>
  </div>
);



const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-green-600 p-1 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">PickAChildcare</span>
          </div>
          <p className="max-w-sm text-gray-400">Making it easier for parents to find the perfect care for their children. Trusted by thousands of families nationwide.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">For Parents</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Search Providers</a></li>
            <li><a href="#" className="hover:text-white transition">Safety Guides</a></li>
            <li><a href="#" className="hover:text-white transition">Resources</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">© 2025 PickAChildcare Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-gray-500 hover:text-white transition">Twitter</a>
          <a href="#" className="text-gray-500 hover:text-white transition">Instagram</a>
          <a href="#" className="text-gray-500 hover:text-white transition">Facebook</a>
        </div>
      </div>
    </div>
  </footer>
);


const SidebarFilters = ({ filters, setFilters, availableTypes }) => {
  const prices = ['$', '$$', '$$$', '$$$$'];

  const toggleType = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ ...filters, types: newTypes });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Type of Care</h3>
        <div className="space-y-2">
          {availableTypes.map(type => (
            <label key={type} className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
            checked={filters.types.includes(type)}
            onChange={() => toggleType(type)}
          />
          <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">{type}</span>
        </label>
      ))}
    </div>
  </div>

  <div>
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
    <div className="flex gap-2">
      {prices.map(price => (
        <button
          key={price}
          onClick={() => setFilters({ ...filters, price: filters.price === price ? null : price })}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
            filters.price === price
              ? 'bg-green-600 border-green-600 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-600 hover:border-green-600 hover:text-green-600'
          }`}
        >
              {price}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Minimum Rating</h3>
          <span className="text-green-600 font-bold text-sm">{filters.rating}+</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
          <span>0.0</span>
          <span>2.5</span>
          <span>5.0</span>
        </div>
      </div>

      <button
        onClick={() => setFilters({ types: [], price: null, rating: 0 })}
        className="w-full py-3 text-sm font-bold text-gray-500 hover:text-green-600 border border-gray-200 hover:border-green-600 rounded-xl transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

const ListView = ({ providers }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {providers.map(provider => (
      <ProviderCard key={provider.id} provider={provider} />
    ))}
  </div>
);

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });
  return null;
};


const MapView = ({ providers, selectedProvider, setSelectedProvider }) => {
  const defaultCenter = [40.7128, -74.0060]; // NYC default
  const center = providers.length > 0 
    ? [providers[0].coordinates.lat, providers[0].coordinates.lng]
    : defaultCenter;

  const iconMapping = {
    'Daycare Center': { color: '#16a34a', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>' },
    'Home-based': { color: '#059669', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
    'Preschool': { color: '#7c3aed', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>' },
    'Nursery': { color: '#db2777', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12h-2m-2 0H5a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2z" /></svg>' },
    'After-School': { color: '#ea580c', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    'Montessori': { color: '#4f46e5', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>' }
  };

  const createCustomIcon = (type, isSelected) => {
    const config = iconMapping[type] || iconMapping['Daycare Center'];
    return L.divIcon({
      html: `<div class="marker-container ${isSelected ? 'selected' : ''}" style="background-color: ${config.color}">
               ${config.html}
             </div>`,
      className: 'custom-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });
  };

  return (
    <div className="w-full h-[600px] bg-green-50 rounded-3xl border border-gray-200 relative overflow-hidden shadow-inner">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        {providers.map((provider) => (
          <Marker 
            key={provider.id} 
            position={[provider.coordinates.lat, provider.coordinates.lng]}
            icon={createCustomIcon(provider.type, selectedProvider?.id === provider.id)}
            riseOnHover={true}
            zIndexOffset={selectedProvider?.id === provider.id ? 1000 : 0}
            eventHandlers={{
              click: (e) => {
                setSelectedProvider(provider);
              }
            }}
          >
            <Popup className="provider-popup" maxWidth={300}>
              <div className="flex flex-col overflow-hidden bg-white rounded-xl">
                <div className="h-32 w-full overflow-hidden">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{provider.type}</span>
                    <div className="flex items-center text-yellow-500">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-xs font-bold text-gray-700">{provider.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-2">{provider.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{provider.description}</p>
                  <button className="w-full py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm">
                    View More Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchCriteria, setSearchCriteria] = useState({ location: '', distance: '' });
  const [filters, setFilters] = useState({
    types: [],
    price: null,
    rating: 0
  });

  const availableTypes = [...new Set(providers.map(p => p.type))];

  const filteredProviders = providers.filter(p => {
    const matchLocation = p.location.toLowerCase().includes(searchCriteria.location.toLowerCase());
    const matchType = filters.types.length === 0 || filters.types.includes(p.type);
    const matchPrice = !filters.price || p.price === filters.price;
    const matchRating = p.rating >= filters.rating;

    return matchLocation && matchType && matchPrice && matchRating;
  });

  const handleSearch = ({ location, distance }) => {
    setHasSearched(true);
    setSearchCriteria({ location, distance });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section 
          className="pt-12 pb-20 md:pt-20 md:pb-32 px-4 text-center text-white relative overflow-hidden bg-green-800"
          style={{
            backgroundImage: `url(${leafBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-green-900/60 pointer-events-none"></div>

          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-10 tracking-tight leading-tight">
              <span className="bg-white text-green-900 px-4 py-1 rounded-md shadow-lg box-decoration-clone">
                Find the perfect care for your little one
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover top-rated daycares, preschools, and home care providers in your neighborhood.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        {/* Results Section */}
        {hasSearched && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-500 mt-1">Showing {filteredProviders.length} providers in your area</p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition duration-200 ${viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    List
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition duration-200 ${viewMode === 'map' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.485V5.111a2 2 0 011.106-1.789l5.447-2.724a2 2 0 011.894 0l5.447 2.724a2 2 0 011.106 1.789v10.374a2 2 0 01-1.106 1.789L10.894 20a2 2 0 01-1.894 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16m6-12v12" />
                    </svg>
                    Map
                  </button>
                </div>

                <button 
                  onClick={() => { 
                    setSearchCriteria({ location: '', distance: '' }); 
                    setHasSearched(false);
                    setFilters({ types: [], price: null, rating: 0 });
                  }}
                  className="text-green-600 font-bold hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                  <SidebarFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                    availableTypes={availableTypes} 
                  />
                </div>
              </aside>

              {/* Content Area */}
              <div className="flex-1">
                {filteredProviders.length > 0 ? (
                  viewMode === 'list' ? (
                    <ListView providers={filteredProviders} />
                  ) : (
                    <MapView 
                      providers={filteredProviders} 
                      selectedProvider={selectedProvider}
                      setSelectedProvider={setSelectedProvider}
                    />
                  )
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-5xl mb-4 text-gray-300">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No providers found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any childcare providers matching your search. Try broadening your criteria!</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
