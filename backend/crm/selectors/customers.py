from ..models import Customer


class CustomerSelector:

    @staticmethod
    def get_customer(customer_id):
        return (
            Customer.objects
            .select_related("assigned_agent")
            .get(id=customer_id)
        )

    @staticmethod
    def get_customers():
        return (
            Customer.objects
            .select_related("assigned_agent")
            .order_by("-created_at")
        )