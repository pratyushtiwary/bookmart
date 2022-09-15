from models import DBUtils
import pickle
import numpy as np
import pandas as pd

class Book(DBUtils):
    tablename = "Books"
    schema = {
        "ID": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "Title": "TEXT UNIQUE",
        "Author": "TEXT",
        "YearOfPublication": "INTEGER",
        "Publisher": "TEXT",
        "ImageURL_S": "TEXT",
        "ImageURL_M": "TEXT",
        "ImageURL_L": "TEXT",
    }
    def __init__(self):
        self.create()

    def recommend(self,book_name):
        with open('similarity.pkl','rb') as f:
            similarity_scores = pickle.load(f)

        with open('pt.pkl','rb') as f:
            pt = pickle.load(f)
        
        results = []

        index = np.where(pt.index == book_name)[0][0]
        similar_items = sorted(list(enumerate(similarity_scores[index])),key = lambda x:x[1],reverse=True)[1:6]
        for i in similar_items:
            recommended_name = pt.index[i[0]]
            result = self.select(['ID','Title','Author','ImageURL_L']).filter(f'Title = "{recommended_name}"').run()
            results.append(result)
        return results