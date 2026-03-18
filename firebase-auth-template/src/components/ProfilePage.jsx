import React, { useState, useRef } from 'react';
import { Link, Mail, Phone, User, FileText, ArrowLeft, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../services/firestoreService';

const ProfilePage = ({ onBack }) => {
  const { userProfile, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if profile data is loaded
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phoneNumber: userProfile?.phoneNumber || '',
    bio: userProfile?.bio || '',
    photoURL: userProfile?.photoURL || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Check if userProfile exists
    if (!userProfile?.uid) {
      setError('User profile not loaded. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      const updatedProfile = await firestoreService.updateUserProfile(
        userProfile.uid,
        formData
      );
      setUserProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface2 rounded-lg transition text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile Picture Section */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow p-8 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-4 border-primary-500">
                  <span className="text-4xl text-white font-bold">
                    {userProfile?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Click "Edit" below to change profile picture
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg mb-4 text-green-700 dark:text-green-400 text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            <button
              onClick={() => {
                if (isEditing) {
                  setFormData({
                    displayName: userProfile?.displayName || '',
                    phoneNumber: userProfile?.phoneNumber || '',
                    bio: userProfile?.bio || '',
                    photoURL: userProfile?.photoURL || ''
                  });
                }
                setIsEditing(!isEditing);
                setError('');
              }}
              className="px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-dark-surface2 transition"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paste a direct image URL (JPG or PNG)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface2 rounded-lg">
                  <Mail size={20} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-medium">{userProfile?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Profile Picture URL</p>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-surface2 rounded-lg">
                  <Image size={20} className="text-gray-400 mt-0.5" />
                  <p className="text-gray-900 dark:text-white font-medium break-all text-sm">
                    {userProfile?.photoURL ? (
                      <a href={userProfile.photoURL} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                        {userProfile.photoURL}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface2 rounded-lg">
                  <User size={20} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userProfile?.displayName || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface2 rounded-lg">
                  <Phone size={20} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userProfile?.phoneNumber || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bio</p>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-surface2 rounded-lg">
                  <FileText size={20} className="text-gray-400 mt-0.5" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userProfile?.bio || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Account created: {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
