# Generated by Django 5.1 on 2024-08-25 07:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('complaints', '0002_delete_profile'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('student', 'Student'), ('staff', 'Staff')], max_length=20)),
                ('department', models.CharField(choices=[('cse', 'CSE'), ('ece', 'ECE'), ('mech', 'MECH'), ('civil', 'CIVIL'), ('eee', 'EEE')], max_length=20)),
                ('contact_number', models.CharField(max_length=15)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
