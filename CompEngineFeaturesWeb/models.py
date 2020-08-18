from django.db import models
from django.core.files.storage import FileSystemStorage
# Create your models here.


def featurecode(request):
    if request.method == 'POST':
        uploaded_file=request.FILES['featurecode']
        fs= FileSystemStorage()
        fs.save(uploaded_file.name,uploaded_file)
    return render(request,'result.html')
