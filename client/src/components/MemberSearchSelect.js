'use client'

import { useState, useEffect, useRef } from 'react'

export default function MemberSearchSelect({ members, value, onChange, label = 'Member' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredMembers, setFilteredMembers] = useState(members)
  const dropdownRef = useRef(null)

  const selectedMember = members.find(m => m.id === value)

  useEffect(() => {
    setFilteredMembers(
      members.filter(member =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm)
      )
    )
  }, [searchTerm, members])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (memberId) => {
    onChange(memberId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      
      {/* Selected Member Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      >
        {selectedMember ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full mr-2 flex-shrink-0 bg-primary-100 flex items-center justify-center">
              {selectedMember.avatarUrl ? (
                <img
                  src={selectedMember.avatarUrl}
                  alt={selectedMember.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-medium text-sm">
                  {selectedMember.fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedMember.fullName}</p>
              <p className="text-xs text-gray-500">{selectedMember.user?.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Select a member...</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          </div>

          {/* Member List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredMembers.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No members found
              </div>
            ) : (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleSelect(member.id)}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="h-10 w-10 rounded-full mr-3 flex-shrink-0 bg-primary-100 flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 font-medium">
                        {member.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.user?.email}
                    </p>
                    {member.phone && (
                      <p className="text-xs text-gray-500">
                        {member.phone}
                      </p>
                    )}
                  </div>
                  {value === member.id && (
                    <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
