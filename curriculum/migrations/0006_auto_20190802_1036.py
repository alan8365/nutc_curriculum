# Generated by Django 2.1.10 on 2019-08-02 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('curriculum', '0005_auto_20190802_1017'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='popular_limit',
            field=models.CharField(default='23 ~ 58', max_length=20),
        ),
    ]
