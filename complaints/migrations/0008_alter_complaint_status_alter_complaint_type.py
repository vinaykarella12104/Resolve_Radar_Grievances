# Generated by Django 5.1 on 2024-09-24 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0007_profile_year_of_study_alter_complaint_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaint',
            name='status',
            field=models.CharField(choices=[('Filed', 'Field'), ('In_progress', 'In Progress'), ('Resolved', 'Resolved'), ('Rejected', 'Rejected')], default='Filed', max_length=20),
        ),
        migrations.AlterField(
            model_name='complaint',
            name='type',
            field=models.CharField(choices=[('Infrastructure', 'Infrastructure'), ('Faculty', 'Faculty'), ('Women Grievance', 'Women Grievance'), ('Ragging', 'Ragging'), ('Hostel', 'Hostel'), ('Transport', 'Transport'), ('Canteen', 'Canteen'), ('Other', 'Other')], default='', max_length=255),
        ),
    ]
