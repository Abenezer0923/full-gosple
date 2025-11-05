'use client'

import { useState } from 'react'
import api from '@/lib/api'

export default function ImageUpload({ onUploadComplete, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (12MB)
    if (file.size > 12 * 1024 * 1024) {
      setError('Image size must be less than 12MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const { data } = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setPreview(data.url)
      onUploadComplete(data.url)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image. Make sure Cloudinary is configured.')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (url) => {
    setPreview(url)
    onUploadComplete(url)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture (Optional)
      </label>
      
      {preview && (
        <div className="mb-3">
          <img 
            src={preview} 
            alt="Preview" 
            className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      )}

      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-500">or</span>
        <input
          type="url"
          value={preview}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Paste image URL"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Upload an image (max 12MB) or paste an image URL. Leave blank to use default avatar.
      </p>
    </div>
  )
}
