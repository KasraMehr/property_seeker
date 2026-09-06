from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """Shared pagination: 10 items per page, client can override via page_size param."""

    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100
