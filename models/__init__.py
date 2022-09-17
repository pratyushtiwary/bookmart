import sqlite3
import re

connection = sqlite3.connect('bookmart.db',check_same_thread=False)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

connection.row_factory = dict_factory

class DBUtils:
    schema:dict
    tablename:str
    cursor = connection.cursor()

    def exists(self): 

        query = f'SELECT name FROM sqlite_master WHERE type="table" AND name="{self.tablename}";'

        self.cursor.execute(query)

        result = self.cursor.fetchone()

        return result

    def create(self,force_update = False):
        query = f"CREATE TABLE {self.tablename}(\n"
        for colName in self.schema:
            query += "\t"+colName + " " + self.schema[colName] + ",\n"
        query = re.sub(r'\,$','',query)
        query += ");"

        if force_update:
            self.cursor.execute(f"DROP TABLE IF EXISTS {self.tablename}")

        if not self.exists():
            try:
                self.cursor.execute(query)
                return True
            except:
                return False

    def insert(self,newData: dict):
        cols = list(newData.keys())
        values = list(newData.values())
        for i,value in enumerate(values):
            value = str(value)
            if 'INTEGER' not in self.schema.get(cols[i],None).upper():
                values[i] = "'"+value+"'"
            else:
                values[i] = value
        cols = ','.join(cols)
        values = ','.join(values)
        query = f"INSERT INTO {self.tablename}({cols}) VALUES ({values});"
        
        try:
            self.cursor.execute(query)
            return True
        except:
            return False

    def select_all(self):
        query = f"SELECT * FROM {self.tablename};"

        self.cursor.execute(query)

        return self.cursor.fetchall()
    
    def select(self,cols: list):
        cols = ','.join(cols)

        self.query = f"SELECT {cols} FROM {self.tablename} "

        return self
    
    def filter(self,condition):
        self.query += f"WHERE {condition} "
        return self

    def limit(self,m,n):
        self.query += f"LIMIT {n} OFFSET {m}"

        return self

    def run(self):
        self.query += ";"

        self.cursor.execute(self.query)

        return self.cursor.fetchall()

    def select_m_n(self,m,n):
        if self.schema.get("ID",False):
            query = f"SELECT * FROM {self.tablename} WHERE ID > {m} AND ID < {m+n+1}"
            self.cursor.execute(query)
            return self.cursor.fetchall()
        return None

    def __del__(self):
        connection.commit()