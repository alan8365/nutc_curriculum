# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

from .items import TeacherItem, ClassesItem, CourseItem

from django.db import connection

from scrapy import Spider

from curriculum.models import Teacher, Department, Classes, Time, Course, CourseTime


class SetupMysqlPipeline(object):

    def __init__(self):
        self.cursor = None

    def open_spider(self, spider):
        self.cursor = connection.cursor()

    def process_item(self, item, spider: Spider):

        if isinstance(item, TeacherItem):
            teacher, created = Teacher.objects.get_or_create(
                id=item['number']
            )

            if created or len(teacher.name) < len(item['name']):
                teacher.name = item['name']
                teacher.save()

        elif isinstance(item, ClassesItem):

            department_name = item['name']['department']

            department, _ = Department.objects.get_or_create(
                name=department_name
            )

            classes, _ = Classes.objects.get_or_create(
                id=item['number'],
                department_id=department.id,
                grade=item['name']['grade'],
                classes=item['name']['classes'],
                name=item['full_name']
            )

        return item

    def close_spider(self, spider):

        Teacher.objects.get_or_create(
            id=1,
            name='待聘'
        )

        for i in range(1, 8):
            for j in range(1, 14):
                Time.objects.get_or_create(
                    id=(i - 1) * 13 + j,
                    week=i,
                    period=j
                )

        self.cursor.close()


def my_int(s: str) -> int:
    reference_string = '零一二三四五六日'
    if s in reference_string:
        return reference_string.find(s)
    else:
        return int(s)


def cut_time_to_list(str_of_time: str) -> list:
    if str_of_time == '':
        return []

    period = []
    week = my_int(str_of_time[2])

    if str_of_time.find('/') != -1:
        result = []
        for i in str_of_time.split('/'):
            result += cut_time_to_list(i)

        return result

    str_of_time = str_of_time[4:-1]

    if str_of_time.find('、') != -1:
        first_cuts = str_of_time.split('、')

        for first_cut in first_cuts:

            if first_cut.find('～') != -1:
                second_cuts = first_cut.split('～')

                for i in range(my_int(second_cuts[0]), my_int(second_cuts[1]) + 1):
                    period.append(i)

            elif first_cut.find('、') != -1:
                second_cuts = first_cut.split('、')

                for second_cut in second_cuts:
                    period.append(my_int(second_cut))
            else:
                period.append(my_int(first_cut))

    elif str_of_time.find('～') != -1:
        first_cuts = str_of_time.split('～')

        for i in range(my_int(first_cuts[0]), my_int(first_cuts[1]) + 1):
            period.append(i)

    else:
        period.append(my_int(str_of_time))

    result = [(week, p) for p in period]

    return result


class CourseMysqlPipeline(object):

    def __init__(self):
        self.cursor = None

    def open_spider(self, spider):
        self.cursor = connection.cursor()

    def process_item(self, item: CourseItem, spider: Spider):
        if isinstance(item, CourseItem):
            sql = f'''
                select id from curriculum_teacher
                where name='{item['teacher_name']}'
            '''

            if self.cursor.execute(sql):
                teacher_id = self.cursor.fetchone()[0]
            else:
                teacher_id = 'NULL'

            try:
                classroom = item['location']
            except KeyError:
                classroom = '0000'

            try:
                time = item['time']
            except KeyError:
                time = ''

            sql = f'''
                select id from curriculum_course
                where id = '{item['number']}'
            '''

            if self.cursor.execute(sql):
                sql = f'''
                    UPDATE curriculum_course SET
                    classes_id = '{item['class_id']}',
                    teacher_id = {teacher_id},
                    name = '{item['name']}',
                    time = '{time}',
                    classroom = '{classroom}',
                    popular = {item['popular']},
                    compulsory = {item['compulsory']},
                    credit = {item['credit']},
                    popular_limit = '{item['popular_limit']}' WHERE
                    id = '{item['number']}'
                '''
            else:
                sql = f'''
                    INSERT INTO curriculum_course 
                    (id, name, classroom, popular, compulsory, credit, popular_limit, time, classes_id, teacher_id) 
                    VALUE
                    (
                        '{item['number']}',
                        '{item['name']}',
                        '{classroom}',
                        {item['popular']},
                        {item['compulsory']},
                        {item['credit']},
                        '{item['popular_limit']}',
                        '{time}',
                        {item['class_id']},
                        {teacher_id}
                    ) 
                '''

            self.cursor.execute(sql)

            times_of_course = cut_time_to_list(time)

            sql = f'''
                SELECT id FROM curriculum_coursetime
                WHERE course_id = {item['number']}
            '''

            if not self.cursor.execute(sql):
                for i in times_of_course:
                    time_id = (i[0] - 1) * 13 + i[1]

                    sql = f'''
                        INSERT INTO curriculum_coursetime
                        (course_id, time_id) VALUE 
                        ('{item['number']}', {time_id})
                    '''

                    self.cursor.execute(sql)

        return item

    def close_spider(self, spider):

        self.cursor.close()
