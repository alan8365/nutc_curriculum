from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Department)
admin.site.register(Classes)
admin.site.register(Teacher)
admin.site.register(Course)
admin.site.register(Time)
admin.site.register(CourseTime)
