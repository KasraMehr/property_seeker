from accounts.models import User


class CustomerAgentSelector:


    @staticmethod
    def find_agent(customer):

        neighborhoods = (
            customer.preferences
            .values_list(
                "neighborhoods",
                flat=True
            )
        )


        agents = (
            User.objects
            .filter(
                agency=customer.agency,
                is_active=True,
                is_owner=False,
                service_neighborhoods__in=neighborhoods
            )
            .annotate(
                matched_count=models.Count(
                    "service_neighborhoods",
                    filter=models.Q(
                        service_neighborhoods__in=neighborhoods
                    )
                )
            )
            .order_by(
                "-matched_count"
            )
        )


        return agents.first()