from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from crm.selectors.tag_selector import TagSelector

from crm.serializers.tag import *


class TagListCreateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]


    def get(self,request):

        tags = TagSelector.all(
            request.user
        )


        serializer = TagSerializer(
            tags,
            many=True
        )


        return Response(
            serializer.data
        )



    def post(self,request):

        serializer = TagCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        tag = serializer.save()


        return Response(
            {
                "message":
                "تگ با موفقیت ایجاد شد",

                "tag":
                TagSerializer(tag).data
            },
            status=status.HTTP_201_CREATED
        )



class TagDetailView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def get(self,request,pk):

        tag = TagSelector.by_id(
            pk,
            request.user
        )


        serializer = TagSerializer(tag)


        return Response(
            serializer.data
        )



    def put(self,request,pk):

        tag = TagSelector.by_id(
            pk,
            request.user
        )


        serializer = TagUpdateSerializer(
            tag,
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        tag.save()


        return Response(
            {
                "message":
                "تگ بروزرسانی شد",

                "tag":
                TagSerializer(tag).data
            }
        )



    def patch(self,request,pk):

        tag = TagSelector.by_id(
            pk,
            request.user
        )


        serializer = TagUpdateSerializer(
            tag,
            data=request.data,
            partial=True,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        tag = serializer.save()


        return Response(
            {
                "message":
                "تگ بروزرسانی شد",

                "tag":
                TagSerializer(tag).data
            }
        )



    def delete(self,request,pk):

        tag = TagSelector.by_id(
            pk,
            request.user
        )


        tag.delete()


        return Response(
            {
                "message":
                "تگ حذف شد"
            },
            status=204
        )