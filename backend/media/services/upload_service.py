from media.models import Media

from .checksum_service import ChecksumService
from .image_service import ImageService
from .storage_service import StorageService


class UploadService:

    @classmethod
    def create(
        cls,
        *,
        file,
        property,
        listing=None,
        media_type,
        is_main=False,
        sort_order=0,
        alt_text="",
        uploaded_by=None,
    ):

        checksum = ChecksumService.generate(file)

        width = None
        height = None

        if media_type == Media.MediaType.IMAGE:

            if not ImageService.validate(file):
                raise ValueError("Image file is invalid.")

            width, height = ImageService.get_dimensions(file)

        path = StorageService.save(
            f"properties/{file.name}",
            file,
        )

        media = Media.objects.create(
            property=property,
            listing=listing,
            file=path,
            media_type=media_type,
            is_main=is_main,
            sort_order=sort_order,
            alt_text=alt_text,
            uploaded_by=uploaded_by,
            file_name=file.name,
            file_size=file.size,
            mime_type=file.content_type,
            width=width,
            height=height,
            checksum=checksum,
        )

        return media