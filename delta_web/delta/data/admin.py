########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
#
# admin.py
#
# This file is the configuration for the admin page of the `data` Django app.
# It handles what can be visible from /admin/data/
from django.contrib import admin

# Register your models here.
from .models import File, TagDataset,DataSet

# create the admin class for File
class FileAdmin(admin.ModelAdmin):
    fields = ['file_path','file_name',"original_file_name"]

# create the admin class for TagFile
class TagDatasetAdmin(admin.ModelAdmin):
    fields = ['text','pub_date','file']

admin.site.register(File,FileAdmin)
admin.site.register(TagDataset,TagDatasetAdmin)