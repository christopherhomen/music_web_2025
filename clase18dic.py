import openpyxl

# Leer el archivo XLS
wb = openpyxl.load_workbook("data.xls")

# Extraer los datos
data = wb["Sheet1"].values

# Calcular la media
media = np.mean(data)

# Calcular la mediana
mediana = np.median(data)

# Calcular la desviación estándar
desviacion_estandar = np.std(data)

print("La media es:", media)
print("La mediana es:", mediana)
print("La desviación estándar es:", desviacion_estandar)
