"use server";
import { neon } from "@neondatabase/serverless";

export async function GetDbConnection() {
    if(!process.env.DATABASE_URL) {
        throw new Error('Neon databse url not defined')
    }
    const sql = neon(process.env.DATABASE_URL);
    return sql
    
}