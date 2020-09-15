# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html


import scrapy
from scrapy.loader.processors import Compose, MapCompose, TakeFirst

import re

reference_string = "零一二三四五"


def my_int(s: str):
    if s in reference_string:
        return reference_string.find(s)
    else:
        return int(s)


def delete_combine(li: list) -> str:
    result = ''

    if len(li) == 2:
        if '\n' in li[1]:
            result = li[0]
        else:
            result = li[0] + li[1]
    else:
        result = li[0]

    return result.strip()


# ['資管三Ａ'] -> ['資管', 3, 'Ａ']
def change_to_three_part(li: list) -> dict:
    pattern = f'[{reference_string}]'
    temp = re.split(pattern, li[0])
    if temp[1] == '':
        temp[1] = '1'
    result = {
        'department': temp[0],
        'grade': my_int(re.search(pattern, li[0])[0]),
        'classes': temp[1]
    }
    return result


def compulsory_to_bool(s: str) -> bool:
    return s == '必'


# 星期三第５～７節 (---) -> 星期三第５～７節
def delete_location(s: str) -> str:
    s = re.sub(r'\(.{3,5}\)', '', s)
    s = s.replace(' ', '')
    return s


# 星期三第５～７節 (1403) -> (1403)
def delete_time(s: str) -> str:
    s = re.search(r'\(.{3,5}\)', s)[0]
    return s[1:-1]


class CourseItem(scrapy.Item):
    # D1234 -> 1234
    number = scrapy.Field(
        input_processor=MapCompose(lambda s: int(s[1:])),
        output_processor=TakeFirst()
    )
    class_id = scrapy.Field(
        output_processor=TakeFirst()
    )

    name = scrapy.Field(
        input_processor=Compose(delete_combine),
        output_processor=TakeFirst()
    )

    time = scrapy.Field(
        input_processor=MapCompose(delete_location),
        output_processor=TakeFirst()
    )

    location = scrapy.Field(
        input_processor=MapCompose(delete_time),
        output_processor=TakeFirst()
    )

    compulsory = scrapy.Field(
        input_processor=MapCompose(lambda s: s == '必'),
        output_processor=TakeFirst()
    )

    # '3/0' -> 3
    credit = scrapy.Field(
        input_processor=MapCompose(lambda s: int(s[0])),
        output_processor=TakeFirst()
    )

    popular = scrapy.Field(
        input_processor=MapCompose(lambda s: int(s)),
        output_processor=TakeFirst()
    )

    teacher_name = scrapy.Field(
        output_processor=TakeFirst()
    )

    popular_limit = scrapy.Field(
        output_processor=TakeFirst()
    )


class TeacherItem(scrapy.Item):
    number = scrapy.Field(
        input_processor=MapCompose(lambda s: int(s)),
        output_processor=TakeFirst()
    )

    name = scrapy.Field(
        output_processor=TakeFirst()
    )


class ClassesItem(scrapy.Item):
    number = scrapy.Field(
        output_processor=TakeFirst()
    )

    name = scrapy.Field(
        input_processor=Compose(change_to_three_part),
        output_processor=TakeFirst()
    )

    full_name = scrapy.Field(
        output_processor=TakeFirst()
    )
