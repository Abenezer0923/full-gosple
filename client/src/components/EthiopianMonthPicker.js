'use client'

import { useState, useEffect } from 'react'
import { getCurrentEthiopianDate, getEthiopianMonthName } from '@/lib/ethiopianCalendar'

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
]

// Convert Ethiopian date to Gregorian (approximate)
function ethiopianToGregorian(ethYear, ethMonth) {
  // Ethiopian New Year is around Sept 11
  // Approximate conversion
  let gregYear = ethYear + 7
  let gregMonth = ethMonth + 8 // Meskerem (1) ≈ September (9)
  
  if (gregMonth > 12) {
    gregMonth -= 12
    gregYear += 1
  }
  
  return `${gregYear}-${String(gregMonth).padStart(2, '0')}`
}

export default function EthiopianMonthPicker({ value, onChange, label = 'For Month' }) {
  const currentEth = getCurrentEthiopianDate()
  const [selectedYear, setSelectedYear] = useState(currentEth.year)
  const [selectedMonth, setSelectedMonth] = useState(currentEth.month)

  // Generate year options (current year and previous 2 years)
  const yearOptions = [
    currentEth.year,
    currentEth.year - 1,
    currentEth.year - 2
  ]

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
    const gregorianMonth = ethiopianToGregorian(selectedYear, month)
    onChange(gregorianMonth)
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    const gregorianMonth = ethiopianToGregorian(year, selectedMonth)
    onChange(gregorianMonth)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} (Ethiopian Calendar) *
      </label>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(parseInt(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          {ETHIOPIAN_MONTHS.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(parseInt(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Selected: {ETHIOPIAN_MONTHS[selectedMonth - 1]} {selectedYear}
      </p>
    </div>
  )
}
