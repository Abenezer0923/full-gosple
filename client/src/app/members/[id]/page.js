'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'

export default function MemberDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    thisYear: 0,
    thisMonth: 0
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchMember()
    }
  }, [isAuthenticated, params.id])

  const fetchMember = async () => {
    try {
      const { data } = await api.get(`/members/${params.id}`)
      setMember(data)
      
      // Calculate payment stats
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const total = data.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
      const thisYear = data.payments
        .filter(p => new Date(p.paymentDate) >= startOfYear)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      const thisMonth = data.payments
        .filter(p => new Date(p.paymentDate) >= startOfMonth)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      
      setStats({ total, thisYear, thisMonth })
    } catch (error) {
      console.error('Failed to fetch member:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while fetching
  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-xl font-bold text-gray-900 hover:text-gray-700"
              >
                GraceLedger
              </button>
              <button
                onClick={() => router.push('/members')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Members
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Member Profile */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-6">
              <div className="h-24 w-24 rounded-full flex-shrink-0 bg-primary-100 flex items-center justify-center">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-bold text-4xl">
                    {member.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{member.fullName}</h2>
                <p className="text-gray-600">{member.user?.email}</p>
                <p className="text-gray-600">{member.phone}</p>
                <p className="text-gray-600">{member.address}</p>
                <div className="mt-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Lifetime Total
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${stats.total.toFixed(2)}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  This Year
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${stats.thisYear.toFixed(2)}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  This Month
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${stats.thisMonth.toFixed(2)}
                </dd>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    For Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {member.payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payments recorded yet
                    </td>
                  </tr>
                ) : (
                  member.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentType?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.forMonth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method.replace('_', ' ')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Groups */}
          {member.memberGroups && member.memberGroups.length > 0 && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Groups</h3>
              <div className="flex flex-wrap gap-2">
                {member.memberGroups.map((mg) => (
                  <span
                    key={mg.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {mg.group.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
