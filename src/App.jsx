import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import leafBg from './assets/bg.jpg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { providers, agencies, addresses, spotsAvailable } from './data';
import SearchAutocomplete from './SearchAutocomplete';
import WaitlistForm from './WaitlistForm';

const AgencyModal = ({ agency, onClose }) => {
  if (!agency) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
      >
        <div className="bg-green-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Information</h2>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Name</label>
            <p className="text-xl font-bold text-gray-900">{agency.name}</p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone</label>
              <a href={`tel:${agency.phone}`} className="text-gray-900 font-bold hover:text-green-600 transition">{agency.phone}</a>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 012-2V7a2 2 0 01-2-2H5a2 2 0 01-2 2v10a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email</label>
              <a href={`mailto:${agency.email}`} className="text-gray-900 font-bold hover:text-green-600 transition">{agency.email}</a>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

const AgesServedModal = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
      >
        <div className="bg-green-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Ages Served</h2>
        </div>
        <div className="p-8 space-y-4">
          <p className="text-gray-600 font-medium mb-4">This provider offers care for the following age groups:</p>
          <div className="space-y-2">
            {provider.AgesServed && provider.AgesServed.map((age, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-900 font-bold">{age}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SpotsAvailableModal = ({ provider, onClose }) => {
  if (!provider) return null;
  const providerSpots = spotsAvailable.filter(s => s.providerId === provider.id);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
      >
        <div className="bg-green-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Availability Details</h2>
          <p className="text-green-100 text-sm mt-1">{provider.name}</p>
        </div>
        <div className="p-8">
          {providerSpots.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Age Group</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Part Time</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Full Time</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {providerSpots.map((spot) => (
                    <tr key={spot.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-bold text-gray-900">{spot.AgeServed}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-lg font-bold text-xs ${spot.partTime > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {spot.partTime} spots
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-lg font-bold text-xs ${spot.fullTime > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {spot.fullTime} spots
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm font-medium">
                        {new Date(spot.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No detailed availability information provided.
            </div>
          )}
          <button 
            onClick={onClose}
            className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper for distance calculation (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const Navbar = ({ onSearchTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchByOpen, setIsSearchByOpen] = useState(false);
  const navigate = useNavigate();

  const searchOptions = [
    { label: "Nearby Location", value: "Nearby" },
    { label: "Province/City", value: "Province/City" },
    { label: "Agency name", value: "Agency" },
    { label: "Business/Provider name", value: "Name" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-green-600 tracking-tight">Pick A Childcare</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-green-600 font-medium transition flex items-center gap-1 py-4 cursor-pointer"
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
                  <button 
                    key={option.value}
                    onClick={() => {
                      onSearchTypeChange(option.value);
                      setIsSearchByOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium transition">For Providers</a>
            <Link to="/parents" className="text-gray-600 hover:text-green-600 font-medium transition">Parents</Link>
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
                onClick={() => {
                  navigate('/');
                  setIsSearchByOpen(!isSearchByOpen);
                }}
                className="flex items-center justify-between w-full text-gray-600 hover:text-green-600 font-medium cursor-pointer"
              >
                Search By
                <svg className={`w-4 h-4 transition-transform duration-200 ${isSearchByOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSearchByOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-2 border-gray-50 pl-4">
                  {searchOptions.map((option) => (
                    <button 
                      key={option.value} 
                      onClick={() => {
                        onSearchTypeChange(option.value);
                        setIsOpen(false);
                        setIsSearchByOpen(false);
                      }}
                      className="text-left text-sm text-gray-500 hover:text-green-600 py-1 transition"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#" className="text-gray-600 hover:text-green-600 font-medium py-2">For Providers</a>
            <Link to="/parents" className="text-gray-600 hover:text-green-600 font-medium py-2" onClick={() => setIsOpen(false)}>Parents</Link>
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

const SearchBar = ({ onSearch, searchType, setSearchType }) => {
  const [location, setLocation] = useState('');
  const [nearbyLocation, setNearbyLocation] = useState(null);
  const [distance, setDistance] = useState('');
  const [providerName, setProviderName] = useState('');
  const [agencyName, setAgencyName] = useState('');

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [community, setCommunity] = useState('');

  // Reset states when search type changes
  useEffect(() => {
    setLocation('');
    setNearbyLocation(null);
    setDistance('');
    setProviderName('');
    setAgencyName('');
    setProvince('');
    setCity('');
    setCommunity('');
  }, [searchType]);

  const locationData = addresses.reduce((acc, addr) => {
    const p = addr.province;
    const c = addr.city;
    const comm = addr.community;
    
    if (!acc[p]) acc[p] = {};
    if (!acc[p][c]) acc[p][c] = [];
    if (!acc[p][c].includes(comm)) acc[p][c].push(comm);
    
    return acc;
  }, {});

  const searchTypes = ['Nearby', 'Province/City', 'Agency', 'Name'];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchType === 'Province/City') {
      onSearch({ province, city, community }, true);
    } else if (searchType === 'Name') {
      onSearch({ location: providerName.trim(), distance: '' }, true);
    } else if (searchType === 'Agency') {
      onSearch({ location: agencyName.trim(), distance: '' }, true);
    } else if (searchType === 'Nearby') {
      onSearch({ 
        location: nearbyLocation ? nearbyLocation.label : location.trim(), 
        coordinates: nearbyLocation ? { lat: nearbyLocation.lat, lng: nearbyLocation.lon } : null,
        distance 
      }, true);
    } else {
      onSearch({ location: location.trim(), distance }, true);
    }
  };

  const providerSuggestions = providers.map((p) => ({
    label: p.name,
    value: p.name,
    sublabel: `${p.type} • ${p.location}`,
  }));
  const agencySuggestions = agencies.map((a) => ({
    label: a.name,
    value: a.name,
  }));

  return (
    <div className="w-[90%] mx-auto bg-white shadow-xl p-4 sm:p-6 border border-gray-100 rounded-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto">
        <div className="flex-none w-full md:w-80 relative">
          <select
            className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none font-medium"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              onSearch({}); // Reset criteria when switching types
            }}
          >
            {searchTypes.map(type => (
              <option key={type} value={type}>
                {type === 'Name' ? 'Search by Business/Provider name' : 
                 type === 'Agency' ? 'Search by Agency' : 
                 type === 'Nearby' ? 'Search by Nearby location' :
                 `Search by ${type}`}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {searchType === 'Name' ? (
          <div className="flex-1">
            <SearchAutocomplete
              suggestions={providerSuggestions}
              value={providerName}
              onChange={setProviderName}
              onSelect={(item) => {
                setProviderName(item.value);
                onSearch({ location: item.value, distance: "" });
              }}
              placeholder="Enter a business or provider name..."
            />
          </div>
        ) : searchType === 'Agency' ? (
          <div className="flex-1">
            <SearchAutocomplete
              suggestions={agencySuggestions}
              value={agencyName}
              onChange={setAgencyName}
              onSelect={(item) => {
                setAgencyName(item.value);
                onSearch({ location: item.value, distance: "" });
              }}
              placeholder="Enter an agency name..."
            />
          </div>
        ) : searchType === 'Province/City' ? (
          <>
            <div className="flex-[1.5] relative">
              <select
                className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setCity('');
                  setCommunity('');
                }}
              >
                <option value="">Select Province</option>
                {Object.keys(locationData).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 relative">
              <select
                className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCommunity('');
                }}
                disabled={!province}
              >
                <option value="">Select City</option>
                {province && Object.keys(locationData[province]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 relative">
              <select
                className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                disabled={!city}
              >
                <option value="">Select Community</option>
                {city && locationData[province][city].map(comm => (
                  <option key={comm} value={comm}>{comm}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 relative">
              <SearchAutocomplete
                isAsync={true}
                onSelect={setNearbyLocation}
                onChange={setLocation}
                value={location}
                placeholder="Your location"
              />
            </div>
            <div className="flex-1 relative">
              <div className="relative">
                <select
                  className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                >
                  <option value="">Within distance</option>
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="15">15 km</option>
                  <option value="20">20 km</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="md:w-32 flex items-end">
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg h-[50px] md:h-auto cursor-pointer relative z-50"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

/* provider card */

const ProviderCard = ({ provider, onAgencyClick, onAgesClick, onSpotsClick }) => {
  const addressEntry = addresses.find((a) => a.providerId === provider.id);
  const agency = agencies.find((a) => a.id === provider.agencyId);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-blue-400 group flex flex-col">
      {/* Top Row: Type and Spots */}
      <div className="flex justify-between items-start pt-3 sm:pt-4 px-3 sm:px-4 mb-2 ml-[80px] sm:ml-[104px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{provider.type}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAgesClick(provider);
            }}
            className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border-2 border-blue-600 uppercase tracking-tight hover:bg-blue-600 hover:text-white transition cursor-pointer"
          >
            Ages Served
          </button>
          {provider.type === "Licensed Home-based" && agency && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAgencyClick(agency);
              }}
              className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border-2 border-blue-600 uppercase tracking-tight hover:bg-blue-600 hover:text-white transition cursor-pointer"
            >
              Agency: {agency.name}
            </button>
          )}
        </div>
        <div>
          {provider.spotsAvailable > 0 ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSpotsClick(provider);
              }}
              className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border-2 border-green-600 uppercase tracking-tight hover:bg-green-600 hover:text-white transition cursor-pointer"
            >
              {provider.spotsAvailable} spots available
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/waitlist/${provider.id}`);
              }}
              className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full border-2 border-red-600 uppercase tracking-tight hover:bg-red-600 hover:text-white transition cursor-pointer"
            >
              Waitlist
            </button>
          )}
        </div>
      </div>

      {/* Horizontal line right below the type along the width of the card */}
      <div className="border-b border-blue-600 w-full mb-3"></div>

      <div className="flex items-start pb-3 sm:pb-4 px-3 sm:px-4 gap-4 sm:gap-6">
        <div 
          onClick={() => navigate(`/provider/${provider.id}`)} 
          className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center cursor-pointer"
        >
          <img src={provider.image} alt={provider.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <button 
            onClick={() => navigate(`/provider/${provider.id}`)}
            className="text-xl font-bold text-gray-900 mb-0.5 group-hover:text-green-600 transition text-left cursor-pointer hover:underline"
          >
            {provider.name}
          </button>
          <p className="text-sm text-gray-500 mb-2 flex items-center flex-wrap">
            <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {addressEntry ? (
              <span>
                {addressEntry.fullAddress.split(addressEntry.city)[0]}
                <span className="font-bold text-green-700 bg-green-50 px-1 rounded mx-0.5">{addressEntry.city}</span>
                {addressEntry.fullAddress.split(addressEntry.city).slice(1).join(addressEntry.city)}
              </span>
            ) : (
              <span className="font-bold text-green-700 bg-green-50 px-1 rounded">{provider.location}</span>
            )}
          </p>

          <div className="border-b border-blue-300 w-full mb-3"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {provider.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[11px] font-bold uppercase rounded-md">
                  {tag}
                </span>
              ))}
              {provider.mealsProvided && (
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-bold uppercase rounded-md">
                  Meals Provided
                </span>
              )}
              {provider.snackProvided && (
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold uppercase rounded-md">
                  Snacks Provided
                </span>
              )}
            </div>

            <button 
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="text-green-600 text-sm font-bold hover:underline cursor-pointer"
            >
              View Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ***********************************
//          Footer
// ***********************************
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

// ***********************************
//          Side Bar Filter
// ***********************************
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group focus:outline-none"
      >
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider group-hover:text-green-600 transition">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-green-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

const SidebarFilters = ({ filters, setFilters, availableTypes }) => {
  const agesServed = [
    "Infant (0-12 month)",
    "Pre-toddler (1-17 months)",
    "Toddler (18 months - 2 yrs)",
    "Preschool (3 yrs - 4yrs)",
    "School (5 yrs and older)"
  ];
  const mealOptions = [
    "Meals Provided",
    "Snack Provided"
  ];

  const toggleSpots = () => {
    setFilters({ ...filters, spotsOnly: !filters.spotsOnly });
  };

  const toggleRegistered = () => {
    setFilters({ ...filters, registeredOnly: !filters.registeredOnly });
  };

  const toggleType = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    setFilters({ ...filters, types: newTypes });
  };

  const toggleAgesServed = (age) => {
    const newAges = filters.agesServed.includes(age)
      ? filters.agesServed.filter(a => a !== age)
      : [...filters.agesServed, age];
    setFilters({ ...filters, agesServed: newAges });
  };

  const toggleMealOption = (option) => {
    const newMeals = filters.mealOptions.includes(option)
      ? filters.mealOptions.filter(o => o !== option)
      : [...filters.mealOptions, option];
    setFilters({ ...filters, mealOptions: newMeals });
  };

  const scheduleOptions = [
    "Overnight",
    "Before School",
    "After School",
    "Weekend",
    "Drop-in",
    "Open Holidays"
  ];

  const toggleScheduleOption = (option) => {
    const newSchedules = filters.scheduleOptions.includes(option)
      ? filters.scheduleOptions.filter(o => o !== option)
      : [...filters.scheduleOptions, option];
    setFilters({ ...filters, scheduleOptions: newSchedules });
  };

  return (
    <div className="space-y-2">
      <div  style={{backgroundColor: "lightblue"}} className="flex items-center gap-2 p-3 rounded-xl">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-900">Filter Childcare</h2>
      </div>

      <div className="space-y-1.5">
        <AccordionItem title="Availability">
          <div className="space-y-2">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                checked={filters.spotsOnly}
                onChange={toggleSpots}
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">Spots available</span>
            </label>
          </div>
        </AccordionItem>

        <AccordionItem title="Childcare Type">
          <div className="space-y-2">
            {availableTypes.map(type => (
              <React.Fragment key={type}>
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                    checked={filters.types.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">{type}</span>
                </label>
                {type === "Licensed Home-based" && (
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                      checked={filters.registeredOnly}
                      onChange={toggleRegistered}
                    />
                    <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">Registered with the City</span>
                  </label>
                )}
              </React.Fragment>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Ages Served">
          <div className="space-y-2">
            {agesServed.map(age => (
              <label key={age} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                  checked={filters.agesServed.includes(age)}
                  onChange={() => toggleAgesServed(age)}
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">{age}</span>
              </label>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Meal Options">
          <div className="space-y-2">
            {mealOptions.map(option => (
              <label key={option} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                  checked={filters.mealOptions.includes(option)}
                  onChange={() => toggleMealOption(option)}
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">{option}</span>
              </label>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Other Schedule Options">
          <div className="space-y-2">
            {scheduleOptions.map(option => (
              <label key={option} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-green-600 border-gray-300 focus:ring-green-500 transition cursor-pointer"
                  checked={filters.scheduleOptions.includes(option)}
                  onChange={() => toggleScheduleOption(option)}
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-green-600 transition">{option}</span>
              </label>
            ))}
          </div>
        </AccordionItem>


      </div>

      <div className="pt-2">
        <button
          onClick={() => setFilters({ types: [], agesServed: [], mealOptions: [], scheduleOptions: [], rating: 0, spotsOnly: false, registeredOnly: false })}
          className="w-full py-3 text-sm font-bold text-gray-500 hover:text-green-600 border border-gray-200 hover:border-green-600 rounded-xl transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

const ListView = ({ providers, onAgencyClick, onAgesClick, onSpotsClick }) => (
  <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
    {providers.map(provider => (
      <ProviderCard 
        key={provider.id} 
        provider={provider} 
        onAgencyClick={onAgencyClick} 
        onAgesClick={onAgesClick}
        onSpotsClick={onSpotsClick}
      />
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


const iconMapping = {
  'Daycare Center': { color: '#16a34a', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>' },
  'Licensed Home-based': { color: '#059669', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
  'Preschool': { color: '#7c3aed', html: '<svg class="marker-icon" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>' },
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

const MapView = ({ providers, selectedProvider, setSelectedProvider, onAgencyClick, onSpotsClick }) => {
  const defaultCenter = [40.7128, -74.0060]; // NYC default
  const navigate = useNavigate();

  const getProviderAddress = (providerId) => {
    return addresses.find(a => a.providerId === providerId);
  };

  const firstProviderAddress = providers.length > 0 ? getProviderAddress(providers[0].id) : null;
  const center = firstProviderAddress 
    ? [firstProviderAddress.coordinates.lat, firstProviderAddress.coordinates.lng]
    : defaultCenter;

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
        {providers.map((provider) => {
          const addressEntry = getProviderAddress(provider.id);
          if (!addressEntry) return null;
          
          return (
            <Marker 
              key={provider.id} 
              position={[addressEntry.coordinates.lat, addressEntry.coordinates.lng]}
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{provider.type}</span>
                      {provider.type === "Licensed Home-based" && (
                        <button 
                          onClick={() => {
                            const agency = agencies.find(a => a.id === provider.agencyId);
                            if (agency) onAgencyClick(agency);
                          }}
                          className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border-2 border-blue-600 uppercase tracking-tight hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        >
                          Agency: {agencies.find(a => a.id === provider.agencyId)?.name}
                        </button>
                      )}
                    </div>
                    <div>
                      {provider.spotsAvailable > 0 ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSpotsClick(provider);
                          }}
                          className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border-2 border-green-600 uppercase tracking-tight hover:bg-green-600 hover:text-white transition cursor-pointer"
                        >
                          {provider.spotsAvailable} spots
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/waitlist/${provider.id}`);
                          }}
                          className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full border-2 border-red-600 uppercase tracking-tight hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          Waitlist
                        </button>
                      )}
                    </div>
                  </div>
                    <button 
                      onClick={() => navigate(`/provider/${provider.id}`)}
                      className="text-base font-bold text-gray-900 leading-tight mb-2 text-left cursor-pointer hover:text-green-600 hover:underline"
                    >
                      {provider.name}
                    </button>
                    <p className="text-xs text-gray-700 font-medium mb-1">{addressEntry.fullAddress}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{provider.description}</p>
                    <button 
                      onClick={() => navigate(`/provider/${provider.id}`)}
                      className="w-full py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm cursor-pointer"
                    >
                      View More Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

const ParentsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4 uppercase">
          How it Works for Parents
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Finding the right childcare for your family shouldn't be a struggle. We've simplified the process into three easy steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">1. Search</h3>
          <p className="text-gray-600">
            Enter your location or search by provider name. Filter by childcare type, age group, and availability to find exactly what you need.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">2. Review</h3>
          <p className="text-gray-600">
            Explore detailed profiles, check real-time spot availability, and view photos. Learn about the provider's philosophy and features.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">3. Connect</h3>
          <p className="text-gray-600">
            Contact providers directly or join waitlists. Get all the information you need to make the best choice for your child.
          </p>
        </div>
      </div>
      
      <div className="mt-20 bg-green-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 uppercase">Ready to find the perfect care?</h2>
          <Link to="/" className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg uppercase">
            Start Your Search
          </Link>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

const ProviderDetails = ({ onAgencyClick }) => {
  const { id } = useParams();
  const providerId = parseInt(id);
  const provider = providers.find(p => p.id === providerId);
  const address = addresses.find(a => a.providerId === provider?.id);
  const agency = agencies.find(a => a.id === provider?.agencyId);
  const providerSpots = spotsAvailable.filter(s => s.providerId === providerId);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!provider) return <div className="p-20 text-center">Provider not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-green-600 font-bold hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Search
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-64 sm:h-96 w-full relative flex items-center justify-center">
          <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-white bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl text-center border border-white/10 uppercase tracking-tight">
              {provider.name}
            </h1>
          </div>
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 uppercase tracking-widest shadow-sm">
              {provider.type}
            </span>
            {provider.type === "Licensed Home-based" && agency && (
              <button 
                onClick={() => onAgencyClick(agency)}
                className="bg-blue-600/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-tight shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                Agency: {agency.name}
              </button>
            )}
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <p className="text-gray-500 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {address?.fullAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Availability</label>
              <div className="flex items-center justify-between">
                <p className={`text-lg font-bold ${provider.spotsAvailable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {provider.spotsAvailable > 0 ? `${provider.spotsAvailable} Spots Available` : 'Waitlist Only'}
                </p>
                {provider.spotsAvailable === 0 && (
                  <button 
                    onClick={() => navigate(`/waitlist/${provider.id}`)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition shadow-sm cursor-pointer"
                  >
                    Join Waitlist
                  </button>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Location</label>
              <p className="text-lg font-bold text-gray-900">{provider.location}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Max Capacity</label>
              <p className="text-lg font-bold text-gray-900">{provider.maxCapacity} children</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this provider</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {provider.description}
            </p>
          </div>

          {providerSpots.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Availability</h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Age Group</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Part Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Full Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {providerSpots.map((spot) => (
                      <tr key={spot.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">{spot.AgeServed}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg font-bold text-sm ${spot.partTime > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                            {spot.partTime} spots
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg font-bold text-sm ${spot.fullTime > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                            {spot.fullTime} spots
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {new Date(spot.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {address && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="h-96 w-full rounded-3xl overflow-hidden border border-gray-100 shadow-inner z-0">
                <MapContainer 
                  center={[address.coordinates.lat, address.coordinates.lng]} 
                  zoom={15} 
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker 
                    position={[address.coordinates.lat, address.coordinates.lng]}
                    icon={createCustomIcon(provider.type, true)}
                  />
                </MapContainer>
              </div>
              <p className="mt-4 text-gray-600 font-medium flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {address.fullAddress}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Tags</h2>
            <div className="flex flex-wrap gap-2">
              {provider.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl text-sm uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [hasSearched, setHasSearched] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(false);
  const resultsRef = useRef(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showAgesProvider, setShowAgesProvider] = useState(null);
  const [showSpotsProvider, setShowSpotsProvider] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchType, setSearchType] = useState('Nearby');
  const [searchCriteria, setSearchCriteria] = useState({ 
    location: '', 
    coordinates: null,
    distance: '',
    province: '',
    city: '',
    community: ''
  });
  const [filters, setFilters] = useState({
    types: [],
    agesServed: [],
    mealOptions: [],
    scheduleOptions: [],
    spotsOnly: false,
    registeredOnly: false
  });

  const availableTypes = [...new Set(providers.map(p => p.type))].filter(type => type !== 'Montessori' && type !== 'Nursery');

  const filteredProviders = providers.filter(p => {
    const address = addresses.find(a => a.providerId === p.id);
    const searchTerm = (searchCriteria.location || '').trim().toLowerCase();
    
    let matchLocation = false;
    if (searchType === 'Agency') {
      const agency = agencies.find(a => a.name.toLowerCase().includes(searchTerm));
      matchLocation = searchTerm === '' || (agency ? p.agencyId === agency.id : false);
    } else if (searchType === 'Name') {
      matchLocation = p.name.toLowerCase().includes(searchTerm);
    } else if (searchType === 'Province/City') {
      const matchP = !searchCriteria.province || (address && address.province === searchCriteria.province);
      const matchC = !searchCriteria.city || (address && address.city === searchCriteria.city);
      const matchComm = !searchCriteria.community || (address && address.community === searchCriteria.community);
      // Only match if at least one criteria is selected, otherwise match none for this search type
      const hasSelection = searchCriteria.province || searchCriteria.city || searchCriteria.community;
      matchLocation = hasSelection && matchP && matchC && matchComm;
    } else {
      // Nearby search logic
      if (searchCriteria.coordinates && searchCriteria.distance && address) {
        const dist = calculateDistance(
          parseFloat(searchCriteria.coordinates.lat),
          parseFloat(searchCriteria.coordinates.lng),
          address.coordinates.lat,
          address.coordinates.lng
        );
        matchLocation = dist <= parseFloat(searchCriteria.distance);
      } else {
        matchLocation = (searchTerm === '') || 
                        p.location.toLowerCase().includes(searchTerm) || 
                        p.name.toLowerCase().includes(searchTerm) ||
                        (address && address.fullAddress.toLowerCase().includes(searchTerm));
      }
    }

    const matchType = filters.types.length === 0 || filters.types.includes(p.type);
    const matchSpots = !filters.spotsOnly || p.spotsAvailable > 0;
    const matchRegistered = !filters.registeredOnly || p.registeredWithCity;

    // Logic for ages served - matches if any selected age is mentioned in tags
    const matchAge = filters.agesServed.length === 0 || filters.agesServed.some(age => {
      const shortAge = age.split(' ')[0].toLowerCase(); // e.g., "infant", "toddler"
      return p.tags.some(tag => tag.toLowerCase().includes(shortAge));
    });

    // Logic for meal options - matches if all selected meal options are provided by the provider
    const matchMeals = filters.mealOptions.every(option => {
      if (option === "Meals Provided") return p.mealsProvided;
      if (option === "Snack Provided") return p.snackProvided;
      return true;
    });

    // Logic for schedule options - matches if all selected schedule options are mentioned in tags
    const matchSchedule = filters.scheduleOptions.every(option => {
      return p.tags.some(tag => tag.toLowerCase().includes(option.toLowerCase()));
    });

    return matchLocation && matchType && matchAge && matchMeals && matchSchedule && matchSpots && matchRegistered;
  });

  const handleSearch = (criteria, triggerScroll = false) => {
    setHasSearched(true);
    setSearchCriteria({ 
      location: '', 
      distance: '', 
      province: '', 
      city: '', 
      community: '', 
      ...criteria 
    });
    if (triggerScroll) setShouldScroll(true);
  };

  useEffect(() => {
    if (shouldScroll && resultsRef.current) {
      const offset = 80; // Offset for sticky navbar
      const elementPosition = resultsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar onSearchTypeChange={(type) => {
        setSearchType(type);
        handleSearch({}); // Clear criteria when switching types
      }} />
      <AgencyModal agency={selectedAgency} onClose={() => setSelectedAgency(null)} />
      <AgesServedModal provider={showAgesProvider} onClose={() => setShowAgesProvider(null)} />
      <SpotsAvailableModal provider={showSpotsProvider} onClose={() => setShowSpotsProvider(null)} />

      <Routes>
        <Route path="/" element={
          <main>
            {/* Hero Section */}
            <section 
              className="pt-12 pb-20 md:pt-20 md:pb-32 text-center text-white relative bg-green-800"
              style={{
                backgroundImage: `url(${leafBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-green-900/60 pointer-events-none"></div>

              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
              </div>
              <div className="w-full max-w-7xl mx-auto relative z-20 px-4">
                <SearchBar onSearch={handleSearch} searchType={searchType} setSearchType={setSearchType} />
              </div>
            </section>

            {/* Results Section */}
            {hasSearched && (
              <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Search Results
                    </h2>
                    <p className="text-gray-500 mt-1">Showing {filteredProviders.length} providers</p>
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
                        setSearchCriteria({ location: '', distance: '', province: '', city: '', community: '' }); 
                        setHasSearched(false);
                        setFilters({ types: [], agesServed: [], mealOptions: [], scheduleOptions: [], spotsOnly: false, registeredOnly: false });
                      }}
                      className="text-green-600 font-bold hover:underline ml-auto"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Sidebar Filters */}
                  <aside className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
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
                        <ListView 
                          providers={filteredProviders} 
                          onAgencyClick={setSelectedAgency} 
                          onAgesClick={setShowAgesProvider}
                          onSpotsClick={setShowSpotsProvider}
                        />
                      ) : (
                        <MapView 
                          providers={filteredProviders} 
                          selectedProvider={selectedProvider}
                          setSelectedProvider={setSelectedProvider}
                          onAgencyClick={setSelectedAgency}
                          onSpotsClick={setShowSpotsProvider}
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
        } />
        <Route path="/parents" element={<ParentsPage />} />
        <Route path="/provider/:id" element={<ProviderDetails onAgencyClick={setSelectedAgency} />} />
        <Route path="/waitlist/:id" element={<WaitlistForm />} />
      </Routes>

      <Footer />
    </div>
  );
}