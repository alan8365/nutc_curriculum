from datetime import datetime
import re

from scrapy.loader import ItemLoader
import scrapy

from django.db import connection

from ..items import CourseItem, TeacherItem, ClassesItem


class SetupSpider(scrapy.Spider):
    name = 'setup'

    start_urls = [
        'https://aisap.nutc.edu.tw/public/teacher_list.js',
        'https://aisap.nutc.edu.tw/public/clsno_list.js',
    ]

    def parse(self, response):
        filename = response.url.split('/')[-1]

        if filename == 'teacher_list.js':
            contents = response.text.strip().split('\n')[-8:]

            for content in contents:
                content = content.split('=')[1].strip().replace(';', '')

                teachers = eval(content)
                teacher_loader = ItemLoader(item=TeacherItem())

                for teacher in teachers:
                    teacher_loader.replace_value('number', teacher[0])
                    teacher_loader.replace_value('name', teacher[1])
                    yield teacher_loader.load_item()

        else:
            content = response.text.strip().split('\n')[-4]
            content = content.split('=')[1].strip().replace(';', '')

            class_numbers = eval(content)

            class_number_loader = ItemLoader(item=ClassesItem())
            for class_number in class_numbers:
                class_number_loader.replace_value('number', class_number[0])
                class_number_loader.replace_value('full_name', class_number[1])
                class_number_loader.replace_value('name', class_number[1])
                yield class_number_loader.load_item()


class CurriculumSpider(scrapy.Spider):
    name = "curr"

    def __init__(self, *args, **kwargs):
        super(CurriculumSpider, self).__init__(*args, **kwargs)

        # 學年判斷

        today = datetime.today()
        this_mouth = today.month
        this_year = today.year - 1911

        if this_mouth < 7:
            this_year -= 1
            sem = f'{this_year}2'
        else:
            sem = f'{this_year}1'

        print(sem)

        base_url = f'https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem={sem}&clsno='

        # 從資料庫獲得所有班級
        with connection.cursor() as c:
            sql = '''
                select id from curriculum_classes
            '''
            c.execute(sql)
            all_class = []

            self.start_urls = [base_url + i[0] for i in c.fetchall()]

        self.log(f'start_urls:{len(self.start_urls)}')

    def parse(self, response):

        all_row = response.css(".empty_html tr")

        for i in range(1, len(all_row)):
            row = all_row[i]
            course_loader = ItemLoader(item=CourseItem(), selector=row)

            # https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem=1081&clsno=1120170121&_p=2 -> 1120170121
            class_id = re.search(r'clsno=[\w\d]*', response.url)[0][6:]

            course_loader.replace_css('number', 'td:nth-child(2)::text')
            course_loader.replace_value('class_id', class_id)
            course_loader.replace_css('name', 'td:nth-child(4)::text, td:nth-child(4) > strong::text')
            course_loader.replace_css('time', 'td:nth-child(6)::text')
            course_loader.replace_css('location', 'td:nth-child(6)::text')
            course_loader.replace_css('compulsory', 'td:nth-child(7)::text')
            course_loader.replace_css('credit', 'td:nth-child(8)::text')
            course_loader.replace_css('popular', 'td:nth-child(9) > strong::text')
            course_loader.replace_css('teacher_name', 'td:nth-child(10)::text')
            course_loader.replace_css('popular_limit', 'td:nth-child(11)::text')

            yield course_loader.load_item()

        next_page = response.css('.page > b:last-child > a::attr(href)').get()

        if next_page:
            yield response.follow(next_page)


class TestSpider(scrapy.Spider):
    name = 'test'

    start_urls = [
        'https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem=1081&clsno=1820182251'
    ]

    def parse(self, response):
        all_row = response.css(".empty_html tr")

        for i in range(1, len(all_row)):
            row = all_row[i]
            l = ItemLoader(item=CourseItem(), selector=row)

            # https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem=1081&clsno=1120170121&_p=2 -> 1120170121
            class_id = re.search(r'clsno=[\d\w]*', response.url)[0][6:]

            l.replace_css('number', 'td:nth-child(2)::text')
            l.replace_value('class_id', class_id)
            l.replace_css('name', 'td:nth-child(4)::text, td:nth-child(4) > strong::text')
            l.replace_css('time', 'td:nth-child(6)::text')
            l.replace_css('location', 'td:nth-child(6)::text')
            l.replace_css('compulsory', 'td:nth-child(7)::text')
            l.replace_css('credit', 'td:nth-child(8)::text')
            l.replace_css('popular', 'td:nth-child(9) > strong::text')
            l.replace_css('teacher_name', 'td:nth-child(10)::text')
            l.replace_css('popular_limit', 'td:nth-child(11)::text')

            yield l.load_item()

        next_page = response.css('.page > b:last-child > a::attr(href)').get()

        if next_page:
            yield response.follow(next_page)
