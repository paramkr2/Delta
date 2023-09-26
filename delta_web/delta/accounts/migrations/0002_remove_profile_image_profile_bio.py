# Generated by Django 4.1.6 on 2023-02-17 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='image',
        ),
        migrations.AddField(
            model_name='profile',
            name='bio',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
    ]