from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Address)
admin.site.register(City)
admin.site.register(District)
admin.site.register(Province)
admin.site.register(Neighborhood)


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "city", "active")
    list_filter = ("city", "active")
    search_fields = ("id", "name")


@admin.register(DivarNeighborhood)
class DivarNeighborhoodAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "zone", "active", "last_seen_at")
    list_filter = ("city", "zone", "active")
    list_editable = ("zone",)
    search_fields = ("name", "normalized_name")
    readonly_fields = ("name", "normalized_name", "source", "city", "last_seen_at")
