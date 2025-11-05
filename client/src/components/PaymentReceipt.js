'use client'

import { formatEthiopianDate } from '@/lib/ethiopianCalendar'

export default function PaymentReceipt({ payment, onClose }) {
  const handlePrint = () => {
    window.print()
  }

  if (!payment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto print:relative print:bg-white print:p-0">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 print:shadow-none print:max-w-full print:my-0">
        {/* Header - Hide on print */}
        <div className="flex justify-between items-center p-6 border-b print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8">
          {/* Church Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <img src="/logo.png" alt="Church Logo" className="h-16 w-16 mb-3" />
              <h1 className="text-3xl font-bold text-gray-900">Akaki Full Gospel Church</h1>
            </div>
            <p className="text-gray-600">Church Management System</p>
            <p className="text-sm text-gray-500 mt-2">Payment Receipt</p>
          </div>

          {/* Receipt Details */}
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Receipt No.</p>
                <p className="font-medium text-gray-900">{payment.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {formatEthiopianDate(payment.paymentDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Member Information */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Received From</h3>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full flex-shrink-0 bg-primary-100 flex items-center justify-center">
                {payment.member?.avatarUrl ? (
                  <img
                    src={payment.member.avatarUrl}
                    alt={payment.member.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-bold text-2xl">
                    {payment.member?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-lg text-gray-900">{payment.member?.fullName}</p>
                <p className="text-sm text-gray-600">{payment.member?.user?.email}</p>
                <p className="text-sm text-gray-600">{payment.member?.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Payment Type</p>
                <p className="font-medium text-gray-900">{payment.paymentType?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">{payment.method.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">For Month</p>
                <p className="font-medium text-gray-900">
                  {new Date(payment.forMonth).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${parseFloat(payment.amount).toFixed(2)}
                </p>
              </div>
            </div>
            {payment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-900">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
            <p>Thank you for your contribution!</p>
            <p className="mt-2">This is a computer-generated receipt and does not require a signature.</p>
            <p className="mt-4 text-xs">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons - Hide on print */}
        <div className="flex justify-end space-x-3 p-6 border-t print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Print Receipt
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          .print\\:relative,
          .print\\:relative * {
            visibility: visible;
          }
          .print\\:relative {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:my-0 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
