import psycopg
from psycopg import sql

def get_db_connection():
    conn = psycopg.connect(
        dbname='room',
        user='user-manager',
        password='6387',
        host='localhost',
        port='5432'
    )
    return conn