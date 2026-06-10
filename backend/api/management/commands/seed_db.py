from django.core.management.base import BaseCommand
from api.utils.dynamic_seeder import seed_for_industry


class Command(BaseCommand):
    help = "Seeds the database dynamically for SokoPulse AI based on the user's line of business."

    def add_arguments(self, parser):
        parser.add_argument(
            "--industry",
            type=str,
            default="Industrial",
            help="Define the line of business/industry target for seeding",
        )

    def handle(self, *args, **options):
        industry = options.get("industry", "Industrial")
        self.stdout.write(f"🌱 Seeding SokoPulse AI Database dynamically for: {industry}...")
        try:
            seed_for_industry(industry)
            self.stdout.write(self.style.SUCCESS(f"🎉 Seeding complete. Database configured for: {industry}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Seeding failed: {e}"))
            raise e
