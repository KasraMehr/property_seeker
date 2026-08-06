class VideoService:

    VIDEO_TYPES = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
    ]

    @classmethod
    def validate(cls, file):

        return file.content_type in cls.VIDEO_TYPES