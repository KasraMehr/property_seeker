from PIL import Image

"""

ین کلاس با استفاده از کتابخانه Pillow (PIL) روی فایل‌های تصویری کار می‌کند. دو وظیفه دارد:

گرفتن ابعاد تصویر (عرض و ارتفاع)
بررسی اینکه فایل واقعاً یک تصویر سالم است یا نه


"""

class ImageService:

    @staticmethod
    def get_dimensions(file):

        image = Image.open(file)

        width = image.width
        height = image.height

        file.seek(0)#همیشه بعد خواندن این فایل این کد و میذاریم

        return width, height

    @staticmethod
    def validate(file):

        try:
            Image.open(file).verify()#بررسی میکنه فایل سالم است یا خیر
            file.seek(0)
            return True
        except Exception:
            return False