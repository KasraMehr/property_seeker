import hashlib

"""

ین کلاس برای محاسبه SHA-256 Checksum فایل است. از Checksum برای تشخیص فایل‌های تکراری، بررسی صحت فایل و اطمینان از تغییر نکردن محتوا استفاده می‌شود.


"""
class ChecksumService:

    @staticmethod
    def generate(file):

        sha256 = hashlib.sha256()#ساخت ابجکت

        for chunk in file.chunks():
            sha256.update(chunk)

        file.seek(0)

        return sha256.hexdigest()


    """
    فایل آپلود می‌شود
        │
        ▼
hashlib.sha256()
        │
        ▼
خواندن فایل به صورت chunks()
        │
        ▼
update() برای هر chunk
        │
        ▼
seek(0) ← برگرداندن اشاره‌گر فایل
        │
        ▼
hexdigest()
        │
        ▼
رشته ۶۴ کاراکتری SHA-256
        │
        ▼
ذخیره در فیلد checksum"""