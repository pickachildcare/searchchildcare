import { useState, useEffect } from "react";

export default function SearchAutocomplete({ suggestions, onSelect, onChange, placeholder, isAsync = false, value = "" }) {
  const [query, setQuery] = useState(value);
  const [filtered, setFiltered] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);

    // Call onSelect for local suggestions so typing works without selecting
    if (!isAsync) {
      onSelect({ label: val, value: val });
    }

    if (!val.trim()) {
      setFiltered([]);
      setShow(false);
      if (isAsync) {
        onSelect(null);
      }
      return;
    }

    if (isAsync) {
      setIsLoading(true);
      setShow(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5&countrycodes=ca`);
        const data = await response.json();
        const results = data.map(item => ({
          label: item.display_name,
          value: item.display_name,
          lat: item.lat,
          lon: item.lon
        }));
        setFiltered(results);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const matches = suggestions.filter((s) => {
        const text = typeof s === "string" ? s : s.label;
        return text.toLowerCase().includes(val.toLowerCase());
      });
      setFiltered(
        matches.map((s) => (typeof s === "string" ? { label: s, value: s } : s))
      );
      setShow(true);
    }
  };

  const selectSuggestion = (item) => {
    setQuery(item.label);
    setShow(false);
    onSelect(item);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query.trim() && setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        placeholder={placeholder || "Search..."}
        className="w-full pl-3 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
      />

      {show && (isLoading || filtered.length > 0) && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border-2 border-green-100 rounded-xl shadow-2xl py-2 z-[9999] max-h-72 overflow-y-auto ring-4 ring-black/5">
          {isLoading ? (
            <li className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching Canadian addresses...
            </li>
          ) : (
            filtered.map((item, index) => (
              <li
                key={index}
                onClick={() => selectSuggestion(item)}
                className="px-4 py-3 text-sm text-gray-700 hover:bg-green-600 hover:text-white cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 flex flex-col"
              >
                <span className="font-bold">{item.label}</span>
                {item.sublabel && (
                  <span className="text-xs opacity-80">{item.sublabel}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}