# Generated by Django 5.1 on 2024-08-26 09:30

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0005_complaint_description_complaint_subject_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaint',
            name='date_filed',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='complaint',
            name='type',
            field=models.CharField(choices=[('Faculty', 'Faculty'), ('Infrastructure', 'Infrastructure'), ('Ragging', 'Ragging'), ('Transport', 'Transport'), ('Canteen', 'Canteen'), ('Hostel', 'Hostel'), ('Other', 'Other')], default='', max_length=255),
        ),
    ]
