# Comp-Engine-Features


[Comp-Engine-Features]() is a web platform that takes time series analysis method coded in python as input, compares it with <7700+ features and presents the best matching features as output. It is similar attempt to what [HCTSA](https://github.com/benfulcher/hctsa) a matlab package do.


#### For more information about all the 7700+ features and *hctsa*  please read the following publications:

* B.D. Fulcher and N.S. Jones. [hctsa: A computational framework for automated time-series phenotyping using massive feature extraction.](https://www.cell.com/cell-systems/fulltext/S2405-4712%2817%2930438-6) Cell Systems 5, 527 (2017).

* B.D. Fulcher, M.A. Little, N.S. Jones. [Highly comparative time-series analysis: the empirical structure of time series and their methods.](https://royalsocietypublishing.org/doi/full/10.1098/rsif.2013.0048) J. Roy. Soc. Interface 10, 20130048 (2013). 

    
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
