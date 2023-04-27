const dateFormatter = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric'
  })
  

class DateService{
    format(date){
      return dateFormatter.format(date)
    }

    isValid(date){
      const errors = {}
      const d = new Date(date);
      const now = new Date();
      d.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      if(d.getTime() < now.getTime()){
        errors.deadline = 'Choose valid date';
      }

      if(d.getFullYear() > 3030){
        errors.deadline = 'invalid date';
      }

      return errors;
    }
}

export const dateService = new DateService();