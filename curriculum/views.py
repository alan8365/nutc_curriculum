from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from .models import Time, Course
import json
import time as t


# Create your views here.
def index(request):
    template = 'curriculum/index.html'

    if request.method == 'GET':
        sql = "select name from curriculum_course"

        with connection.cursor() as c:
            c.execute(sql)
            all_coursename = c.fetchall()

        sql = "select name from curriculum_teacher where name like '___'"

        with connection.cursor() as c:
            c.execute(sql)
            all_teachername = c.fetchall()

        sql = "select name from curriculum_department"

        with connection.cursor() as c:
            c.execute(sql)
            all_departmentname = c.fetchall()

        return render(request, template, {'all_coursename': all_coursename, 'all_teachername': all_teachername,
                                          'all_departmentname': all_departmentname})

    if request.method == 'POST':
        data = dict(request.POST)

        if data['type'][0] == 'teacher':

            teacher_search = data['teacher_search'][0]

            # sql = '''select c.id, c.name, cl.name, t.name, c.time, c.credit
            #          from curriculum_course as c
            #          join curriculum_classes as cl on c.classes_id = cl.id
            #          join curriculum_teacher as t on t.id = c.teacher_id
            #          where c.teacher_id in (select id from curriculum_teacher as t where t.name like "%''' + str(
            #     teacher_search) + '%")'

            sql = f'''
                SELECT c.id, c.name, cc.name, ct.name, c.time, c.credit
                FROM curriculum_course as c 
                JOIN curriculum_classes cc on c.classes_id = cc.id
                JOIN curriculum_teacher ct on c.teacher_id = ct.id
                WHERE c.teacher_id in (SELECT id FROM curriculum_teacher as t WHERE t.name like '{str(teacher_search)}')
            '''

            with connection.cursor() as c:
                c.execute(sql)
                all_course = c.fetchall()

            response = JsonResponse({'result': all_course})

            return response

        elif data['type'][0] == 'course':

            course_search = data['course_search'][0]

            sql = '''
                select c.id, c.name, cl.name, t.name, c.time, c.credit
                from
                (select *
                from curriculum_course 
                where name like "%''' + str(course_search) + '''%") as c
                join curriculum_classes as cl on c.classes_id = cl.id
                join curriculum_teacher as t on c.teacher_id = t.id
            '''

            with connection.cursor() as c:
                c.execute(sql)
                all_course = c.fetchall()

            response = JsonResponse({'result': all_course})

            return response

        elif data['type'][0] == 'nowork':

            sql = '''
                select name
                from curriculum_teacher as t
                where not exists(select * from curriculum_course as c where t.id = c.teacher_id)
                and t.name like "___"
            '''

            with connection.cursor() as c:
                c.execute(sql)
                all_teacher = c.fetchall()

            response = JsonResponse({'result': all_teacher})

            return response

        elif data['type'][0] == 'avg':

            sql = '''
            select t.name, sum(c.credit) as sc, count(c.id) as cc, avg(c.credit)
            from curriculum_teacher as t
            join curriculum_course as c on t.id = c.teacher_id
            group by t.name
            having sc < (select max(sc)
            from
            (select sum(c.credit) as sc 
            from curriculum_teacher as t
            join curriculum_course as c on t.id = c.teacher_id
            group by t.id) as bubu)
            and sc > (select min(sc)
            from
            (select sum(c.credit) as sc 
            from curriculum_teacher as t
            join curriculum_course as c on t.id = c.teacher_id
            group by t.id) as bubu)
            '''

            with connection.cursor() as c:
                c.execute(sql)
                all_teacher = c.fetchall()

            response = JsonResponse({'result': all_teacher})

            return response

        elif data['type'][0] == 'empty':

            if data.get('department[]'):
                department = data['department[]']

                sql = '''
                    select c.id, c.name, cl.name, t.name, c.time, c.credit
                    from curriculum_course as c 
                    join curriculum_teacher as t on t.id = teacher_id
                    join curriculum_classes as cl on cl.id = c.classes_id
                    join curriculum_department as d on d.id = cl.department_id 
                    where d.name = "''' + department[0] + '" '

                for i in range(1, len(department)):
                    sql += 'or d.name = "' + department[i] + '" '

            else:
                sql = '''
                    select c.id, c.name, cl.name, t.name, c.time, c.credit
                    from curriculum_course as c 
                    join curriculum_teacher as t on t.id = teacher_id
                    join curriculum_classes as cl on cl.id = c.classes_id
                '''

            with connection.cursor() as c:
                c.execute(sql)
                all_courseid = c.fetchall()

            searchset = set()
            empty_search = data['empty_search[]']

            for i in empty_search:
                i = int(i)
                week = (i % 5) + 1
                period = int(i / 5) + 1

                searchset.add(
                    (week, period)
                )

            c = connection.cursor()

            ans = set()

            for i in all_courseid:
                sql = '''
                        SELECT week, period
                        FROM curriculum_coursetime AS ct ,
                               curriculum_time AS t
                        WHERE ct.course_id = "''' + i[0] + '''"
                        AND ct.time_id = t.id
                    '''

                c.execute(sql)
                temp = c.fetchall()
                com = set(temp)
                if com.issubset(searchset) and com != set():
                    ans.add(i)

            c.close()

            response = JsonResponse({'result': list(ans)})

            return response

    return render(request, template)

# def control(request):
#     template = 'curriculum/control.html'
#
#     if request.method == "GET":
#         return render(request, template)
#
#     filename = request.POST.get('filename')
#     file = request.FILES.get('data')
#
#     print(file)
#
#     return render(request, template)
