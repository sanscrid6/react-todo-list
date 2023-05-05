import { createClient } from "@supabase/supabase-js";

class SupabaseApi {

    #supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_API_KEY)

    async updateTodos(todos){
        return await this.#supabase
            .from('todos')
            .update([{userId: localStorage.getItem('userId'), data: JSON.stringify(todos)}])
            .eq('userId', localStorage.getItem('userId'))
    }


    async getTodos(){
        return await this.#supabase.from('todos').select('data').eq('userId', localStorage.getItem('userId'))
    }


    async createTodos(){
        return await this.#supabase.from('todos').insert([{userId: localStorage.getItem('userId'), data: ""}])
    }

    async signIn(){
        return await this.#supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              scopes: 'https://www.googleapis.com/auth/calendar',
              redirectTo: window.location.origin
            }
          })
    }

}

export const supabaseApi = new SupabaseApi();