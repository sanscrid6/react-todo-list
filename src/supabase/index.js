import ApiCalendar from "react-google-calendar-api";

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_API_KEY)
export const googleUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
