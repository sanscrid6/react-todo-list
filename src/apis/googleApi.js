class GoogleApi {
    #baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

    async deleteEvent(id){
        await this.#requestBase({method: 'DELETE'}, id)
    }

    async createEvent({name, date}){
        return this.#requestBase({
            method: 'POST',
            body: JSON.stringify({
              summary: name,
              description: name,
              start: {
                dateTime: date.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              end: {
                dateTime: new Date(date.getTime() + 24*3600*1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              dataType: 'jsonp'
            })}).then(res => res.json())
    }


    async updateEvent({id, name, date}){
        return this.#requestBase({
            method: 'PUT',
            body: JSON.stringify({
              summary: name,
              description: name,
              start: {
                dateTime: date.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              end: {
                dateTime: new Date(date.getTime() + 24*3600*1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              dataType: 'jsonp'
            })}, id).then(res => res.json())
    }

    async #requestBase(data, id){
        return fetch(this.#baseUrl + "/" + (id || ''), {
            ...data,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('providerToken')
            },
        })
    }

}

export const googleApi = new GoogleApi();