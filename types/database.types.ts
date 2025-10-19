export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // Add your database tables here
    }
    Views: {
      // Add your database views here
    }
    Functions: {
      // Add your database functions here
    }
    Enums: {
      // Add your database enums here
    }
  }
}
