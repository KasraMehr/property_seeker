from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.models import Feature

from properties.selector.feature_selector import FeatureSelector

from properties.serializers.feature_create import FeatureCreateSerializer
from properties.serializers.feature_update import FeatureUpdateSerializer
from properties.serializers.feature_list import FeatureListSerializer


class FeatureCreateView(APIView):

    serializer_class = FeatureCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        feature = serializer.save()

        return Response(
            {
                "message": "ویژگی با موفقیت ثبت شد.",
                "feature": FeatureListSerializer(feature).data,
            },
            status=status.HTTP_201_CREATED,
        )


class FeatureListView(APIView):

    serializer_class = FeatureListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):

        features = FeatureSelector.all()

        serializer = self.serializer_class(
            features,
            many=True,
        )

        return Response(serializer.data)

class FeatureDetailView(APIView):

    serializer_class =  FeatureListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request,pk):

        feature = FeatureSelector.by_id(pk)

        serializer = self.serializer_class(
            feature,
        )

        return Response(serializer.data)


class FeatureUpdateView(APIView):

    serializer_class = FeatureUpdateSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        feature = FeatureSelector.by_id(pk)

        serializer = self.serializer_class(
            feature,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "ویژگی بروزرسانی شد.",
                "feature": FeatureListSerializer(feature).data,
            }
        )


class FeatureDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        feature = FeatureSelector.by_id(pk)

        feature.delete()

        return Response(
            {
                "message": "ویژگی حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )