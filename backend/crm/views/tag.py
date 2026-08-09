from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crm.selectors.tag_selector import TagSelector
from crm.serializers.tag import *


class TagListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        tags = TagSelector.all(request.user)

        serializer = TagSerializer(tags, many=True)

        return Response(serializer.data)

    def post(self, request):

        serializer = TagCreateSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        tag = serializer.save()

        return Response(
            {"message": "تگ با موفقیت ایجاد شد", "tag": TagSerializer(tag).data},
            status=status.HTTP_201_CREATED,
        )


class TagDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        tag = TagSelector.by_id(pk, request.user)

        serializer = TagSerializer(tag)

        return Response(serializer.data)

    def put(self, request, pk):

        tag = TagSelector.by_id(pk, request.user)

        serializer = TagUpdateSerializer(
            tag, data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        tag.save()

        return Response({"message": "تگ بروزرسانی شد", "tag": TagSerializer(tag).data})

    def patch(self, request, pk):

        tag = TagSelector.by_id(pk, request.user)

        serializer = TagUpdateSerializer(
            tag, data=request.data, partial=True, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        tag = serializer.save()

        return Response({"message": "تگ بروزرسانی شد", "tag": TagSerializer(tag).data})

class TagBulkDeleteView(APIView):
        permission_classes = [
            IsAuthenticated,
        ]

        def delete(self, request):
            tag_ids = request.data.get("ids", [])

            if not tag_ids:
                return Response(
                    {"message": "حداقل یک تگ را انتخاب کنید."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            deleted_count = 0

            for tag_id in tag_ids:
                tag = TagSelector.by_id(
                    tag_id,
                    request.user,
                )

                tag.delete()
                deleted_count += 1

            return Response(
                {
                    "message": f"{deleted_count} تگ با موفقیت حذف شد.",
                    "deleted_count": deleted_count,
                },
                status=status.HTTP_200_OK,
            )
