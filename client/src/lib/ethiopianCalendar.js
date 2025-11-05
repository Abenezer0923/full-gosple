// Ethiopian Calendar Converter
// Ethiopian calendar is 7-8 years behind Gregorian calendar

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
]

const ETHIOPIAN_DAYS = [
  'Ehud', 'Segno', 'Maksegno', 'Erob', 'Hamus', 'Arb', 'Kidame'
]

export function gregorianToEthiopian(date) {
  const gregorianDate = new Date(date)
  
  // Get Gregorian date components
  let year = gregorianDate.getFullYear()
  let month = gregorianDate.getMonth() + 1
  let day = gregorianDate.getDate()
  
  // Ethiopian year starts on September 11 (or 12 in leap years)
  let ethYear, ethMonth, ethDay
  
  // Simplified conversion (approximate)
  if (month < 9 || (month === 9 && day < 11)) {
    ethYear = year - 8
  } else {
    ethYear = year - 7
  }
  
  // Calculate Ethiopian month and day
  const dayOfYear = getDayOfYear(gregorianDate)
  const ethNewYearDay = isLeapYear(year) ? 256 : 255 // Sept 11 or 12
  
  let ethDayOfYear
  if (dayOfYear >= ethNewYearDay) {
    ethDayOfYear = dayOfYear - ethNewYearDay + 1
  } else {
    ethDayOfYear = dayOfYear + (isLeapYear(year - 1) ? 366 : 365) - ethNewYearDay + 1
  }
  
  // Calculate month and day
  ethMonth = Math.floor((ethDayOfYear - 1) / 30) + 1
  ethDay = ((ethDayOfYear - 1) % 30) + 1
  
  // Handle Pagume (13th month with 5-6 days)
  if (ethMonth > 12) {
    ethMonth = 13
    ethDay = ethDayOfYear - 360
  }
  
  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
    monthName: ETHIOPIAN_MONTHS[ethMonth - 1],
    dayOfWeek: ETHIOPIAN_DAYS[gregorianDate.getDay()]
  }
}

export function formatEthiopianDate(date) {
  const eth = gregorianToEthiopian(date)
  return `${eth.monthName} ${eth.day}, ${eth.year}`
}

export function formatEthiopianDateShort(date) {
  const eth = gregorianToEthiopian(date)
  return `${eth.day}/${eth.month}/${eth.year}`
}

export function getEthiopianMonthName(monthNumber) {
  return ETHIOPIAN_MONTHS[monthNumber - 1] || 'Unknown'
}

export function getEthiopianDayName(dayNumber) {
  return ETHIOPIAN_DAYS[dayNumber] || 'Unknown'
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

// Get current Ethiopian date
export function getCurrentEthiopianDate() {
  return gregorianToEthiopian(new Date())
}

// Format for display with both calendars
export function formatDualDate(date) {
  const gregorian = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const ethiopian = formatEthiopianDate(date)
  return {
    gregorian,
    ethiopian
  }
}
