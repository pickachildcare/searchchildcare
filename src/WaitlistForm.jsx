import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providers, waitlist } from './data';

const WaitlistForm = () => {
  const { id } = useParams();
  const providerId = parseInt(id);
  const provider = providers.find(p => p.id === providerId);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parentNames: '',
    childName: '',
    childAge: '',
    dobOrDueDate: '',
    desiredStartMonth: '',
    desiredStartYear: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!provider) {
    return <div className="p-20 text-center text-red-600 font-bold">Provider not found</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...formData,
      providerId,
      providerName: provider.name,
      timestamp: new Date().toISOString()
    };
    
    // Store in the array in data.js (runtime)
    waitlist.push(entry);
    
    console.log('Waitlist updated:', waitlist);
    setSubmitted(true);
    
    // Redirect after 3 seconds or on button click
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-green-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for joining the waitlist for <strong>{provider.name}</strong>. 
            We will contact you as soon as a spot becomes available.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-green-600 font-bold hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-green-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Waitlist Application</h1>
          <p className="text-green-100 font-medium">{provider.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Parent or Guardian Names
              </label>
              <input
                required
                type="text"
                name="parentNames"
                value={formData.parentNames}
                onChange={handleChange}
                placeholder="e.g. Jane and John Doe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Child's Name
                </label>
                <input
                  required
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Child's Age
                </label>
                <input
                  required
                  type="text"
                  name="childAge"
                  value={formData.childAge}
                  onChange={handleChange}
                  placeholder="e.g. 2 years"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Date of Birth or Due Date
              </label>
              <input
                required
                type="date"
                name="dobOrDueDate"
                value={formData.dobOrDueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <label className="block text-sm font-bold text-blue-800 uppercase tracking-wider mb-4">
                Desired Start Date
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  required
                  name="desiredStartMonth"
                  value={formData.desiredStartMonth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Month</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  required
                  name="desiredStartYear"
                  value={formData.desiredStartYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Year</option>
                  {[2025, 2026, 2027, 2028].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">
              <strong>Note:</strong> We operate on a first-come, first-served basis. Your position on the waitlist is determined by the date your application is received.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit Waitlist Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaitlistForm;