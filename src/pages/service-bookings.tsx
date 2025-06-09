import { format } from "date-fns"

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return format(date, "MM/dd")
  } catch (error) {
    return dateString
  }
} 