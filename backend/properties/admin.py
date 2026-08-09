from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Property)
admin.site.register(PropertyFeature)
admin.site.register(PropertyStatusHistory)
admin.site.register(PropertyHistory)
admin.site.register(Owner)
