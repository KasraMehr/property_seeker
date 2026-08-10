from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Reminder)
admin.site.register(Customer)
admin.site.register(CallLog)
admin.site.register(CustomerPreference)
admin.site.register(Tag)
admin.site.register(PropertyVisit)
