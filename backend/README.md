# Comp-Engine-Features

[![DOI](https://zenodo.org/badge/288501058.svg)](https://zenodo.org/badge/latestdoi/288501058)

Comp-Engine-Features is a web platform that compares a user's time-series analysis algorithm (python) and compares its behavior to that of a library of >7000 existing algorithms from [hctsa](https://github.com/benfulcher/hctsa).

See [CompEngine](https://www.comp-engine.org/) for an analogous living library of time-series data.
    
## To setup and run on localhost:
1. Clone the repository.
2. Install all the required packages mentioned in requirements.txt

```bash
   pip install -r requirements.txt
```
3. In 
```settings.py```make the following changes:
```django

   Debug=True
   Allowed_hosts=[]

```

4. Create ```.env``` file in the project's root directory and add the secret key in it.
```txt

SECRET_KEY= "Add 50 characters long string by combination of
             digits,characters,special characters and symbols"
```
5. Run the app
```bash
   python manage.py runserver
```


## How to use :
To use Comp-Engine-Features:
1. Create a **.py** file containing analysis method coded in python (structure of the code is mentioned in *HowItWorks* page. )

2. Submit the **function name** and the **.py** file on the form given on home page.

3. Get the results.


 ### *You can also download all the best matching results in .csv format.*
  <br/>

## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
