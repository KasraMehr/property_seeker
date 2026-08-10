from ..models import Media

from .checksum_service import ChecksumService
from .image_service import ImageService


class UpdateService:

    @classmethod
    def update(
        cls,
        *,
        media: Media,
        **validated_data,
    ):

        file = validated_data.get("file")

        if file:

            media.file = file
            media.file_name = file.name
            media.file_size = file.size
            media.mime_type = file.content_type

            media.checksum = ChecksumService.generate(file)

            if media.media_type == Media.MediaType.IMAGE:

                if not ImageService.validate(file):
                    raise ValueError("Image is invalid.")

                width, height = ImageService.get_dimensions(file)

                media.width = width
                media.height = height

        for field, value in validated_data.items():
            setattr(media, field, value)

        media.save()

        return media