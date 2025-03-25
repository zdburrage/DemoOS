'use client';

import { useState } from 'react';

export default function UserProfileForm({ user }) {
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [metadata, setMetadata] = useState(
    JSON.stringify(user?.metadata || {}, null, 2)
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');

    try {
      // Parse metadata from the textarea
      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (err) {
        throw new Error('Invalid metadata JSON format');
      }

      const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName,
          lastName,
          metadata: parsedMetadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user profile');
      }

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="profile-update-section">
      <h3>Update Your Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="metadata">Metadata (JSON format):</label>
          <textarea
            id="metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            rows={5}
          />
        </div>
        
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
        
        {message && (
          <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}