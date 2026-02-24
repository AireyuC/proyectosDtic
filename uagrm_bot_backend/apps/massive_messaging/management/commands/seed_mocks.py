import random
from django.core.management.base import BaseCommand
from apps.massive_messaging.models import MockFaculty, MockCareer, MockStudent

class Command(BaseCommand):
    help = 'Seeds the database with mock faculties, careers, and students'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding mock data...")

        # Create Faculties
        faculties_data = [
            {"code": "FCET", "name": "Facultad de Ciencias Exactas y Tecnología"},
            {"code": "FCE", "name": "Facultad de Ciencias Económicas"},
            {"code": "FCS", "name": "Facultad de Ciencias de la Salud"},
        ]

        for f_data in faculties_data:
            faculty, created = MockFaculty.objects.get_or_create(**f_data)
            status = 'created' if created else 'already exists'
            self.stdout.write(f"Faculty {faculty.code} {status}")

        # Create Careers
        fcet = MockFaculty.objects.get(code="FCET")
        fce = MockFaculty.objects.get(code="FCE")
        fcs = MockFaculty.objects.get(code="FCS")

        careers_data = [
            {"code": "SIS", "name": "Ingeniería en Sistemas", "faculty": fcet},
            {"code": "INF", "name": "Ingeniería Informática", "faculty": fcet},
            {"code": "ECO", "name": "Ingeniería Económica", "faculty": fce},
            {"code": "ADM", "name": "Administración de Empresas", "faculty": fce},
            {"code": "MED", "name": "Medicina", "faculty": fcs},
            {"code": "ENF", "name": "Enfermería", "faculty": fcs},
        ]

        for c_data in careers_data:
            career, created = MockCareer.objects.get_or_create(**c_data)
            status = 'created' if created else 'already exists'
            self.stdout.write(f"Career {career.code} {status}")

        # Generate fake students
        if MockStudent.objects.count() == 0:
            first_names = ["Carlos", "Ana", "Luis", "Maria", "Jorge", "Lucia", "Jose", "Marta", "Pedro", "Elena"]
            last_names = ["Perez", "Gomez", "Lopez", "Diaz", "Flores", "Torres", "Ramirez", "Rojas", "Cruz", "Vargas"]
            
            careers = MockCareer.objects.all()
            for career in careers:
                for i in range(10): # 10 students per career
                    full_name = f"{random.choice(first_names)} {random.choice(last_names)} {random.choice(last_names)}"
                    reg_num = f"{career.code}{random.randint(200000000, 299999999)}"
                    # Bolivian fake number 7X XXXXXX
                    phone = f"+5917{random.randint(1000000, 9999999)}"
                    
                    MockStudent.objects.create(
                        career=career,
                        full_name=full_name,
                        registration_number=reg_num,
                        phone_number=phone
                    )
            self.stdout.write(self.style.SUCCESS("Successfully seeded 60 mock students!"))
        else:
            self.stdout.write(self.style.WARNING("Students already exist, skipping student generation."))

        self.stdout.write(self.style.SUCCESS("Mock data seeding completed successfully!"))
