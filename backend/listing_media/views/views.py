from django.shortcuts import render
# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from listing_media.selector.media_selector import MediaSelector
from listing_media.serializers.media_create import MediaCreateSerializer
from listing_media.serializers.media_detail import MediaDetailSerializer
from  listing_media.serializers.media_list import MediaListSerializer
from listing_media.serializers.media_update import MediaUpdateSerializer
from listing_media.services.delete_service import DeleteService
from listing_media.services.update_service import UpdateService
from listing_media.services.upload_service import UploadService


class MediaCreateView(APIView):

    serializer_class = MediaCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        media = UploadService.create(
            uploaded_by=request.user,
            **serializer.validated_data
        )

        return Response(
            {
                "message": "رسانه با موفقیت ایجاد شد.",
                "media": MediaDetailSerializer(media).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MediaListView(APIView):

    serializer_class = MediaListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):

        queryset = MediaSelector.all()

        serializer = self.serializer_class(
            queryset,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MediaDetailView(APIView):


    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        media = MediaSelector.by_id(pk)

        serializer = MediaDetailSerializer(media)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class MediaUpdateView(APIView):

    serializer_class = MediaUpdateSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        media = MediaSelector.by_id(pk)

        serializer = self.serializer_class(
            media,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        media = UpdateService.update(
            media=media,
            **serializer.validated_data,
        )

        return Response(
            {
                "message": "رسانه بروزرسانی شد.",
                "media": MediaDetailSerializer(media).data,
            }
        )

    def patch(self, request, pk):
        media = MediaSelector.by_id(pk)

        serializer = MediaUpdateSerializer(
            media,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        media = UpdateService.update(
            media=media,
            **serializer.validated_data,
        )

        return Response(
            {
                "message": "رسانه بروزرسانی شد.",
                "media": MediaDetailSerializer(media).data,
            }
        )

class MediaBulkDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        media_ids = request.data.get("ids", [])

        if not media_ids:
            return Response(
                {"message": "حداقل یک رسانه را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for media_id in media_ids:
            media = MediaSelector.by_id(media_id)

            DeleteService.delete(media)
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} رسانه با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )