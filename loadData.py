from models.Books import Book
import csv

file = "Books.csv"

with open(file,'r') as csv_file:
    csvreader = csv.reader(csv_file)

    fields = next(csvreader)
    book = Book()

    for i,row in enumerate(csvreader):
        print('Insert book',i)
        data = {
            "Title": row[1],
            "Author": row[2],
            "YearOfPublication": row[3],
            "Publisher": row[4],
            "ImageURL_S": row[5],
            "ImageURL_M": row[6],
            "ImageURL_L": row[7]
        }


        book.insert(data)