from django.apps import AppConfig
from django.db import connection
from .models import *


class CurriculumConfig(AppConfig):
    name = 'curriculum'


def get_sqldict_by_str(sql, model):
    with connection.cursor() as cursor:
        cursor.execute(sql)
        rows = cursor.fetchall()

    all_element = model.objects.raw(sql)
    column = all_element.columns

    ans = []

    for row in rows:
        ans.append(dict(zip(column, row)))

    return ans


def sql_to_dict(raw):
    result = dict()

    # list
    columns = raw.colums
