from .storage_service import StorageService


class DeleteService:

    @staticmethod
    def delete(media):

        if media.file:
            StorageService.delete(media.file.name)

        media.delete()