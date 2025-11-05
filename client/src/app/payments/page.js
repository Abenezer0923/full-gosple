'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import PaymentReceipt from '@/components/PaymentReceipt'
import MemberSearchSelect from '@/components/MemberSearchSelect'
import EthiopianMonthPicker from '@/components/EthiopianMonthPicker'

export default function PaymentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const [payments, setPayments] = useState([])
  const [members, setMembers] = useState([])
  const [paymentTypes, setPaymentTypes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentTypeId: '',
    forMonth: new Date().toISOString().slice(0, 7),
    method: 'CASH',
    notes: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Fetch data when authenticated
    if (isAuthenticated && !isLoading) {
      fetchData()
    }
  }, [isAuthenticated, isLoading])

  const fetchData = async () => {
    try {
      const [paymentsRes, membersRes, typesRes] = await Promise.all([
        api.get('/payments?limit=50'),
        api.get('/members?limit=100'),
        api.get('/payments/types/all')
      ])
      setPayments(paymentsRes.data.payments || [])
      setMembers(membersRes.data.members || [])
      setPaymentTypes(typesRes.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        forMonth: formData.forMonth + '-01'
      }
      const { data } = await api.post('/payments', payload)
      setSuccess('Payment recorded successfully!')
      setFormData({
        memberId: '',
        amount: '',
        paymentTypeId: '',
        forMonth: new Date().toISOString().slice(0, 7),
        method: 'CASH',
        notes: ''
      })
      setShowForm(false)
      fetchData()
      
      // Show receipt
      setSelectedPayment(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record payment')
    }
  }

  // Show loading only if we haven't loaded data yet
  if (members.length === 0 && payments.length === 0 && paymentTypes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
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
                <div className="flex items-center space-x-2">
                  <img src="/Full_gosple.png" alt="Church Logo" className="h-8 w-8 rounded-full" />
                  <span className="hidden sm:inline">Akaki Full Gospel Church</span>
                  <span className="sm:hidden">AFGC</span>
                </div>
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/members')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Members
                </button>
                <button
                  onClick={() => router.push('/payments')}
                  className="text-gray-900 font-medium"
                >
                  Payments
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.profile?.fullName}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
              {(members.length === 0 || payments.length === 0) && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              )}
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {showForm ? 'Cancel' : 'Record Payment'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Record New Payment</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <MemberSearchSelect
                  members={members}
                  value={formData.memberId}
                  onChange={(memberId) => setFormData({ ...formData, memberId })}
                  label="Member"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Type *
                  </label>
                  <select
                    required
                    value={formData.paymentTypeId}
                    onChange={(e) => setFormData({ ...formData, paymentTypeId: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select type</option>
                    {paymentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <EthiopianMonthPicker
                  value={formData.forMonth}
                  onChange={(month) => setFormData({ ...formData, forMonth: month })}
                  label="For Month"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method *
                  </label>
                  <select
                    required
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CHECK">Check</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payments recorded yet. Record your first payment!
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      onClick={() => setSelectedPayment(payment)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.member?.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <PaymentReceipt
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  )
}
