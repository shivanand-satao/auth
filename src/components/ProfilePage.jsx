import React, { useState, useRef } from 'react';
import { Mail, Phone, User, FileText, ArrowLeft, Upload, MapPin, Briefcase, Calendar, Globe, Linkedin, Github as GithubIcon, Twitter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../services/firestoreService';
import { storageService } from '../services/storageService';

const ProfilePage = ({ onBack }) => {
  const { userProfile, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

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
    photoURL: userProfile?.photoURL || '',
    location: userProfile?.location || '',
    company: userProfile?.company || '',
    jobTitle: userProfile?.jobTitle || '',
    website: userProfile?.website || '',
    linkedinUrl: userProfile?.linkedinUrl || '',
    githubUrl: userProfile?.githubUrl || '',
    twitterUrl: userProfile?.twitterUrl || '',
    dateOfBirth: userProfile?.dateOfBirth || '',
    skills: userProfile?.skills || '',
    interests: userProfile?.interests || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      // Compress and convert image to base64
      const base64Image = await storageService.compressAndConvert(file);
      
      // Update form data with base64 image
      setFormData(prev => ({
        ...prev,
        photoURL: base64Image
      }));
      
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface2 rounded-lg transition text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          </div>
          <button
            onClick={() => {
              if (isEditing) {
                setFormData({
                  displayName: userProfile?.displayName || '',
                  phoneNumber: userProfile?.phoneNumber || '',
                  bio: userProfile?.bio || '',
                  photoURL: userProfile?.photoURL || '',
                  location: userProfile?.location || '',
                  company: userProfile?.company || '',
                  jobTitle: userProfile?.jobTitle || '',
                  website: userProfile?.website || '',
                  linkedinUrl: userProfile?.linkedinUrl || '',
                  githubUrl: userProfile?.githubUrl || '',
                  twitterUrl: userProfile?.twitterUrl || '',
                  dateOfBirth: userProfile?.dateOfBirth || '',
                  skills: userProfile?.skills || '',
                  interests: userProfile?.interests || ''
                });
              }
              setIsEditing(!isEditing);
              setError('');
            }}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-6 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-6 text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  {formData.photoURL || userProfile?.photoURL ? (
                    <img
                      src={formData.photoURL || userProfile.photoURL}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-surface shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-4 border-white dark:border-dark-surface shadow-xl">
                      <span className="text-5xl text-white font-bold">
                        {userProfile?.displayName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition disabled:opacity-50"
                    >
                      <Upload size={16} />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Name and Title */}
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userProfile?.displayName || 'User'}
                  </h2>
                  {userProfile?.jobTitle && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                      {userProfile.jobTitle}
                      {userProfile.company && ` at ${userProfile.company}`}
                    </p>
                  )}
                  {userProfile?.location && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                      <MapPin size={16} />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {userProfile?.bio && !isEditing && (
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {userProfile.bio}
              </p>
            )}

            {/* Social Links */}
            {!isEditing && (userProfile?.website || userProfile?.linkedinUrl || userProfile?.githubUrl || userProfile?.twitterUrl) && (
              <div className="flex flex-wrap gap-3 mt-6">
                {userProfile.website && (
                  <a
                    href={userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-surface2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <Globe size={18} />
                    <span className="text-sm font-medium">Website</span>
                  </a>
                )}
                {userProfile.linkedinUrl && (
                  <a
                    href={userProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  >
                    <Linkedin size={18} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                )}
                {userProfile.githubUrl && (
                  <a
                    href={userProfile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition"
                  >
                    <GithubIcon size={18} />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                )}
                {userProfile.twitterUrl && (
                  <a
                    href={userProfile.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 transition"
                  >
                    <Twitter size={18} />
                    <span className="text-sm font-medium">Twitter</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userProfile?.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Professional Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="Tech Corp"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="JavaScript, React, Node.js, Python"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with commas</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interests
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="AI, Web Development, Open Source"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate interests with commas</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Social Links</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition shadow-lg"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">{userProfile?.email}</p>
                </div>

                {userProfile?.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">{userProfile.phoneNumber}</p>
                  </div>
                )}

                {userProfile?.dateOfBirth && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                    <p className="text-gray-900 dark:text-white font-medium">{new Date(userProfile.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            {(userProfile?.skills || userProfile?.interests) && (
              <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Professional Information</h3>
                
                {userProfile?.skills && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {userProfile?.interests && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.split(',').map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
