# Generated by Django 3.2 on 2021-05-05 10:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210502_0845'),
    ]

    operations = [
        migrations.RenameField(
            model_name='videoclips',
            old_name='video_clip',
            new_name='video',
        ),
    ]
