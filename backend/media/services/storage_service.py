from django.core.files.storage import default_storage


class StorageService:

    @staticmethod
    def save(path, file):

        return default_storage.save(path, file)

    @staticmethod
    def delete(path):

        if default_storage.exists(path):
            default_storage.delete(path)

    @staticmethod
    def exists(path):

        return default_storage.exists(path)

    @staticmethod
    def url(path):

        return default_storage.url(path)