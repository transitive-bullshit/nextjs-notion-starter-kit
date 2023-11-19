import * as React from 'react'

export const CalendarImpl: React.FC = () => {
  return (
    <iframe
      src="https://calendar.google.com/calendar/appointments/AcZssZ1TIPbzGFUF-y90oUaB5yIsT2BsOSqr7c_7AIA=?gv=true"
      style={{ border: 0, marginTop: '2rem', backgroundColor: 'transparent' }}
      width="100%"
      height="900"
    />
  )
}

export const Calendar = React.memo(CalendarImpl)
