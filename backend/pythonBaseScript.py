from csv import reader
import numpy as np
Alltimeseries, result = [], []
with open('hctsa_timeseries-data.csv', 'r') as read_obj:
    csv_reader = reader(read_obj)
    li = list(csv_reader)
    for i in li:
        Alltimeseries.append(list(map(float, i)))
for i in Alltimeseries:
    result.append(str(float(function_name(np.array(i)))))
print(' '.join(result))