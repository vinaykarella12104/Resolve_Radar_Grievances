# Generated by Django 5.1 on 2024-08-26 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0004_complaint'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaint',
            name='description',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='complaint',
            name='subject',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='complaint',
            name='type',
            field=models.CharField(choices=[('Faculty', 'Faculty'), ('Infrastructure', 'Infrastructure'), ('Ragging', 'Ragging'), ('Transport', 'Transport'), ('Canteen', 'Canteen'), ('Hostel', 'Hostel'), ('Other', 'Other')], default='Other', max_length=255),
        ),
        migrations.AlterField(
            model_name='complaint',
            name='status',
            field=models.CharField(choices=[('in_progress', 'In Progress'), ('resolved', 'Resolved')], default='in_progress', max_length=20),
        ),
    ]
