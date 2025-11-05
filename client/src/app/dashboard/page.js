'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import { getCurrentEthiopianDate, formatEthiopianDate } from '@/lib/ethiopianCalendar'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
    }
  }, [isAuthenticated])

  const fetchStats = async () => {
    try {
      const [statsRes, trendsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/trends/monthly')
      ])
      setStats(statsRes.data)
      setTrends(trendsRes.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Show loading only if we haven't loaded data yet
  if (!stats && trends.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Church Logo" className="h-10 w-10" />
                <h1 className="text-xl font-bold text-gray-900">Akaki Full Gospel Church</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-900 font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/members')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Members
                </button>
                <button
                  onClick={() => router.push('/payments')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Payments
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.profile?.fullName}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{user?.role}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              {!stats && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Ethiopian Calendar</p>
              <p className="text-lg font-medium text-gray-900">
                {formatEthiopianDate(new Date())}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Members
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {stats.totalMembers}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Members
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {stats.activeMembers}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Monthly Collection
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        ${parseFloat(stats.monthlyCollection).toFixed(2)}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Yearly Collection
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        ${parseFloat(stats.yearlyCollection).toFixed(2)}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Trends Chart */}
          {trends.length > 0 && (
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Collection Trends</h3>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Simple Bar Chart */}
                  <div className="space-y-3">
                    {trends.slice().reverse().map((trend, index) => {
                      const maxAmount = Math.max(...trends.map(t => parseFloat(t.amount)))
                      const percentage = maxAmount > 0 ? (parseFloat(trend.amount) / maxAmount) * 100 : 0

                      return (
                        <div key={index} className="flex items-center">
                          <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                            {new Date(trend.month + '-01').toLocaleDateString('en-US', {
                              month: 'short',
                              year: '2-digit'
                            })}
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="relative">
                              <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                                <div
                                  className="bg-primary-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                                  style={{ width: `${Math.max(percentage, 5)}%` }}
                                >
                                  <span className="text-xs font-medium text-white">
                                    ${parseFloat(trend.amount).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">12-Month Total:</span>
                      <span className="text-lg font-bold text-primary-600">
                        ${trends.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Average:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${(trends.reduce((sum, t) => sum + parseFloat(t.amount), 0) / trends.length).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                onClick={() => router.push('/members')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Add Member
              </button>
              <button
                onClick={() => router.push('/payments')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Record Payment
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
