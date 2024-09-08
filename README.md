# budgeteer
CSV conversion from banks to YNAB import format

Included are formatters for Sydbank and DanskeBank

- Download budgeteer.exe and config.json from artifacts
- Open config.json with text tool and set your bank in useFormatter to point to the correct formatter name
- Add your bank statement export file (make sure it's not called output.csv)
- Run budgeteer.exe
- You should now have a csv file you can import into YNAB

- note: budgeteer will automatically delete output.csv for you on creation of new one
