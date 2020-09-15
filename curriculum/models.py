from django.db import models
from django.db.models import CASCADE


# Create your models here.

class Department(models.Model):
    # ex:資管科
    name = models.CharField(
        max_length=20
    )

    def __str__(self):
        return self.name


class Classes(models.Model):
    id = models.CharField(
        primary_key=True,
        max_length=20
    )

    # ex:資管科
    department = models.ForeignKey(
        "Department",
        on_delete=CASCADE,
    )

    # ex:4
    grade = models.IntegerField()

    # ex:甲
    classes = models.CharField(
        max_length=10
    )

    name = models.CharField(
        default='',
        max_length=15
    )

    def __str__(self):
        return f'{self.department}{self.grade}{self.classes}'


class Teacher(models.Model):

    id = models.IntegerField(
        primary_key=True,
    )

    # ex:林真伊
    name = models.CharField(
        max_length=30
    )

    def __str__(self):
        return self.name


class Course(models.Model):
    # ex:5555
    id = models.CharField(
        max_length=10,
        primary_key=True
    )

    # ex:資料庫
    name = models.CharField(
        max_length=50
    )

    classroom = models.CharField(
        max_length=6,
        default='0000'
    )

    popular = models.IntegerField(
        default=0
    )

    compulsory = models.BooleanField(
        default=False,
    )

    credit = models.IntegerField(
        default=4
    )

    popular_limit = models.CharField(
        max_length=20,
        default='23 ~ 58'
    )

    classes = models.ForeignKey(
        'Classes',
        on_delete=CASCADE,
        null=True,
    )

    time = models.CharField(
        max_length=100,
        default=''
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        default=None,
        null=True
    )

    def __str__(self):
        return self.name


class Time(models.Model):
    # ex:星期1
    week = models.IntegerField()

    # ex:第1節
    period = models.IntegerField()

    def __str__(self):
        return "禮拜" + str(self.week) + "第" + str(self.period) + "節"

    class Meta:
        unique_together = ('week', 'period')


class CourseTime(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )

    time = models.ForeignKey(
        Time,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('course', 'time')

    def __str__(self):
        return str(self.course) + '在' + str(self.time)
